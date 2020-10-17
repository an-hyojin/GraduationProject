from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Song, Quiz, Word
from .serializers import SongSerializer, WordSerializer
from konlpy.tag import Okt
from konlpy.tag import Kkma
from selenium import webdriver
from pymongo import MongoClient
from sklearn.cluster import KMeans
from bson.objectid import ObjectId
from sklearn.metrics.pairwise import cosine_similarity
from collections import Counter


import re
import time
import random
import json
import requests
import os
import sys
import urllib.request
import csv
import pymongo
import dns
import ssl
import pandas as pd

_client_id = "au7Pqz4nAV0GdI9eHWVg" # 개발자센터에서 발급받은 Client ID 값
_client_secret = "FTTueiV1Gy" # 개발자센터에서 발급받은 Client Secret 값

_json_res = [{"singer":"싹쓰리(유두래곤, 린다G, 비룡)","title":"다시 여기 바닷가","album":"https://musicmeta-phinf.pstatic.net/album/004/673/4673490.jpg?type=r360Fll&v=20200718175908","lyrics":"예아! 호우! 예예예~\n싹쓰리 인더 하우스\n커커커커커몬! 싹!쓰리!투 렛츠고!\n\n나 다시 또 설레어\n이렇게 너를 만나서\n함께 하고 있는 지금 이 공기가\n\n다시는 널 볼 순 없을 거라고\n추억일 뿐이라\n서랍 속에 꼭 넣어뒀는데\n\n흐르는 시간 속에서\n너와 내 기억은\n점점 희미해져만 가\n끝난 줄 알았어\n\n지난여름 바닷가\n너와 나 단둘이\n파도에 취해서 노래하며\n같은 꿈을 꾸었지\n다시 여기 바닷가\n이제는 말하고 싶어\n네가 있었기에 내가 더욱 빛나\n별이 되었다고\n\n다들 덥다고 막 짜증내\n괜찮아 우리 둘은 따뜻해\n내게 퐁당 빠져버린 널 \n이젠 구하러 가지 않을 거야\n모래 위 펴펴펴편지를 써\n밀물이 밀려와도 못 지워\n추억이 될 뻔한 첫 느낌\n너랑 다시 한번 받아 보고 싶어\n\n흐르는 시간 속에서\n너와 내 기억은\n점점 희미해져만 가\n끝난 줄 알았어\n\n지난여름 바닷가\n너와 나 단둘이\n파도에 취해서 노래하며\n같은 꿈을 꾸었지\n다시 여기 바닷가\n이제는 말하고 싶어\n네가 있었기에 내가 더욱 빛나\n별이 되었다고\n\n시간의 강을 건너\n또 맞닿은 너와 나\n소중한 사랑을 영원히\n간직해줘\n\n지난여름 바닷가\n너와 나 단둘이\n파도에 취해서 노래하며\n같은 꿈을 꾸었지\n다시 여기 바닷가\n이제는 말하고 싶어\n네가 있었기에 내가 더욱 빛나\n별이 되었다고","nlp_lyrics":["예","아","!","호우","!","예","예","예","~","싹","쓰리","인","더","하우스","커","커","커","커","커","몬","!","싹","!","쓰리","!","투","렛츠고","!","나","다시","또","설레어","이렇게","너","를","만나서","함께","하고","있는","지금","이","공기","가","다시는","널","볼","순","없을","거","라고","추억","일","뿐","이라","서랍","속","에","꼭","넣어","뒀는데","흐르는","시간","속","에서","너","와","내","기억","은","점점","희미","해져만","가","끝난","줄","알았어","지난","여름","바닷가","너","와","나","단둘","이","파도","에","취해","서","노래","하며","같은","꿈","을","꾸었지","다시","여기","바닷가","이제","는","말","하고","싶어","네","가","있었기에","내","가","더욱","빛","나","별","이","되었다고","다","들","덥다고","막","짜증","내","괜찮아","우리","둘","은","따뜻해","내게","퐁당","빠져","버린","널","이","젠","구","하러","가지","않을","거야","모래","위","펴","펴","펴","편지","를","써","밀물","이","밀려와도","못","지워","추억","이","될","뻔한","첫","느낌","너","랑","다시","한번","받아","보고","싶어","흐르는","시간","속","에서","너","와","내","기억","은","점점","희미","해져만","가","끝난","줄","알았어","지난","여름","바닷가","너","와","나","단둘","이","파도","에","취해","서","노래","하며","같은","꿈","을","꾸었지","다시","여기","바닷가","이제","는","말","하고","싶어","네","가","있었기에","내","가","더욱","빛","나","별","이","되었다고","시간","의","강","을","건너","또","맞닿은","너","와","나","소중한","사랑","을","영원히","간직","해","줘","지난","여름","바닷가","너","와","나","단둘","이","파도","에","취해","서","노래","하며","같은","꿈","을","꾸었지","다시","여기","바닷가","이제","는","말","하고","싶어","네","가","있었기에","내","가","더욱","빛","나","별","이","되었다고"],"trans":["Yes, ah! Whoo!","Yes, yes! Three in the house! Big! Big! Big! Mon! Three! Two, let's go! I was so excited to meet you again, and now that I'm with you again, I'm just remembering that this air will never see you again, so I kept it in my drawer, and I thought your memories of me and you were fading away.","Last summer, you and I got drunk on the waves and we sang the same dream, and now I want to talk about the beach here again, because you were there, I became a shining star.","They're all hot.","I'm just annoyed. It's okay. We're warm. I'm not going to save you from drowning. Spread it out on the sand. I'm going to write you a letter. The first impression I'm going to be a memory when the tide comes in. I want to take it with you again. I thought your memories of me and you were fading away.","Last summer, you and I got drunk on the waves and we sang the same dream, and now I want to talk about the beach here again, because you were there, I became a shining star.","Last summer, you and I got drunk on the waves and sang the same dream again, and now I want to talk about it, so I'm a shining star."],"origin":["예 아! 호우!","예예 예~ 싹 쓰리 인 더 하우스 커 커 커 커 커 몬! 싹! 쓰리! 투 렛츠고! 나 다시 또 설레어 이렇게 너를 만나서 함께 하고 있는 지금 이 공기가 다시는 널 볼 순 없을 거라고 추억일 뿐이라 서랍 속에 꼭 넣어 뒀는데 흐르는 시간 속에서 너와 내 기억은 점점 희미 해져만 가 끝난 줄 알았어","지난 여름 바닷가 너와 나 단둘이 파도에 취해서 노래하며 같은 꿈을 꾸었지 다시 여기 바닷가 이제는 말하고 싶어 네 가 있었기에 내가 더욱 빛 나 별이 되었다고","다들 덥다고","막 짜증 내 괜찮아 우리 둘은 따뜻해 내게 퐁당 빠져 버린 널 이젠 구하러 가지 않을 거야 모래 위 펴 펴 펴 편지를 써 밀물이 밀려와도 못 지워 추억이 될 뻔한 첫 느낌 너랑 다시 한번 받아 보고 싶어 흐르는 시간 속에서 너와 내 기억은 점점 희미 해져만 가 끝난 줄 알았어","지난 여름 바닷가 너와 나 단둘이 파도에 취해서 노래하며 같은 꿈을 꾸었지 다시 여기 바닷가 이제는 말하고 싶어 네 가 있었기에 내가 더욱 빛 나 별이 되었다고","시간의 강을 건너 또 맞닿은 너와 나 소중한 사랑을 영원히 간직해 줘 지난 여름 바닷가 너와 나 단둘이 파도에 취해서 노래하며 같은 꿈을 꾸었지 다시 여기 바닷가 이제는 말하고 싶어 네 가 있었기에 내가 더욱 빛 나 별이 되었다고"]},{"singer":"싹쓰리(유두래곤, 린다G, 비룡)","title":"그 여름을 틀어줘","album":"https://musicmeta-phinf.pstatic.net/album/004/707/4707332.jpg?type=r360Fll&v=20200730114808","lyrics":"이 여름 다시 한번 설레고 싶다\n그때 그 여름을 틀어줘 그 여름을 들려줘\n그때 그 여름을 틀어줘 다시 한번 또 불러줘\n\n1, 2, SSAK 3\nOkay okay okay Alright alright alright 저 바다가 부를 때\nGo back Go back Go back 그해 여름으로 손잡고 뛰어들래? (Ooh~)\n    \nUh uh uh I’m UD-UD, MY NEW I.D 그 시절 날 웃고 울리던 멜로디\n하늘은 우릴 향해 열려있어 uh 그리고 내 곁에는 네가 있어 uh\nRE–PLAY 이 계절을 멈추지 마요 밤새도록 Play 해줘\n\n그때 그 여름을 틀어줘 그 여름을 들려줘 (내가 많이 설렜었던, 참 많이 뜨거웠던)\n그때 그 여름을 틀어줘 다시 한번 또 불러줘\n\n올라타 라타 라타 파도 타고 We flow 흘러 흘러 닿을 수 있을까?\n왠지 왠지 왠지 올해 여름 바람 널 떠올려 그날의 ooh~\nI love it, like it, yeah I like it!\n \n돈이 없었지 깡이 없었나 아 예예예예예\n일이 없었지 감이 없었나 아 예예예예예\nYouth- Flex- 이 계절을 아끼지 마요 밤새도록 Play 해줘\n\n그때 그 여름을 틀어줘 그 여름을 들려줘 (내가 많이 설렜었던, 참 많이 뜨거웠던)\n그때 그 여름을 틀어줘 다시 한번 또 불러줘\n\n이 여름도 언젠가는 그해 여름 오늘이 가장 젊은 내 여름\n이 계절에 머무르고 싶어 언제까지 영원히 으음 음\n\n1, 2, 3!\n그때 그 여름을 틀어줘 그 여름을 들려줘 (내가 많이 사랑했던, 참 많이 설렜었던)\n그때 그 여름을 틀어줘 다시 한번 또 불러줘","nlp_lyrics":["이","여름","다시","한번","설레고","싶다","그때","그","여름","을","틀어","줘","그","여름","을","들려줘","그때","그","여름","을","틀어","줘","다시","한번","또","불러","줘","1",",","2",",","SSAK","3","Okay","okay","okay","Alright","alright","alright","저","바다","가","부를","때","Go","back","Go","back","Go","back","그해","여름","으로","손잡고","뛰어들래","?","(","Ooh","~)","Uh","uh","uh","I","’","m","UD","-","UD",",","MY","NEW","I",".","D","그","시절","날","웃고","울리던","멜로디","하늘","은","우릴","향","해","열려","있어","uh","그리고","내","곁","에는","네","가","있어","uh","RE","–","PLAY","이","계절","을","멈추지","마","요","밤새도록","Play","해","줘","그때","그","여름","을","틀어","줘","그","여름","을","들려줘","(","내","가","많이","설렜었던",",","참","많이","뜨거웠던",")","그때","그","여름","을","틀어","줘","다시","한번","또","불러","줘","올라","타","라","타","라","타","파도","타고","We","flow","흘러","흘러","닿을","수","있을까","?","왠지","왠지","왠지","올해","여름","바람","널","떠올려","그날","의","ooh","~","I","love","it",",","like","it",",","yeah","I","like","it","!","돈","이","없었지","깡","이","없었나","아","예","예","예","예","예","일이","없었지","감","이","없었나","아","예","예","예","예","예","Youth","-","Flex","-","이","계절","을","아끼지","마","요","밤새도록","Play","해","줘","그때","그","여름","을","틀어","줘","그","여름","을","들려줘","(","내","가","많이","설렜었던",",","참","많이","뜨거웠던",")","그때","그","여름","을","틀어","줘","다시","한번","또","불러","줘","이","여름","도","언젠가","는","그해","여름","오늘이","가장","젊은","내","여름","이","계절","에","머무르고","싶어","언제","까지","영원히","으","음","음","1",",","2",",","3","!","그때","그","여름","을","틀어","줘","그","여름","을","들려줘","(","내","가","많이","사랑","했던",",","참","많이","설렜었던",")","그때","그","여름","을","틀어","줘","다시","한번","또","불러","줘"],"trans":["I want to be excited again this summer.","Play that summer. Play that summer. Play that summer. Sing that summer again. 1, 2, SSAK 3 Okay okay right right early. When that sea sings, go back Go back Go back that summer?","(Ooh~) Uh uh uh I'm UD-UD, MY NEW I.D. The sky of the melody that was smiling and ringing in those days is open to us uh and there's you next to me, uh RE–PLAY. Play the summer all night. Play it for me. Let me hear the summer when I was very hot.","Somehow this summer wind reminds me of you ooh~ I love it, like it, yeah I like it!","Yeah, yeah, yeah, yeah, yeah. I didn't have a clue.","Yes, yes, yes, yes, yes, yes, yes, yes. Play it all night. Play it for me. Play it for me. Play it again. Sing it again for me. Sing it again. This summer will be the youngest summer of that year. One day, I want to stay in this season. One, two, three! Play the summer that I loved."],"origin":["이 여름 다시 한번 설레고 싶다","그때 그 여름을 틀어 줘 그 여름을 들려줘 그때 그 여름을 틀어 줘 다시 한번 또 불러 줘 1, 2, SSAK 3 Okay okay okay Alright alright alright 저 바다가 부를 때 Go back Go back Go back 그해 여름으로 손잡고 뛰어들래?","(Ooh~) Uh uh uh I’m UD-UD, MY NEW I.D 그 시절 날 웃고 울리던 멜로디 하늘은 우릴 향해 열려 있어 uh 그리고 내 곁에는 네 가 있어 uh RE–PLAY 이 계절을 멈추지 마요 밤새도록 Play 해 줘 그때 그 여름을 틀어 줘 그 여름을 들려줘 ( 내가 많이 설렜었던, 참 많이 뜨거웠던) 그때 그 여름을 틀어 줘 다시 한번 또 불러 줘 올라 타 라 타 라 타 파도 타고 We flow 흘러 흘러 닿을 수 있을까?","왠지 왠지 왠지 올해 여름 바람 널 떠올려 그날의 ooh~ I love it, like it, yeah I like it! 돈이 없었지 깡이 없었나","아 예예 예예 예 일이 없었지 감이 없었나","아 예 예예 예예 Youth- Flex- 이 계절을 아끼지 마요 밤새도록 Play 해 줘 그때 그 여름을 틀어 줘 그 여름을 들려줘 ( 내가 많이 설렜었던, 참 많이 뜨거웠던) 그때 그 여름을 틀어 줘 다시 한번 또 불러 줘 이 여름도 언젠가는 그해 여름 오늘이 가장 젊은 내 여름 이 계절에 머무르고 싶어 언제까지 영원히 으 음 음 1, 2, 3! 그때 그 여름을 틀어 줘 그 여름을 들려줘 ( 내가 많이 사랑했던, 참 많이 설렜었던) 그때 그 여름을 틀어 줘 다시 한번 또 불러 줘"]}]
_dic = {}
_temp_dic = {}
_word_dic = {}
_client = MongoClient('mongodb+srv://hyojin:graducnu2020@graducnu2020.7au9v.mongodb.net/song?retryWrites=true&w=majority', ssl=True, ssl_cert_reqs=ssl.CERT_NONE)

