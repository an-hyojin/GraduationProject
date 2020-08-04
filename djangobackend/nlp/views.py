from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Song
from .serializers import SongSerializer
from konlpy.tag import Okt
from konlpy.tag import Kkma
from selenium import webdriver

import re
import time
import random
import json
import requests
import os
import sys
import urllib.request
client_id = "au7Pqz4nAV0GdI9eHWVg" # 개발자센터에서 발급받은 Client ID 값
client_secret = "FTTueiV1Gy" # 개발자센터에서 발급받은 Client Secret 값

@api_view(['POST'])
def nlpSong(request):
    resbody = json.loads(request.body)
    res = []
    okt = Okt()
    kkma = Kkma()
    for line in kkma.sentences(resbody['lyrics']): # json value 접근
        for word in okt.morphs(line):
            res.append(word)
    scores = serializers.ListField(child=serializers.IntegerField(min_value=0, max_value=100))
    return Response(list_serializer)


@api_view(['GET', 'POST'])
def getSongs(request):
    songs = crawling()
    res = []

    kkma = Kkma()
    for song in songs:
        lyric = song[3]

        if isHangel(lyric) >= 0.6:
            song.append(nlp(lyric))
            translate = []
            origin = []
            for line in kkma.sentences(lyric): # json value 접근
                origin.append(line)
                trans = papago(line)
                if trans is None:
                    trans.append("")
                else:
                    translate.append(trans)

            song.append(translate)
            song.append(origin)
            song_obj = Song(title=song[0], singer=song[1], album=song[2], lyrics=song[3], nlp_lyrics=song[4], trans=song[5], origin=song[6])
            res.append(SongSerializer(song_obj).data)

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
            
            data = []
            data.append(title[2:].strip())
            data.append(singer[5:].strip())
            data.append(album_img_url)
            data.append(lylics.strip())

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
    encText = urllib.parse.quote(lyric)
    data = "source=ko&target=en&text=" + encText
    url = "https://openapi.naver.com/v1/papago/n2mt"
    request = urllib.request.Request(url)
    request.add_header("X-Naver-Client-Id",client_id)
    request.add_header("X-Naver-Client-Secret",client_secret)
    response = urllib.request.urlopen(request, data=data.encode("utf-8"))
    rescode = response.getcode()
    if(rescode==200):
        response_body = response.read()
        res = response_body.decode('utf-8')
        result = json.loads(res)
        return result['message']['result']['translatedText']
    else:
        print("Error Code:" + rescode)
        return None

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