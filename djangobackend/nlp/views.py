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
                
        data_frame = pd.DataFrame(data=list(user_learn.items()), columns=['songId', 'count'])
        data_frame['userId'] = _id
        user_learn_frame = pd.concat([user_learn_frame,data_frame])

    user_learn_pivot_table = user_learn_frame.pivot_table(values='count', columns='userId', index='songId',aggfunc=sum).fillna(0)
    item_based_collabor = cosine_similarity(user_learn_pivot_table)
    item_based_collabor = pd.DataFrame(data=item_based_collabor, index=user_learn.keys(), columns=user_learn.keys())
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
    
    learn_dict = dict(learn_item_add.most_common(12))
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
    
    for song in clusterSong:
        if str(song) in learn_dict:
            recommend_id.append(str(song))
    
    if len(recommend_id)<4:
        recommend_id = list(map(lambda objid: str(objid),clusterSong))
    
    return Response(recommend_id[:12])


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

