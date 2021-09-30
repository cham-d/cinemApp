from django.conf.urls import url
from demoapp import views

from django.conf.urls.static import static
from django.conf import settings

urlpatterns=[
    url(r'^movie$',views.movieAPI),
    url(r'^movie/([a-zA-Z0-9_.-]*)$',views.movieAPI),

    url(r'^favorite$',views.favoritesAPI),
    url(r'^favorite/([a-zA-Z0-9_.-]*)$',views.favoritesAPI),

    url(r'^cinema$',views.cinemasAPI),
    url(r'^cinema/([a-zA-Z0-9_.-]*)$',views.cinemasAPI),

    url(r'^sub$',views.subAPI),
    url(r'^sub/([a-zA-Z0-9_.-]*)$',views.subAPI),
    url(r'^checksub$',views.checksubAPI),

    url(r'^checksubdelete$',views.delChecksubAPI),
    url(r'^checksubdelete/([a-zA-Z0-9_.-]*)$',views.delChecksubAPI),  


    url(r'^movieexists$',views.movieexists),
    url(r'^movieexists/([a-zA-Z0-9_.-]*)$',views.movieexists),
    
    url(r'^checksub/([a-zA-Z0-9_.-]*)$',views.checksubAPI),
    url(r'^.*', views.pathNotFound, name='unmatched'),

]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
