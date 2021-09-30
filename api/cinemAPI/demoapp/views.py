from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from demoapp.models import Cinemas, Movies,Favourites,Subs,CheckSub
from demoapp.serializers import CinemasSerializer, FavoritesSerializer, MoviesSerializer, SubSerializer,CheckSubSerializer
from bson.objectid import ObjectId
from django.core.files.storage import default_storage
import json
import ast


# Create your views here.

@csrf_exempt
def movieexists(request,id=0):
    if request.method=='GET':
        movie_for_Name=Movies.objects.filter(_id= ObjectId(id))
        # movies_serializer_name=MoviesSerializer(movie_for_Name,many=True)
        if movie_for_Name.exists():
            return JsonResponse("True",safe=False)
        else:
            return JsonResponse("False",safe=False)
    else:
         return JsonResponse("wrong",safe=False)

@csrf_exempt
def movieAPI(request,id=0):
    searchCinema = request.GET.get('searchCinema' , '')
    searchCategory = request.GET.get('searchCategory' , '')
    searchDate = request.GET.get('searchDate' , '')
    searchTitle = request.GET.get('searchTitle' , '')
    test= request.GET.get('' , 'ok')
    print (test)

    if (request.method=='GET'):
        if (searchTitle!=''):
            movies=Movies.objects.filter(TITLE__icontains=searchTitle)
        elif (searchCategory!=''):
            movies=Movies.objects.filter(CATEGORY__icontains=searchCategory)
        elif (searchDate!=''):
            startDate,endDate=searchDate.split(',',1)
            movies=Movies.objects.filter(STARTDATE__gte=startDate).filter(ENDDATE__lte=endDate)
        elif (searchCinema!=''):
            movies=Movies.objects.filter(CINEMANAME=searchCinema)
        else:    
            movies = Movies.objects.all()

        movies_serializer=MoviesSerializer(movies,many=True)
        print(movies_serializer.data)
        return JsonResponse(movies_serializer.data,safe=False)
    elif request.method=='POST':
        
        movies_data=JSONParser().parse(request)
        print(movies_data)
        movies_serializer=MoviesSerializer(data=movies_data)
        if movies_serializer.is_valid():
            movies_serializer.save()
            return JsonResponse(movies_serializer.data,safe=False)
        print(movies_serializer.errors)
        return JsonResponse("Failed to Add",safe=False)
    elif request.method=='PUT':
        movies_data=JSONParser().parse(request)    
        movie=Movies.objects.get(_id= ObjectId(id))
        movies_serializer=MoviesSerializer(movie,data=movies_data)
        print(movies_data)
        if movies_serializer.is_valid():
            movies_serializer.save()
            return JsonResponse("Updated Successfully",safe=False)
        return JsonResponse("Failed to Update")
    elif request.method=='DELETE':
        print(id)
        movie=Movies.objects.get(_id=ObjectId(id))
        movie.delete()
        return JsonResponse("Deleted Successfully",safe=False)

@csrf_exempt
def favoritesAPI(request,id=0):
    if request.method=='GET':
        favorite = Favourites.objects.all()
        favorites_serializer=FavoritesSerializer(favorite,many=True)
        return JsonResponse(favorites_serializer.data,safe=False)
    elif request.method=='POST':
        favourites_data=JSONParser().parse(request)
        favorites_serializer=FavoritesSerializer(data=favourites_data)
        if favorites_serializer.is_valid():
            favorites_serializer.save()
            lastFavObjct=Favourites.objects.latest('_id')
            favID=lastFavObjct._id
            print(type(favID))
            return JsonResponse(str(favID),safe=False)
        return JsonResponse("Failed to Add",safe=False)
    elif request.method=='PUT':
        favourites_data=JSONParser().parse(request)
        favorite=Favourites.objects.get(_id= ObjectId(favourites_data['_id']))
        favorites_serializer=FavoritesSerializer(favorite,data=favourites_data)
        if favorites_serializer.is_valid():
            favorites_serializer.save()
            return JsonResponse("Updated Successfully",safe=False)
        return JsonResponse("Failed to Update")
    elif request.method=='DELETE':
        favorite=Favourites.objects.get(_id=ObjectId(id))
        favorite.delete()
        return JsonResponse("Deleted Successfully",safe=False)

@csrf_exempt
def cinemasAPI(request,id=0):
    if request.method=='GET':
        print(id)                                     
        cinema=Cinemas.objects.filter(OWNER=id)
        cinemas_serializer=CinemasSerializer(cinema,many=True)
        return JsonResponse(cinemas_serializer.data,safe=False)
    elif request.method=='POST':
        cinemas_data=JSONParser().parse(request)
        cinemas_serializer=CinemasSerializer(data=cinemas_data)
        if cinemas_serializer.is_valid():
            cinemas_serializer.save()
            return JsonResponse(cinemas_serializer.data,safe=False)
        return JsonResponse("Failed to Add",safe=False)
    elif request.method=='PUT':
        cinemas_data=JSONParser().parse(request)    
        cinema=Cinemas.objects.get(_id= ObjectId(id))
        cinemas_serializer=CinemasSerializer(cinema,data=cinemas_data)
        if cinemas_serializer.is_valid():
            cinemas_serializer.save()
            return JsonResponse("Updated Successfully",safe=False)
        print(cinemas_serializer.errors)
        return JsonResponse("Failed to Update",safe=False)
    elif request.method=='DELETE':
        cinema=Cinemas.objects.get(_id=ObjectId(id))
        cinema.delete()
        return JsonResponse("Deleted Successfully",safe=False)


@csrf_exempt
def subAPI(request,id=0):
    if request.method=='GET':
        print(id)                                     
        sub=Subs.objects.filter(userid=id)
        sub_serializer=SubSerializer(sub,many=True) 
        return JsonResponse(sub_serializer.data,safe=False)  
    elif request.method=='POST':
        print(id)
        sub_data=JSONParser().parse(request)
        sub_serializer=SubSerializer(data=sub_data)
        if sub_serializer.is_valid():
            sub_serializer.save(userid=(id))
            return JsonResponse(sub_serializer.data,safe=False)
        return JsonResponse("Failed to Add",safe=False)
    elif request.method=='DELETE':
        sub=Subs.objects.filter(subscriptionId=id)
        sub.delete()
        return JsonResponse("Deleted Successfully",safe=False)

@csrf_exempt
def checksubAPI(request,id=0):
    if request.method=='GET':
        checksub=CheckSub.objects.filter(userid=id)
        check_sub_serializer=CheckSubSerializer(checksub,many=True)
        return JsonResponse(check_sub_serializer.data,safe=False)
    elif request.method=='POST':
        check_sub_data=JSONParser().parse(request)
        checksub_serializer=CheckSubSerializer(data=check_sub_data)
        if checksub_serializer.is_valid():
            checksub_serializer.save()
            return JsonResponse(checksub_serializer.data,safe=False)
        print(checksub_serializer.errors)
        return JsonResponse("Failed to Add",safe=False)
    elif request.method=='DELETE':
        check_sub=CheckSub.objects.get(subid=id)
        check_sub.delete()
        return JsonResponse("Deleted Successfully",safe=False)

@csrf_exempt
def delChecksubAPI(request,id=0):
    if request.method=='DELETE':
        check_sub=CheckSub.objects.filter(movieid=id)
        check_sub.delete()
        return JsonResponse("Deleted Successfully",safe=False)


@csrf_exempt
def pathNotFound(request,id=0):
    return JsonResponse("Invalid Path",safe=False,status=404)
