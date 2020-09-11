from rest_framework import serializers

 

class QuizSerializer(serializers.Serializer):
    sentence_index = serializers.IntegerField()
    morph_index = serializers.IntegerField()
    pos = serializers.CharField(max_length=4)


class SongSerializer(serializers.Serializer):     
    singer = serializers.CharField(max_length=200)
    title = serializers.CharField(max_length=200)
    album = serializers.CharField(max_length=200)
    sentences = serializers.ListField(child=serializers.CharField(max_length=200))
    morphs = serializers.ListField(child=serializers.ListField(child=serializers.CharField(max_length=200)))
    pos_list = serializers.ListField(child=serializers.ListField(child=serializers.CharField(max_length=200)))
    count_list = serializers.ListField(child=serializers.ListField(child=serializers.IntegerField()))
    a_list = serializers.ListField(child=serializers.ListField(child=serializers.IntegerField()))
    b_list = serializers.ListField(child=serializers.ListField(child=serializers.IntegerField()))
    c_list = serializers.ListField(child=serializers.ListField(child=serializers.IntegerField()))
    a_count = serializers.IntegerField()
    b_count = serializers.IntegerField()
    c_count = serializers.IntegerField()
    translation = serializers.ListField(child=serializers.CharField(max_length=200))
    morphs_trans = serializers.ListField(child=serializers.ListField(child=serializers.CharField(max_length=200)))
    a_quiz_info = serializers.ListField(child=QuizSerializer())
    b_quiz_info = serializers.ListField(child=QuizSerializer())
    c_quiz_info = serializers.ListField(child=QuizSerializer())
   
class WordSerializer(serializers.Serializer):
    pos = serializers.CharField(max_length=4)
    word = serializers.CharField(max_length=200)