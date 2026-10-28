
from pathlib import Path
import json

import chromadb
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage, ToolMessage

from .tools import search_properties


# ================= ENVIRONMENT =================

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR.parent / ".env")

KNOWLEDGE_FILE = BASE_DIR / "knowledge_base.txt"
CHROMA_DIR = BASE_DIR / "chroma_db"


# ================= CHROMADB =================

client = chromadb.PersistentClient(
    path=str(CHROMA_DIR)
)

collection = client.get_or_create_collection(
    name="rentora_knowledge"
)


# ================= EMBEDDING MODEL =================

model = SentenceTransformer(
    "sentence-transformers/all-MiniLM-L6-v2"
)


# ================= INITIAL INDEXING =================

def index_knowledge_base():
    """Index the knowledge base when the ChromaDB collection is empty."""

    if collection.count() > 0:
        print(
            f"Existing knowledge base found: "
            f"{collection.count()} chunks. Skipping indexing."
        )
        return

    print("ChromaDB is empty. Starting initial indexing...")

    if not KNOWLEDGE_FILE.exists():
        print(f"ERROR: Knowledge file not found: {KNOWLEDGE_FILE}")
        return

    loader = TextLoader(
        str(KNOWLEDGE_FILE),
        encoding="utf-8",
    )

    documents = loader.load()

    for document in documents:
        document.metadata["source"] = KNOWLEDGE_FILE.name

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
    )

    chunks = splitter.split_documents(documents)

    if not chunks:
        print("WARNING: Knowledge file is empty.")
        return

    texts = [chunk.page_content for chunk in chunks]

    embeddings = model.encode(
        texts,
        show_progress_bar=True,
    ).tolist()

    collection.upsert(
        ids=[f"knowledge_base_{i}" for i in range(len(chunks))],
        documents=texts,
        embeddings=embeddings,
        metadatas=[
            {"source": KNOWLEDGE_FILE.name}
            for _ in chunks
        ],
    )

    print(f"Indexed {len(chunks)} knowledge chunks.")


index_knowledge_base()


# ================= LLM =================

llm = ChatGroq(
    model="openai/gpt-oss-20b",
    temperature=0.3,
)

tools = [search_properties]

llm_with_tools = llm.bind_tools(tools)

tools_by_name = {
    tool.name: tool
    for tool in tools
}


# ================= CHATBOT RESPONSE =================

def get_chatbot_response(question):
    question = question.strip()

    if not question:
        return "Please enter a question."

    # Retrieve relevant knowledge-base context.
    context = ""
    total_chunks = collection.count()

    if total_chunks > 0:
        question_embedding = model.encode(question).tolist()

        results = collection.query(
            query_embeddings=[question_embedding],
            n_results=min(3, total_chunks),
        )

        retrieved_documents = results["documents"][0] or []
        context = "\n\n".join(retrieved_documents)

    system_message = SystemMessage(
        content=f"""
You are the Rentora Assistant.

General rules:
- Answer Rentora questions using the provided knowledge context.
- For property search requests, use the search_properties tool.
- Extract the property type, maximum rent, location, and suitability
  from the user's request when provided.
- Use only property information returned by the tool.
- Never invent property listings, prices, addresses, or amenities.
- If no properties match, clearly say that no matching properties were found.
- Never claim to book a property or perform an action.
- If information is unavailable, say so clearly.

Property response formatting rules:
- Never display the internal property ID.
- Never use Markdown tables for property results.
- Display each property separately.
- Show available details line by line using this format:

  Name: [property name]
  Rent: ₹[monthly rent] per month
  Property Type: [property type]
  Suitable For: [suitability]
  Description: [description]
  Address: [address, if available]
  Contact: [contact number, if available]
  Features: [features, if available]

- Do not display fields whose values are missing, null, or empty.
- Include only details present in the tool result.
- Keep the response clean, readable, and concise.
- If multiple properties are returned, separate them clearly.
- Do not add details that are not present in the tool result.

- When property search results are available, start with:
  "Here are the matching properties for your PG or flat requirements:"

- Then display each property's details line by line.
- If no properties match, say:
  "Sorry, I couldn't find any properties matching your requirements."
- Do not show the introduction when the user is only asking a general question.

Knowledge context:
{context}
"""
    )

    messages = [
        system_message,
        HumanMessage(content=question),
    ]

    # Execute tool calls with a maximum of five rounds.
    for _ in range(5):
        response = llm_with_tools.invoke(messages)
        messages.append(response)

        if not response.tool_calls:
            content = response.content

            if isinstance(content, str):
                return content

            if content:
                return str(content)

            return "I couldn't generate a response."

        for tool_call in response.tool_calls:
            tool_name = tool_call["name"]
            tool_args = tool_call["args"]

            if tool_name not in tools_by_name:
                tool_result = {"error": "Unknown tool."}
            else:
                try:
                    tool_result = tools_by_name[tool_name].invoke(
                        tool_args
                    )
                except Exception as exc:
                    tool_result = {
                        "error": f"Tool execution failed: {str(exc)}"
                    }

            # Convert tool result to JSON text.
            if not isinstance(tool_result, str):
                tool_result = json.dumps(
                    tool_result,
                    ensure_ascii=False,
                    default=str,
                )

            messages.append(
                ToolMessage(
                    content=tool_result,
                    tool_call_id=tool_call["id"],
                )
            )

    return "I couldn't complete the request. Please try again."
