from rest_framework import serializers
from .models import Song

class SongSerializer(serializers.Serializer):     
    singer = serializers.CharField(max_length=200)
    title = serializers.CharField(max_length=200)
    album = serializers.CharField(max_length=200)
    sentences = serializers.ListField(child=serializers.CharField(max_length=200))
    morphs = serializers.ListField(child=serializers.ListField(child=serializers.CharField(max_length=200)))
    count_list = serializers.ListField(child=serializers.ListField(child=serializers.IntegerField()))
    a_list = serializers.ListField(child=serializers.ListField(child=serializers.IntegerField()))
    b_list = serializers.ListField(child=serializers.ListField(child=serializers.IntegerField()))
    c_list = serializers.ListField(child=serializers.ListField(child=serializers.IntegerField()))
    translation = serializers.ListField(child=serializers.CharField(max_length=200))
    morphs_trans = serializers.ListField(child=serializers.ListField(child=serializers.CharField(max_length=200)))
    