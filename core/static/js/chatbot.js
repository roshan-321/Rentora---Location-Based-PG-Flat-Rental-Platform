document.addEventListener("DOMContentLoaded", function () {

    // ================= ASK AI CHATBOT =================

    const askAiBtn = document.getElementById("askAiBtn");
    const askAiModal = document.getElementById("askAiModal");
    const closeAiBtn = document.getElementById("closeAiBtn");
    const aiMessageInput = document.getElementById("aiMessageInput");
    const sendAiBtn = document.getElementById("sendAiBtn");
    const aiChatBody = document.getElementById("aiChatBody");

    let chatSocket = null;
    let isWaitingForReply = false;

    if (
        askAiBtn &&
        askAiModal &&
        closeAiBtn &&
        aiMessageInput &&
        sendAiBtn &&
        aiChatBody
    ) {

        // ================= CONNECT WEBSOCKET =================

        function connectWebSocket() {

            if (
                chatSocket &&
                (
                    chatSocket.readyState === WebSocket.OPEN ||
                    chatSocket.readyState === WebSocket.CONNECTING
                )
            ) {
                return;
            }

            const protocol =
                window.location.protocol === "https:" ? "wss:" : "ws:";

            const wsUrl = `${protocol}//${window.location.host}/ws/chat/`;

            chatSocket = new WebSocket(wsUrl);

            chatSocket.onopen = function () {
                console.log("Rentora chatbot connected.");
            };

            chatSocket.onmessage = function (event) {

                removeTypingIndicator();
                addMessage(event.data, "ai");

                isWaitingForReply = false;
                sendAiBtn.disabled = false;
            };

            chatSocket.onerror = function (error) {
                console.error("WebSocket error:", error);
            };

            chatSocket.onclose = function () {

                console.log("Rentora chatbot disconnected.");

                removeTypingIndicator();

                if (isWaitingForReply) {
                    addMessage(
                        "Connection lost. Please try sending your message again.",
                        "ai"
                    );
                }

                isWaitingForReply = false;
                sendAiBtn.disabled = false;
                chatSocket = null;
            };
        }


        // ================= DISPLAY MESSAGES =================

        function addMessage(message, sender) {

            const messageElement = document.createElement("div");

            messageElement.classList.add(
                "ask-ai-message",
                sender === "user" ? "user-message" : "ai-message"
            );

            messageElement.textContent = message;

            aiChatBody.appendChild(messageElement);
            aiChatBody.scrollTop = aiChatBody.scrollHeight;
        }


        // ================= TYPING INDICATOR =================

        function showTypingIndicator() {

            removeTypingIndicator();

            const typingElement = document.createElement("div");

            typingElement.id = "typingIndicator";
            typingElement.classList.add(
                "ask-ai-message",
                "ai-message",
                "typing-indicator"
            );

            typingElement.textContent = "Rentora is typing...";

            aiChatBody.appendChild(typingElement);
            aiChatBody.scrollTop = aiChatBody.scrollHeight;
        }


        function removeTypingIndicator() {

            const typingElement =
                document.getElementById("typingIndicator");

            if (typingElement) {
                typingElement.remove();
            }
        }


        // ================= OPEN CHATBOT =================

        askAiBtn.addEventListener("click", function () {

            askAiModal.classList.add("active");
            askAiModal.setAttribute("aria-hidden", "false");
            askAiBtn.setAttribute("aria-expanded", "true");

            connectWebSocket();

            aiMessageInput.focus();
        });


        // ================= CLOSE CHATBOT =================

        closeAiBtn.addEventListener("click", function () {

            askAiModal.classList.remove("active");
            askAiModal.setAttribute("aria-hidden", "true");
            askAiBtn.setAttribute("aria-expanded", "false");
        });


        // ================= SEND MESSAGE =================

        function sendMessage() {

            const message = aiMessageInput.value.trim();

            if (!message || isWaitingForReply) {
                return;
            }

            if (!chatSocket || chatSocket.readyState !== WebSocket.OPEN) {

                addMessage(
                    "Connecting to Rentora Assistant. Please try again shortly.",
                    "ai"
                );

                connectWebSocket();

                return;
            }

            addMessage(message, "user");

            aiMessageInput.value = "";

            isWaitingForReply = true;
            sendAiBtn.disabled = true;

            showTypingIndicator();

            try {

                chatSocket.send(
                    JSON.stringify({
                        message: message
                    })
                );

            } catch (error) {

                removeTypingIndicator();

                addMessage(
                    "Unable to send your message. Please try again.",
                    "ai"
                );

                isWaitingForReply = false;
                sendAiBtn.disabled = false;

                console.error("Chatbot send error:", error);
            }
        }


        // ================= SEND BUTTON =================

        sendAiBtn.addEventListener("click", sendMessage);


        // ================= ENTER KEY =================

        aiMessageInput.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {
                event.preventDefault();
                sendMessage();
            }

            if (event.key === "Escape") {
                askAiModal.classList.remove("active");
                askAiModal.setAttribute("aria-hidden", "true");
                askAiBtn.setAttribute("aria-expanded", "false");
            }
        });

    }

});