_db = _client.song
_songdb = _db.songs
_userdb = _db.users

def make_cluster_songs(cluster_num=3):
    abc = []
    title = []
    for song in _songdb.find(projection={'_id': True, 'a_count':True, 'b_count':True,'c_count':True}):
        title.append(song['_id'])
        a = song['a_count']
        b = song['b_count']
        c = song['c_count']
        count = a+b+c
        abc.append([a/count, b/count,c/count])    
    abcDf = pd.DataFrame(data=abc, index=title, columns=['a','b','c'])
    model = KMeans(n_clusters=cluster_num)
    kmeans = model.fit_predict(abcDf)
    kmeansData = pd.DataFrame(data=kmeans, columns=['clusterNum'])
    kmeansData['songId'] = abcDf.index
    return kmeansData, model

def init_user_learn_frame():
    user_learn_frame = pd.DataFrame(columns=['userId', 'songId', 'count'])
    for user in _userdb.find(projection={'_id':True, 'learning':True, 'favorite':True}):
        _id = str(user['_id'])
        user_learn = {}
        if 'learning' in user:
            for learn in user['learning']:
                learn_item = learn['learning']
                if learn_item not in user_learn:
                    user_learn[learn_item] = 0
                user_learn[learn_item]+=1

        if 'favorite' in user:
            user_favorite = _songdb.find({'singer':{'$in':user['favorite']}},projection={'_id':True})
            for favorite_song in user_favorite:
                favorite_song_id = str(favorite_song['_id'])
                if favorite_song_id not in user_learn:
                    user_learn[favorite_song_id] = 0

                user_learn[favorite_song_id]+=1
        print(user_learn)
        data_frame = pd.DataFrame(data=list(user_learn.items()), columns=['songId', 'count'])
        data_frame['userId'] = _id
        user_learn_frame = pd.concat([user_learn_frame,data_frame])

    user_learn_pivot_table = user_learn_frame.pivot_table(values='count', columns='userId', index='songId',aggfunc=sum).fillna(0)
    item_based_collabor = cosine_similarity(user_learn_pivot_table)
    item_based_collabor = pd.DataFrame(data=item_based_collabor, index=user_learn_frame['songId'], columns=user_learn_frame['songId'])
    return item_based_collabor

