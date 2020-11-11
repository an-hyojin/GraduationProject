# GraduationProject 머신러닝을 활용한 언어교육 시스템

## 프로젝트 참여자

지도교수: 정상근 교수님<br/>
팀원: 전지원, 전혜민, 안효진

## 프로젝트 개요

### 추진 배경

> 기술의 발달로 교육과 기술을 접목한 새로운 형식인 에듀테크가 나타나 246조원에서 481조원으로 3년 사이 두 배 가량 글로벌 시장이 커지고 있음<br/>
> 빌보드 차트 상위권에 한국 그룹의 앨범이 잇따라 진입하는 등 전세계적으로 K-POP에 대한 관심이 높아지면서 한국어 학습에 대한 관심도 증가 이에 따라 방탄소년단 소속사 빅히트 엔터테인먼트에서는 글로벌 팬들을 위한 한국어 학습 패키지 '런! 코리아 위드 BTS'를 출시하기도 함

### 프로젝트 목표
> 가사를 자연어처리하여 학습 중요도에 따라 가사를 전시하고, 학습 이력과 퀴즈 풀이 기록을 바탕으로 다음에 학습할 아이템을 맞춤으로 추천한다. 이를 통해 언어장벽으로 K-POP을 즐기는데 어려움을 겪는 팬들에게, 노래를 통해 한국어를 수월하게 배울 수 있는 플랫폼을 제공하는 것을 목표로 한다.

## 실행 방법

### 프론트앤드

사용자 화면 구현

```
  cd frontend
  ng serve
```

### 백엔드 1 - Node.js

프론트앤드에서 필요한 API 제공(로그인, 회원가입, 퀴즈, Top10 등)

```
  cd nodejs-backend
  yarn start:dev
```

### 백엔드 2 - Django

노래 크롤링, 가사 전처리, 추천 기능 수행

- 가상환경 설치 후 필요한 모듈 다운
- dns, konlpy, rest_framework, pymongo, selenium...
- 실행 시 words.csv의 위치에 따라 오류가 발생할 수 있음: djangobackend/nlp/views.py의 '../../words.csv' 절대경로로 수정

```
  cd djangobackend
  python3 manage.py runserver
```

## 기능

### 주요 기능

1. 노래 가사 전시 기능

> 가사에 한국어 비율이 60프로 이상인 것을 선택<br/>
> 국립국어원의 학습용 어휘(감탄사 제외)를 바탕으로 중요단어 선정<br/>
> konlpy의 okt 모듈로 자연어 처리<br/>
> 모듈로 자른 단어가 학습용 어휘의 원형이 같고, 품사도 동일하다면 중요단어로 판단 후 전시<br/>
> A등급 - 빨강, B등급 - 노랑, C등급 - 파랑

2. 다음 학습 아이템 추천 기능

> 사용자들의 학습 목록, 좋아하는 가수 데이터를 기반으로 추천<br/>
> 학습 횟수를 데이터로 하여 데이터 프레임 생성 후, 코사인 유사도 수행<br/>
> 최근에 학습한 목록(없다면 좋아하는 가수 목록)의 아이템들과 유사한 아이템들의 리스트를 선택한 후, 가중치를 곱하여 합산함(유사도*가중치의 합)<br/>
> 가중치 : 최근 학습할 경우 1. 그 다음 학습부터 -0.1씩 감소<br/>

> 추가로 중요도 단어 비율로 kmeans를 수행하여 사용자가 틀린 단어의 비율과 유사한 비율로 중요 단어가 들어간 노래를 추천할 수 있도록 함

### 부가 기능

1. 로그인/회원가입

> 사용자 맞춤 추천을 위한 로그인 및 회원가입<br/>
> 회원가입 시 좋아하는 가수 선택

2. Top 10 목록

> 사용자가 학습하면 노래의 count가 증가<br/>
> count가 높은 순으로 정렬하여 제공

3. 노래 검색

> mongo atlas에 저장된 노래 데이터들을 가수, 타이틀에 기반하여 검색<br/>
> 자동 완성으로 사용자 편의 증가

4. 퀴즈 및 풀이

> A,B,C 단어 별로 하나씩 생성된 단어 퀴즈와 문장 배열 퀴즈로 이루어짐<br/>
> 단어 퀴즈의 경우 선택지가 정답의 품사와 같은 품사들로 구성 (정답이 동사일 경우 선택지가 모두 동사)

5. Text-to-Speech

> 사용자 학습 시 도움을 주고자 kakao api의 tts 기능 사용<br/>
> 문장 배열 퀴즈를 풀 때, tts 기능으로 문제 풀이에 도움을 주도록 함

6. 학습한 리스트 확인

> 사용자가 학습 목록을 메인페이지에서 확인 가능<br/>
