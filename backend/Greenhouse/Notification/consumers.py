import json
from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer
from middleware.token_auth import validate_jwt_token  # Import your token validation function

class NotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        print("WebSocket connected")
        
        # Extract query string and parse it
        query_string = self.scope['query_string'].decode('utf-8')
        query_params = parse_qs(query_string)
        jwt_token = query_params.get('token', [''])[0]
        print(f"JWT Token received: {jwt_token}")  # Debug statement to print the token

        validated_token = await validate_jwt_token(jwt_token)  # Await the coroutine here
        print(f"Validated Token: {validated_token}")  # Debug statement to print the validation result

        if not validated_token or not validated_token.is_authenticated:
            print("JWT token is invalid or missing. Closing connection.")
            await self.close(code=403)
            return
        self.user = validated_token
        self.user_id = str(self.user.id)
        self.group_name = f'notification_{self.user_id}'

        # Add user to notification group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()
        print(f"WebSocket accepted for user: {self.user.username}")

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            # Remove user from notification group
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )
            print(f"WebSocket disconnected for user: {self.user.username}")

    async def receive(self, text_data):
        # Handle received message (if needed)
        data = json.loads(text_data)
        message = data.get('message', '')
        print(f"Received message from {self.user.username}: {message}")

        # Example of echoing back the received message
        await self.send(text_data=json.dumps({'message': f"Received: {message}"}))

    async def notification_message(self, event):
        # Send notification message to the WebSocket client
        message = event['message']
        device_id = event.get('device_id', None)
        print(f"Sending notification message to {self.user.username}: {message}, Device ID: {device_id}")
        await self.send(text_data=json.dumps({
            'message': message,
            'device_id': device_id
        }))