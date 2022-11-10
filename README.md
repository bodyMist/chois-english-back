# chois-english-back
딥러닝 모델을 이용한 영어 문제 생성 웹 사이트 개발 프로젝트
> 본 페이지는 api-server 레포지토리입니다. 딥러닝 모델을 이용하는 레포지토리는 다음의 링크를 참조해 주시길 바랍니다.   
> 링크 : [model-server](https://github.com/bodyMist/chois-english-model)

## 사용 기술
> MERN 스택 : MongoDB, ExpreeJS, React, NodeJS로 이루어진 기술 스택이다.
* ExpressJS
* MongoDB
* Mongoose

### 기술 채택 이유
* ExpressJS : 메인 서버에서 복잡한 처리 로직이 필요하지 않으며 모델 서버로 라우팅 역할을 주로 하기 위해 선택
* MongoDB : MERN 스택에 포함되며 ExpressJS와 NodeJS 만큼 쉽게 작업할 수 있는 DB가 필요했기 때문에 선택

## 주요 기능
1. 회원 관리(CRUD)
2. 이미지 관리(CRUD)
3. 문제 생성(라우팅)
4. 랜덤 문제 요청
5. 답안 채점(라우팅)

## DB 구조
![image](https://user-images.githubusercontent.com/77658870/201178476-887146e1-d8bb-4a16-bc23-c66d02e50b36.png)

## ISSUE
1. Document 방식의 MongoDB를 RDB로 이용할 경우 이점이 생기는가?
    * 사용성의 이점으로 MongoDB를 선택했으나 모델링은 reference를 이용한 RDB 구조를 표방
    * 비즈니스 로직상 유저 document(부모)에서 이미지 document(자식)으로만 접근하기 때문에 자식 참조로 모델링하여 mongoose 이용에 편리성을 가진다   
    * MongoDB 또한 index가 존재하며 B-tree 구조로 구현되어 있지만 RDB에 비해 활용이 떨어진다
2. nodeJS는 싱글스레드로 구동하는데, 많은 요청으로 인한 지연은 어떻게 해결할 것인가?
    * 각 기능의 단순 성능을 우선 개선하고자 쿼리 최적화 및 비동기 처리를 적용
    * Clustering 기법을 적용했지만 유의미한 성능 개선이 전무
        * No Clustering   ![image](https://user-images.githubusercontent.com/77658870/201222425-0dcc772c-5ce4-4610-bc91-4c1e132e5d71.png)
        * 3 Clustering   ![image](https://user-images.githubusercontent.com/77658870/201222442-c6a747a5-0cc4-4342-a9db-3c7ab68768c2.png)
        * 6 Clustering   ![image](https://user-images.githubusercontent.com/77658870/201222457-818a4144-fe17-420b-8a7a-f01b9306053a.png)
    * NodeJS는 내부의 libuv의 thread pool에 의해 DB CRUD, Http 요청, 파일 시스템 같은 Blocking 작업들을 멀티 스레드로 처리하도록 설계되었다
    * 본 프로젝트의 ExpressJS 서버는 간단한 CRUD와 모델 서버로의 라우팅 역할을 주로 하기 때문에 Clustering의 이점을 보기 힘들었다.
    
