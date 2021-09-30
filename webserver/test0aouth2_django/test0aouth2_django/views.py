import jwt
from django.shortcuts import redirect, render


from test0aouth2_django.oauth2_custum import *


def getCode(request):
    return redirect(authorization_redirect_url)

def goToLogin(request):
    code = request.GET.get('code')
    if code:
        try:
            token = getToken(code)
            request.session['jwtToken'] = token

            return redirect('determineuser')
        except:
            return render(request,'login.html')
    else:
        return render(request,'login.html')
    
def determineUser(request):
    try:
        context=getContext(request)
        request.session['context'] = context
        userType=context['userType']
        if userType=="OWNER":
            return redirect('owner')  
        elif userType=="USER":
            return redirect('movies')
        else:
            return redirect('adminpage')  
    except Exception as ex:
        print(ex)
        return redirect('login')

def viewMovies(request):
    try:
        context=request.session['context']
        userType=context['userType']
        if userType=="USER":
            return render(request,'movies.html',context)
        else:
            return redirect('notauth')
    except Exception as ex:
        print(ex)
        return redirect('login')  

def ownerView(request):
    try:
        context=request.session['context']
        userType=context['userType']
        if userType=="OWNER":
            return render(request,'owner.html',context)
        else:
            return redirect('notauth')
    except Exception as ex:
        print(ex)
        return redirect('login')  

def feed(request):
    try:
        token=request.session['jwtToken'] 
        or_token=token 
        token =  token.encode('utf-8')
        key = "cd957f0205f3a38b"
        data = jwt.decode(token, key, algorithms=["HS256"])
        username = data["username"]
        userid=data["id"]
        userTypeDetails=data["organizations"]
        userType=(userTypeDetails[0])["name"]
        if userType=="USERS":
            context={"username":username,"token":or_token,"userType":"USER","userid":userid,"feed_page": "active"}
            return render(request,'feed.html',context)
        else:
            return redirect('notauth')
    except Exception as ex:
        print(ex)
        return redirect('login')  


def notauth(request):
    try:
        context=request.session['context']
        return render(request,'notauth.html',context)
    except Exception as ex:
        print(ex)
        return redirect('login')  

def getContext(request):
        token=request.session['jwtToken']
        or_token=token
        token =  token.encode('utf-8')
        key = "cd957f0205f3a38b"
        data = jwt.decode(token, key, algorithms=["HS256"])
        username = data["username"]
        userid=data["id"]
        userTypeDetails=data["organizations"]
        userType=(userTypeDetails[0])["name"]
        if userType=="CINEMAOWNERS":
            context={"username":username,"token":or_token,"userType":"OWNER","userid":userid,"mymovies_page": "active"}
        elif userType=="USERS":
            context={"username":username,"token":or_token,"userType":"USER","userid":userid,"movie_page": "active"}
        return context

        
def Favorites(request):
    try:
        token=request.session['jwtToken'] 
        or_token=token 
        token =  token.encode('utf-8')
        key = "cd957f0205f3a38b"
        data = jwt.decode(token, key, algorithms=["HS256"])
        username = data["username"]
        userid=data["id"]
        userTypeDetails=data["organizations"]
        userType=(userTypeDetails[0])["name"]
        if userType=="USERS":
            context={"username":username,"token":or_token,"userType":"USER","userid":userid,"favorite_page": "active"}
            return render(request,'Favorites.html',context)
        else:
            return redirect('notauth')
    except Exception as ex:
        print(ex)
        return redirect('login')  

        
def cinemas(request):
    try:
        context=request.session['context']
        userType=context['userType']
        try:
            context.pop("mymovies_page")
        except Exception as ex:
            print(ex)
        context["mycinemas_page"] = "active"
        
        if userType=="OWNER":
            return render(request,'mycinemas.html',context)
        else:
            return redirect('notauth')
    except Exception as ex:
      print(ex)
      return redirect('login')  

def logout(request):
    try:
        token=request.session['jwtToken']
        token =  token.encode('utf-8')
        key = "cd957f0205f3a38b"
        data = jwt.decode(token, key, algorithms=["HS256"])
        app_id = data["app_id"]
        request.session.flush()
        # return redirect('login')
        return redirect('http://172.18.1.5:3000/auth/external_logout?_method=DELETE&client_id='+app_id)
    except Exception as ex:
      print(ex)
      return redirect('login')  

def handle404(request, exception):
 return render(request, '404.html', status=404)

    
