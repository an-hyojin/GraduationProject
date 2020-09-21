from django.db import models
#from django.contrib.postgres.fields import ArrayField

# Create your models here.
class Song:
  def __init__(self, singer, title, album, sentences, morphs, pos_list, count_list, a_count, b_count,c_count, a_list,b_list,c_list,translation, morphs_trans, a_quiz_info, b_quiz_info, c_quiz_info):
    self.singer = singer
    self.title = title
    self.album = album
    self.sentences = sentences
    self.morphs = morphs
    self.pos_list = pos_list
    self.count_list = count_list
    self.a_count = a_count
    self.b_count = b_count
    self.c_count =c_count
    self.a_list = a_list
    self.b_list = b_list
    self.c_list = c_list
    self.translation = translation
    self.morphs_trans = morphs_trans
    self.a_quiz_info = a_quiz_info
    self.b_quiz_info = b_quiz_info
    self.c_quiz_info = c_quiz_info
    self.count = 0
    
class Quiz:
  def __init__(self, sentence_index, morph_index, pos):
    self.sentence_index = sentence_index    
    self.morph_index = morph_index
    self.pos = pos

class Word:
  def __init__(self, pos, word):
    self.pos = pos
    self.word = word
