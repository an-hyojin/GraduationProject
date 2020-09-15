# nlp의 url 을 설정

from django.urls import path, include
from .views import getSongs, preprocessing, test, word

urlpatterns = [
    path("crawling/", getSongs),
    path("preprocessing/", preprocessing),
    path("test/", test),
    path("words/", word),
]