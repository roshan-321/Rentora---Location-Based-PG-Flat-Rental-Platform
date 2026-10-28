# 🏠 Rentora – Location-Based PG/Flat Rental Platform

Rentora is a backend-driven rental platform that connects **property owners** with **tenants** looking for PGs and flats near their preferred location. It provides secure REST APIs, role-based access, Google Sign-In, and an AI chatbot that can answer questions and search properties for users.

---

## ✨ Features

- **Location-based search** – find PGs and flats based on location
- **Role-based access control (RBAC)** – separate permissions for tenants, property owners, and admins
- **Secure authentication**
  - JWT-based authentication for API endpoints
  - OAuth 2.0 Google Sign-In
- **Property & rental management** – owners can list properties; tenants can browse and explore them; admins can oversee users and listings
- **AI chatbot** built with LangChain and Groq
  - RAG (Retrieval-Augmented Generation) using ChromaDB and Sentence Transformers for knowledge retrieval
  - Tool calling to run property searches via APIs and Django ORM
- **PostgreSQL** database with well-structured Django ORM models for users, properties, and rental data

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Backend | Python, Django, Django REST Framework |
| Database | PostgreSQL |
| Authentication | JWT, OAuth 2.0 (Google Sign-In) |
| AI / LLM | LangChain, Groq, RAG |
| Vector Store | ChromaDB |
| Embeddings | Sentence Transformers |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- PostgreSQL
- A Google Cloud OAuth 2.0 client (for Google Sign-In)
- A Groq API key (for the chatbot)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/roshan-321/rentora.git
cd rentora

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file in the project root and add your own values:

```env
SECRET_KEY=your_django_secret_key
DEBUG=True

DB_NAME=rentora_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GROQ_API_KEY=your_groq_api_key
```

### Database Setup & Run

```bash
python manage.py migrate
python manage.py createsuperuser   # creates the admin account
python manage.py runserver
```

The app will be available at `http://127.0.0.1:8000/`.

---

## 🤖 AI Chatbot

The chatbot is built with **LangChain** and **Groq**, and works in two ways:

1. **RAG-based answers** – documents are embedded using Sentence Transformers and stored in ChromaDB. Relevant context is retrieved to answer user questions accurately.
2. **Tool-based property search** – the chatbot can call tools that query property data through APIs and the Django ORM, so users can search for rentals using natural language.

---

## 🔐 Authentication & Roles

| Role | Access |
|---|---|
| **Tenant** | Browse and search properties, use the chatbot |
| **Property Owner** | Create and manage property listings |
| **Admin** | Manage users and property listings, access the Django admin panel |

All protected endpoints require a valid **JWT access token**:

```
Authorization: Bearer <your_access_token>
```

## 🔮 Future Improvements

- Booking and payment integration
- Reviews and ratings for properties
- Map-based property view
- Real-time notifications

---

## 👤 Author

**Roshan Kumar**

- GitHub: [roshan-321](https://github.com/roshan-321)
- LinkedIn: [roshan-kumar-321abc](https://linkedin.com/in/roshan-kumar-321abc)
- Email: rajputroshansingh579@gmail.com
