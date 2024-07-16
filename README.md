# IoT Greenhouse System Documentation

## Table of Contents
1. [Overview](#overview)
2. [Device Setup](#device-setup)
3. [Server Setup](#server-setup)
4. [Additional Requirements](#additional-requirements)
5. [API Testing](#api-testing)

## Overview

This project contains the code for an IoT Greenhouse System, consisting of a device component and a server component. The following instructions will guide you through setting up both parts of the system.

## Device Setup

This script is created to simulate a device that sends sensor data to the server for development purposes. The device script is written in Python and requires the following steps to run it:

1. Navigate to the `Device` folder in your terminal.

2. Activate the pre-existing virtual environment:
   - Windows: `.\device\Scripts\activate`
   - Unix/MacOS: `source device/bin/activate`

   Note: If you prefer to create a new virtual environment, use: `python -m venv device`

3. Install the required dependencies: `pip install -r requirements.txt`
4. 4. Run the device script:   `python device.py`

Ensure you have the necessary permissions to install packages and run scripts on your system.

## Server Setup

1. Navigate to the `backend` folder.

2. Activate the virtual environment:
- Windows: `.\backend\Scripts\activate`
- Unix/MacOS: `source backend/bin/activate`

3. Go to the `Greenhouse` folder and install the dependencies: `pip install -r requirements.txt`
4. Create a `.env` file in the `Greenhouse` folder with the following variables: 
         - ```SECRET_KEY=<Django secret key>```
         - ```JWT_SECRET_KEY=<JWT secret key>```
         - ```DB_PASS=<MySQL database password>```

5. Run the database migrations: `python manage.py migrate`
6. Start the server: `python manage.py runserver`
7. In a separate terminal, run the MQTT client: `python mqtt_client.py`. This script subscribes to several topics and is responsible for updating the database with sensor data, status, and other information.

## Additional Requirements

The following software and services are required to run the backend:

- MySQL
- Redis

Ensure these are installed and properly configured before running the server.

## API Testing

A Postman collection is provided in the `backend` folder for API testing. Import this collection into Postman to test the APIs. 

Please refer to the API documentation within the Postman collection for detailed information on each endpoint.
