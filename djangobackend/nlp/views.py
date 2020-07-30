from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Song
from .serializers import SongSerializer, NLPListField
from konlpy.tag import Okt
from konlpy.tag import Kkma
from selenium import webdriver
from io import BytesIO

import time
import random
import json
import requests

# Create your views here.
@api_view(['GET'])
def randomSong(request, id): # django database에 있는 song 랜덤 리턴
    # id -> 개수
    totalSongs = Song.objects.all()
    randomSong = random.sample(list(totalSongs), id)
    serializer = SongSerializer(randomSong, many=True)
    return Response(serializer.data)


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


@api_view(['GET'])
def crawling(request):
    browser = webdriver.Chrome('/Users/hyojin/EduactionProject/djangobackend/chromedriver') # 드라이버 설정
    url = 'https://vibe.naver.com/chart/total'# 크롤링할 url
    
    browser.get(url)
    browser.implicitly_wait(10) # 기다리는 시간 설정
    btn = browser.find_element_by_css_selector("#app > div.modal > div > div > a") # 광고 창 삭제 버튼
    if btn is not None:
        btn.click() # 삭제 클릭
        time.sleep(1) # 삭제 기다리기

    ranking_table = browser.find_element_by_css_selector("#content > div.track_section > div:nth-child(1) > div > table > tbody") # 순위 목록 테이블
    
    rows = ranking_table.find_elements_by_tag_name("tr") # 순위들 리스트로 가져옴
    
    head = ["Image", "Singer","Title", "Lyrics","nlpLyrics"] # 데이터 헤더 설정
    matrix =[]
    matrix.append(head)

    next_scroll = 51 # 스크롤 한 번 하는 단위
    
    debug = 0

    for row in rows:
        if debug >= 5 :
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
            
            #urlretrieve는 다운로드 함수
            #img.alt는 이미지 대체 텍스트 == 마약왕
            album_cover = requests.get(album_img_url)
            img = Image.open(BytesIO(album_cover.content))

            data = []
            data.append(img)
            data.append(singer[5:].strip())
            data.append(title[2:].strip())
            data.append(lylics.strip())

            matrix.append(data)
            
            close_btn = browser.find_elements_by_css_selector("#app > div.modal > div > div > a")[0].click() # 가사 창닫기

        scroll_command = "window.scrollTo(0,"+str(next_scroll)+");" # 화면 스크롤
        browser.execute_script(scroll_command)

        next_scroll += 51

    for song in matrix:
        lyric = song[2]
        if isHangel(song[2]) >= 0.6:
            song.append(nlp(song[3]))
        else:
            matrix.remove(song)


    return Response(matrix)
        

def nlp(lyrics):
    res = []
    okt = Okt()
    kkma = Kkma()
    for line in kkma.sentences(lyrics): # json value 접근
        for word in okt.morphs(line):
            res.append(word)
    return res


def isHangel(str): # 한글이 몇 퍼센트의 비율로 들어가있는지 판단
    
    #  \n과 \s+ 제거
    lyrics = re.sub('\n',' ', str)
    lyrics = re.sub('\s+',' ',lyrics)
    
    lyricArray = re.split(' ', lyrics)
    hangel = 0
    
    for eachlyric in lyricArray:
        if bool(re.search(pattern, eachlyric)): # 한글 단어일 경우
            hangel = hangel + 1
            
    return hangel/len(lyricArray)