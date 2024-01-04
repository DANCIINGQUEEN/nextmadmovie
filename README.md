# 롤매드무비 Next.js

# <https://nextmadmovie.vercel.app>

# **롤매드무비** 배경
  기존의 <a href='https://lolmadmovie.vercel.app'>롤매드무비</a>의 단점을 보완하고자 Next.js로 개발</br>

  ## 기존의 롤매드무비 사이트의 문제와 해결
  
  1. 카카오톡이나 디스코드 등 사이트에 링크 공유시 각각 페이지마다 SEO OG(Open Graph)가 동적으로 할당되지 못함
    => Next.js의 SSR을 이용해 OG(Open Graph)를 동적으로 할당</br>
  2. 하드코딩된 오래된 코드들을 수정하는것보다 새로 만드는것이 낫다는 판단
    => 두서없던 오래된 코드들을 재정비</br>
  3. 플레이리스트를 업로드하기 어려움
    => 유튜브 스튜디오 페이지에서 업로드한 영상 정보들을 JSON형식으로 크롤링하여 업로드</br>
  4. 플레이리스트 수정, 삭제 기능 없음
    => 플레이리스트 수정, 삭제 기능 추가</br>
  5. 검색 기능 없음
    => 검색 기능 추가</br>
  6. 페이지네이션이 제대로 구현되지 못함
    => 페이지네이션 개선
