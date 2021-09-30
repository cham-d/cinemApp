from rest_framework import serializers
from demoapp.models import Cinemas, Favourites, Movies, Subs,CheckSub

class MoviesSerializer(serializers.ModelSerializer):
    class Meta:
        model=Movies 
        fields=('_id','TITLE','STARTDATE','ENDDATE','CINEMANAME','CATEGORY')

class FavoritesSerializer(serializers.ModelSerializer):
    class Meta:
        model=Favourites 
        fields=('_id','USERID','MOVIEID')

class CinemasSerializer(serializers.ModelSerializer):
    class Meta:
        model=Cinemas 
        fields=('_id','OWNER','NAME')

class SubSerializer(serializers.ModelSerializer):
    class Meta:
        model=Subs 
        fields=('_id','data','subscriptionId','userid')

class CheckSubSerializer(serializers.ModelSerializer):

    
    class Meta:
        model=CheckSub 
        fields=('_id','userid','movieid',"moviename",'subid','start_date','end_date','cinema')