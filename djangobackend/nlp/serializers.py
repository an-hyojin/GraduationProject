from rest_framework import serializers
from .models import Song

class SongSerializer(serializers.Serializer):     
    singer = serializers.CharField(max_length=200)
    title = serializers.CharField(max_length=200)
    album = serializers.CharField(max_length=200)
    lyrics = serializers.CharField()
    nlp_lyrics = serializers.ListField(child=serializers.CharField(max_length=200))
    trans = serializers.ListField(child=serializers.CharField(max_length=200))
    origin = serializers.ListField(child=serializers.CharField(max_length=200))
