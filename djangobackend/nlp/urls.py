# nlp의 url 을 설정

from django.urls import path, include
from .views import randomSong, nlpSong, crawling

urlpatterns = [
    path("songId/<int:id>/", randomSong),
    path("list/",nlpSong),
    path("crawling/", crawling)
]