_kmeansCluster, _model = make_cluster_songs(3)

with open('../../words.csv', 'rt', encoding='UTF8') as data:
    regex = re.compile('[0-9]') # 가다01 가다02 이런식으로 되어있는 것들 제거하기 위함
    csv_reader = csv.reader(data)
    next(csv_reader) # 헤더 읽음 처리
    
    for word_list in csv_reader:
        word = word_list[1]
        num = regex.search(word)
        if num : #num이 들어가있으면 제거
            word = word[0:num.start()]

        if word not in _temp_dic:
            _temp_dic[word] = {}
        
        _temp_dic[word][word_list[2]]=word_list[4]
        _dic[word] = word_list[4]
        _word_dic[word] = word_list[2]
  


@api_view(['GET','POST'])
def recommendSongs(request, id):
    item_based_collabor = init_user_learn_frame()

    user = _userdb.find_one({'_id':ObjectId(id) }, projection={'_id':False,'learning':True, 'a':True ,'b':True, 'c':True})
    learn = []
    if 'learning' in user:
        for item in user['learning'][-10:]:
            learn.append(item['learning'])
            
    learn.reverse()
    learn_item_add = Counter()
    weight = 1
    for songId in learn:
        now_song_counter = Counter((item_based_collabor[songId].sort_values(ascending=False)[1:]*weight).to_dict())
        weight -= 0.1
        learn_item_add = learn_item_add+now_song_counter
    
    learn_dict = dict(learn_item_add)
    user_a = user['a']
    user_b = user['b']
    user_c = user['c']
    all_count = user_a+user_b+user_c

    recommend_id = []
    clusterSong = None

    if(all_count!=0):
        user_a = user_a/all_count
        user_b = user_b/all_count
        user_c = user_c/all_count
    else:
        user_a = 0.33
        user_b = 0.33
        user_c = 0.34

    user_cluster_num = _model.predict([[user_a, user_b,user_c]])
    clusterSong = _kmeansCluster[_kmeansCluster['clusterNum']==user_cluster_num[0]]['songId']
    
    if clusterSong is not None:
        for song in clusterSong:
            if str(song) in learn_dict:
                recommend_id.append(str(song))
    
    if len(recommend_id)<4:
        recommend_id = list(map(lambda objid: str(objid),clusterSong))
    
    return Response(recommend_id)


