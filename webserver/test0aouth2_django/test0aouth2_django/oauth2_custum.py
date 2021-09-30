import requests, json
keyrock_URL="172.18.1.5"
KEYROCK_port="3000"
keyrock_BASE_URL="http://"+keyrock_URL+":"+KEYROCK_port
authorize_url = keyrock_BASE_URL+"/oauth2/authorize"
token_url = keyrock_BASE_URL+"/oauth2/token"

#callback url specified when the application was defined
callback_uri = "http://172.18.1.7:80/login"

#client (application) credentials - located at apim.byu.edu
client_id = '4601658a-fa48-4d96-b9ba-905045f04909'
client_secret = '46c4e191-29cd-4d34-b9cc-05d807e106cb'

authorization_redirect_url = authorize_url + '?response_type=code&state=xyz&client_id=' + client_id + '&redirect_uri=' + callback_uri + '&scope=jwt'
#http://localhost:3000/oauth2/authorize?response_type=code&state=xyz&client_id=02d9b583-8e28-48b0-bc24-bd9203c5dd24&scope=permant&redirect_uri=http%3A%2F%2F127.0.0.1%3A8000%2Flogin

def getToken(authorization_code):
    data = {'grant_type': 'authorization_code', 'code': authorization_code, 'redirect_uri': callback_uri}
    # print ("requesting access token")
    access_token_response = requests.post(token_url, data=data, verify=False, allow_redirects=False, auth=(client_id, client_secret))

    # print ("response")
    print (access_token_response.headers)
    # print ('body: ' + access_token_response.text)

    # we can now use the access_token as much as we want to access protected resources.
    tokens = json.loads(access_token_response.text)
    access_token = tokens['access_token']
    refresh_token = tokens['refresh_token']
    print ("access token: " + access_token)
    print ("refresh token: " + refresh_token)
    return access_token
