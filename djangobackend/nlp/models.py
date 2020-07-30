from django.db import models

# Create your models here.
class Song(models.Model):
    title = models.CharField(max_length=200)
    lyrics = models.TextField()
    singer = models.CharField(max_length=200)


class StringList(models.Model):
    lyrics = models.Field