"""test0aouth2_django URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,re_path


from . import views
handler404 = views.handle404


urlpatterns = [
    path('', views.goToLogin,name="login"),
    path('login/', views.goToLogin,name="login"),
    path('movies/', views.viewMovies, name='movies'),
    path('owner/', views.ownerView, name='owner'),
    path('determineUser/', views.determineUser, name='determineuser'),
    path('favorites/', views.Favorites, name='favorites'),
    path('mycinemas/', views.cinemas, name='cinemas'),
    path('feed/', views.feed, name='feed'),
    path('notauth/', views.notauth, name='notauth'),
    path('loginFiware/', views.getCode),
    path('logout/', views.logout,name='logout'),
]
