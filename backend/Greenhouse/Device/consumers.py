import json
from channels.generic.websocket import AsyncWebsocketConsumer
from middleware.token_auth import validate_jwt_token  # Import your token validation function

class SensorDataConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        print("WebSocket connected")
        headers = dict(self.scope["headers"])
        jwt_token = headers.get(b'x-jwt-token', b'').decode('utf-8')
        validated_token = await validate_jwt_token(jwt_token)  # Await the coroutine here
        if not validated_token or not validated_token.is_authenticated:
            print("JWT token is invalid or missing. Closing connection.")
            await self.close(code=403)
            return
        self.user = validated_token
        self.user_id = str(self.user.id)
        self.group_name = f'sensor_data_{self.user_id}'  # Unique group name for sensor data

        # Add user to sensor data group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()
        print(f"WebSocket accepted for user: {self.user.username}")

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            # Remove user from sensor data group
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

    async def sensor_data_message(self, event):
        # Send sensor data message to the WebSocket client
        message = event['message']
        print(f"Sending sensor data message to {self.user.username}: {message}")
        await self.send(text_data=json.dumps({'message': message}))



class DeviceStatusConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        print("WebSocket connected")
        headers = dict(self.scope["headers"])
        jwt_token = headers.get(b'x-jwt-token', b'').decode('utf-8')
        validated_token = await validate_jwt_token(jwt_token)  # Await the coroutine here
        if not validated_token or not validated_token.is_authenticated:
            print("JWT token is invalid or missing. Closing connection.")
            await self.close(code=403)
            return
        self.user = validated_token
        self.user_id = str(self.user.id)
        self.group_name = f'device_status_{self.user_id}'  # Unique group name for device status

        # Add user to device status group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()
        print(f"WebSocket accepted for user: {self.user.username}")

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            # Remove user from device status group
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

    async def device_status_message(self, event):
        # This method handles events of type 'device_status_message'
        print("Received device_status_message event:", event)
        message = event['message']
        print(f"Sending device status message to {self.user.username}: {message}")
        await self.send(text_data=json.dumps({'message': message}))
