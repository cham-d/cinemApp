from djongo import models
from django import forms


# Create your models here.
class Movies(models.Model):
    _id = models.ObjectIdField()
    TITLE = models.CharField(max_length=30,null=False, blank=False)
    STARTDATE = models.DateField(null=False, blank=False)
    ENDDATE = models.DateField(null=False, blank=False)
    CINEMANAME=models.CharField(max_length=30,null=False, blank=False)
    CATEGORY=models.JSONField()

class Favourites(models.Model):
    _id = models.ObjectIdField()
    USERID = models.CharField(max_length=40,null=False, blank=False)
    MOVIEID = models.CharField(max_length=40,null=False, blank=False)

class Cinemas(models.Model):
    _id = models.ObjectIdField()
    OWNER = models.CharField(max_length=40,null=False, blank=False)
    NAME = models.CharField(max_length=40,null=False, blank=False)


class startDate(models.Model):
     type=models. TextField(max_length=40,null=False, blank=False)
     value=models. TextField()
     metadata=models.JSONField()

     class Meta:
         abstract = True

class endDate(models.Model):
     type=models.TextField(max_length=40,null=False, blank=False)
     value=models.TextField()
     metadata=models.JSONField()

     class Meta:
         abstract = True

class cinema(models.Model):
     type=models.TextField(max_length=40,null=False, blank=False)
     value=models.TextField()
     metadata=models.JSONField()

     class Meta:
         abstract = True

class movie_name(models.Model):
     type=models.TextField(max_length=40,null=False, blank=False)
     value=models.TextField()
     metadata=models.JSONField()

     class Meta:
         abstract = True

class Data(models.Model):
    id = models.CharField(max_length=40,null=False, blank=False)
    type= models.CharField(max_length=40,null=False, blank=False)
    start_date=models.EmbeddedField(
        model_container=startDate
    )
    end_date=models.EmbeddedField(
        model_container=endDate
    )
    cinema=models.EmbeddedField(
        model_container=cinema
    )
    movie_name=models.EmbeddedField(
        model_container=movie_name
    )
    class Meta:
        abstract = True


class Subs(models.Model):
    _id = models.ObjectIdField()
    data = models.ArrayField(
         model_container=Data,
        #  model_form_class=DataForm
 
    )
    subscriptionId = models.CharField(max_length=40,null=False, blank=False)
    userid=models.CharField(max_length=40,blank=True, null=True)

class CheckSub(models.Model):
    _id = models.ObjectIdField()
    userid = models.CharField(max_length=40,null=False, blank=False)
    movieid = models.CharField(max_length=40,null=False, blank=False)
    moviename= models.CharField(max_length=40,null=False, blank=False)
    start_date= models.DateField(null=False, blank=False)
    end_date= models.DateField(null=False, blank=False)
    cinema=models.CharField(max_length=40,null=False, blank=False)
    subid=models.CharField(max_length=40,null=False, blank=False)