from rest_framework import serializers
from .models import Song

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ('title', 'lyrics', 'singer')


class NLPListField(serializers.ListField):
    lyrics = serializers.CharField()