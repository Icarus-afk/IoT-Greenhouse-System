import json
from channels.generic.websocket import AsyncWebsocketConsumer
from middleware.token_auth import validate_jwt_token
from urllib.parse import parse_qs


class SensorDataConsumer(AsyncWebsocketConsumer):

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
        self.group_name = f'sensor_data_{self.user_id}'

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
        print("Received data from WebSocket")
        print(f"Raw data received: {text_data}")

        try:
            # Attempt to parse the received text data as JSON
            try:
                text_data_json = json.loads(text_data)
                print(f"Parsed JSON: {text_data_json}")
            except json.JSONDecodeError:
                # Handle as plain string if JSON parsing fails
                text_data_json = {'message': text_data}
                print(f"Message treated as plain string: {text_data_json}")

            message = text_data_json.get('message', '')
            device_id = text_data_json.get('device_id', None)

            # Check if the message is a string that needs further parsing
            if isinstance(message, str) and message.startswith("New sensor data:"):
                try:
                    # Extract sensor data values
                    sensor_data_str = message[len("New sensor data:"):].strip()
                    sensor_values = [float(value.strip()) for value in sensor_data_str.split(",")]

                    # Construct the message dictionary
                    message = {
                        'temperature': sensor_values[0],
                        'humidity': sensor_values[1],
                        'soil_moisture': sensor_values[2],
                        'rain_level': sensor_values[3],
                        'light_lux': sensor_values[4],
                        'device_id': device_id or "Unknown"
                    }
                    print(f"Parsed sensor data message: {message}")
                except (ValueError, IndexError) as e:
                    print(f"Failed to parse sensor data: {e}")
                    message = {'error': 'Failed to parse sensor data'}

            # Send the parsed data back to the client
            await self.send(text_data=json.dumps(message))
        
        except Exception as e:
            print(f"An error occurred: {e}")

    async def sensor_data_message(self, event):
        # Ensure message is not empty
        message = event.get('message', {})
        device_id = event.get('device_id', 'None')

        if not message:
            print(f"Received empty message from {self.user.username}")
            return

        # Check if message is a dictionary
        if isinstance(message, dict):
            print(f"Sending sensor data message to {self.user.username}: {message}")
            await self.send(text_data=json.dumps({
                'temperature': message.get('temperature'),
                'humidity': message.get('humidity'),
                'soil_moisture': message.get('soil_moisture'),
                'rain_level': message.get('rain_level'),
                'light_lux': message.get('light_lux'),
                'device_id': device_id,
            }))
        else:
            print(f"Unsupported message type from {self.user.username}: {message}")


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