@api_view(['GET','POST'])
def preprocessing(request):
    resbody = json.loads(request.body.decode("utf-8"))

    result = makeData(resbody)
    return Response(result)
    
def makeData(json):
    result = []
    kkma = Kkma()
    okt = Okt()

    connect_konlpy_words = {"Noun":"명", "Adjective":"형", "Adverb":"부", "Verb":"동"}
    for json_elements in json:
        albumLink = "albumLink"
        if 'Album' in json_elements:
            albumLink = json_elements['Album']
       
        sentences = []
        translation = []
        morph_trans = []
        count_list = []
        morphs_list = []
        pos_list = []
        morphs_trans =[]
        a_list = []
        b_list = []
        c_list = []
        a_quiz_info = []
        b_quiz_info = []
        c_quiz_info = []
        a_count = 0
        b_count = 0
        c_count = 0
        sentence_index = 0
        
        #가사 센텐스 # 가사 짜른거 센텐스 단위 # 가사 짜른거 2 2 1  #파파고 센텐스단위 번역본 
        for line in json_elements['Lyrics'].split("\n"):
            if len(line.strip())==0:
                continue
            sentences.append(line)
            translation.append(papago(line))
            trans = []
            word_index=0
            pos_info =[]
            morphs_info = okt.morphs(line)
            for stem in okt.pos(line, norm=True, stem=True):
                pos_info.append(stem[0])
                if stem[0] in _temp_dic and stem[1] in connect_konlpy_words: #명, 형, 동, 부 중 하나
                    pos_name = connect_konlpy_words[stem[1]]
                    if pos_name in _temp_dic[stem[0]]:
                        quiz = Quiz(sentence_index, word_index, pos_name)
                        level = _temp_dic[stem[0]][pos_name]
                        if level=='A':
                            a_quiz_info.append(quiz)
                        elif level =='B':
                            b_quiz_info.append(quiz)
                        else:
                            c_quiz_info.append(quiz)
                trans.append(papago(stem[0]))
                word_index+=1
            morphs = okt.morphs(line)
            morphs_list.append(morphs)
            morphs_trans.append(trans)
            pos_list.append(pos_info)
            temp_a, temp_b, temp_c = wordslevel(pos_info)
            a_count += len(temp_a)
            b_count += len(temp_b)
            c_count += len(temp_c)
            a_list.append(temp_a)
            b_list.append(temp_b)
            c_list.append(temp_c)
            count_list.append(add_counts_array(line, morphs))
            sentence_index +=1
        song_obj = Song(json_elements['Singer'], json_elements['Title'], albumLink, sentences, morphs_list,pos_list, count_list, a_count, b_count, c_count, a_list, b_list, c_list, translation, morphs_trans, a_quiz_info,b_quiz_info,c_quiz_info)
        result.append(SongSerializer(song_obj).data)
    return result


