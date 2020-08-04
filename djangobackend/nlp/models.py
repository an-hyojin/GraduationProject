from django.db import models
#from django.contrib.postgres.fields import ArrayField

# Create your models here.
class Song:
  def __init__(self, title, singer, album, lyrics, nlp_lyrics, trans, origin):
    self.title = title
    self.lyrics = lyrics
    self.album = album
    self.singer = singer
    self.nlp_lyrics = nlp_lyrics
    self.trans = trans
    self.origin = origin