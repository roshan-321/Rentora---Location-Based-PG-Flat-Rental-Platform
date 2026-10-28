
import asyncio
import json
import logging

from channels.consumer import AsyncConsumer
from channels.exceptions import StopConsumer


class MyAsyncConsumer(AsyncConsumer):

    async def websocket_connect(self, event):
        await self.send({
            "type": "websocket.accept"
        })

    async def websocket_receive(self, event):
        try:
            raw_message = event.get("text") or ""
            data = json.loads(raw_message)
            question = data.get("message", "").strip()

            if not question:
                return

            from .chat import get_chatbot_response

            response = await asyncio.to_thread(
                get_chatbot_response,
                question
            )

            await self.send({
                "type": "websocket.send",
                "text": str(response)
            })

        except Exception:
            logging.exception("Rentora chatbot error")

            await self.send({
                "type": "websocket.send",
                "text": "Sorry, something went wrong. Please try again."
            })

    async def websocket_disconnect(self, event):
        raise StopConsumer()
