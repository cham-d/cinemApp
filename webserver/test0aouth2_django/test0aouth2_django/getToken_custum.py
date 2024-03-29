__author__ = 'bdm4'

import requests, json
import subprocess
import sys


def getToken(authorization_code):
    data = {'grant_type': 'authorization_code', 'code': authorization_code, 'redirect_uri': callback_uri}
    print ("requesting access token")
    access_token_response = requests.post(token_url, data=data, verify=False, allow_redirects=False, auth=(client_id, client_secret))

    print ("response")
    print (access_token_response.headers)
    print ('body: ' + access_token_response.text)

    # we can now use the access_token as much as we want to access protected resources.
    tokens = json.loads(access_token_response.text)
    access_token = tokens['access_token']
    #refresh_token = tokens['refresh_token']
    print ("access token: " + access_token)

    api_call_headers = {'Authorization': 'Bearer ' + access_token}
    #api_call_response = requests.get(test_api_url, headers=api_call_headers, verify=False)

    #print (api_call_response.text)