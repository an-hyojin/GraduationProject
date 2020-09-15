from django.db import models
#from django.contrib.postgres.fields import ArrayField

# Create your models here.
class Song:
  def __init__(self, singer, title, album, sentences, morphs, count_list,a_list,b_list,c_list,translation, morphs_trans):
    self.singer = singer
    self.title = title
    self.album = album
    self.sentences = sentences
    self.morphs = morphs
    self.count_list = count_list
    self.a_list = a_list
    self.b_list = b_list
    self.c_list = c_list
    self.translation = translation
    self.morphs_trans = morphs_trans