@api_view(['GET', 'POST'])
def getSongs(request):
    songs = crawling()
    res = makeData(songs)
    return Response(res)
        
def crawling():
    options = webdriver.ChromeOptions()
    options.add_argument('headless')
    options.add_argument('window-size=1920x1080')
    options.add_argument('Content-Type=application/json; charset=utf-8')
    options.add_argument("disable-gpu")

    browser = webdriver.Chrome('/Users/hyojin/EduactionProject/djangobackend/chromedriver',  chrome_options=options) # 드라이버 설정
    url = 'https://vibe.naver.com/chart/total'# 크롤링할 url
    
    browser.get(url)
    browser.implicitly_wait(10) # 기다리는 시간 설정
    btn = browser.find_element_by_css_selector("#app > div.modal > div > div > a") # 광고 창 삭제 버튼
    
    if btn is not None:
        btn.click() # 삭제 클릭
        time.sleep(1) # 삭제 기다리기

    ranking_table = browser.find_element_by_css_selector("#content > div.track_section > div:nth-child(1) > div > table > tbody") # 순위 목록 테이블
    rows = ranking_table.find_elements_by_tag_name("tr") # 순위들 리스트로 가져옴
    
    matrix =[]

    next_scroll = 51 # 스크롤 한 번 하는 단위
    
    debug = 0 # 추후 삭제

    for row in rows:
        if debug >= 2 :
            break

        debug += 1

        lylics_td=row.find_elements_by_css_selector(".lyrics")[0] # 가사 있는 cell
    
        if len(lylics_td.find_elements_by_tag_name("a")) > 0: # 가사가 있을 경우
            lylics_td.find_elements_by_tag_name("a")[0].click() # 가사 보기 버튼 클릭
            
            time.sleep(1) # 로딩 기다리기
            
            title = browser.find_elements_by_xpath("//*[@id='app']/div[2]/div/div/div[1]/div[2]/div/strong")[0].text
            singer = browser.find_elements_by_xpath("//*[@id='app']/div[2]/div/div/div[1]/div[2]/div/em")[0].text
            lylics = browser.find_elements_by_css_selector("#app > div.modal > div > div > div.ly_contents > p > span:nth-child(2)")[0].text
       
            album_img_url = browser.find_element_by_css_selector('#app > div.modal > div > div > div.ly_song_info > div.ly_thumb > img').get_attribute("src")
            
            data = {}
            data['Title']=title[2:].strip()
            data['Singer']=singer[5:].strip()
            data['Album']=album_img_url
            data['Lyrics']=lylics.strip()

            matrix.append(data)
            
            close_btn = browser.find_elements_by_css_selector("#app > div.modal > div > div > a")[0].click() # 가사 창닫기

        scroll_command = "window.scrollTo(0,"+str(next_scroll)+");" # 화면 스크롤
        browser.execute_script(scroll_command)

        next_scroll += 51
    
    browser.quit()
    return matrix


