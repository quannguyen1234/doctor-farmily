import jwt
import requests
import json
from time import time
import datetime,os


# Enter your API key and your API secret

API_KEY=os.getenv('API_ZOOM_KEY','zsao3sjISC298fy9C2tiXg')
API_SECRET=os.getenv('API_ZOOM_SECRET','1BsWcRf4aRHXt9CpR4Q91Xc71BKfgcuxUzsZ')
# create a function to generate a token
# using the pyjwt library


# Create a function to generate a token using the pyjwt library
def generateToken():
    payload = {
        'iss': API_KEY,
        'exp': time() + 5000
    }
    token = jwt.encode(payload, API_SECRET, algorithm='HS256')
    return token

# Create JSON data for the POST request
meeting_details = {
    "topic": "The title of your Zoom meeting",
    "type": 2,
    "start_time": datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S'),
    "duration": "45",
    "timezone": "Europe/Madrid",
    "agenda": "Test meeting",
    "settings": {
        "host_video": "false",
        "participant_video": "true",
        "join_before_host": "true",
        "mute_upon_entry": "false",
        "watermark": "true",
        "audio": "voip",
        "auto_recording": "cloud"
    }
}

# Send a request with headers including the token and meeting details
def createMeeting():
    token = generateToken()
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    response = requests.post(
        'https://api.zoom.us/v2/users/me/meetings',
        headers=headers,
        data=json.dumps(meeting_details)
    )
    print("\nCreating Zoom meeting...\n")
    print(response.text)
    data = response.json()
    join_URL = data["join_url"]
    # meeting_password = data["password"]
    return join_URL 

# Run the createMeeting function




