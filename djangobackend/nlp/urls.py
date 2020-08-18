# nlp의 url 을 설정

from django.urls import path, include
from .views import nlpSong, getSongs, preprocessing

urlpatterns = [
    path("list/",nlpSong),
    path("crawling/", getSongs),
    path("preprocessing/", preprocessing)
]