def nlp(lyrics):
    res = []
    okt = Okt()
    kkma = Kkma()
    for line in kkma.sentences(lyrics): # json value 접근
        for word in okt.morphs(line):
            res.append(word)
    return res

def papago(lyric):
    try:
        url = "https://openapi.naver.com/v1/papago/n2mt"
        headers= {"X-Naver-Client-Id": _client_id, "X-Naver-Client-Secret":_client_secret}
        params = {"source": "ko", "target": "en", "text": lyric}
        response = requests.post(url, headers=headers, data=params)
        res = response.json()
        return res['message']['result']['translatedText']
    except:
        return "번역 실패"

    

def isHangel(str): # 한글이 몇 퍼센트의 비율로 들어가있는지 판단
    pattern = re.compile('[가-힣]+')
    #  \n과 \s+ 제거
    lyrics = re.sub('\n',' ', str)
    lyrics = re.sub('\s+',' ',lyrics)
    
    lyricArray = re.split(' ', lyrics)
    hangel = 0
    
    for eachlyric in lyricArray:
        if bool(re.search(pattern, eachlyric)): # 한글 단어일 경우
            hangel = hangel + 1
            
    return hangel/len(lyricArray)

def wordslevel(lyrics_token_list):
    a_list = []
    b_list = []
    c_list = []
    for i in range(len(lyrics_token_list)):
        if lyrics_token_list[i][0] in _dic:
            word = lyrics_token_list[i][0]
            if _dic[word]=='A':
                a_list.append(i)
            if _dic[word]=='B':
                b_list.append(i)
            if _dic[word]=='C':
                c_list.append(i)
    return a_list, b_list, c_list

def add_counts_array(sentence, lyrics_token_list):
    space_indexes = []
    last_index = 0
    size = 0
    last_space = sentence.find(' ')
    for i in range(len(lyrics_token_list)):
        word = lyrics_token_list[i]
        if last_space==-1: # space가 없는 경우
            size+=len(lyrics_token_list)
            break
        last_index = sentence.find(word, last_index)
        if last_index-1==last_space:
            last_space = sentence.find(' ', last_space+1)
            space_indexes.append(i)
        last_index += len(word)
    return space_indexes

