# Minié 사용자 맞춤형 화장품 미니 사이즈 플랫폼
화장품 유목민들을 위한 미니 사이즈 화장품 판매 플랫폼을 목표로 제작한 기본 프로젝트입니다.

## 🖥️ 데모 링크
🔗 배포 사이트: https://minie-eta.vercel.app/
[<img src="https://private-user-images.githubusercontent.com/114320282/520552519-b8ce12bf-b711-4a9b-a779-9af3d0996b64.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjQ1NTIzNjUsIm5iZiI6MTc2NDU1MjA2NSwicGF0aCI6Ii8xMTQzMjAyODIvNTIwNTUyNTE5LWI4Y2UxMmJmLWI3MTEtNGE5Yi1hNzc5LTlhZjNkMDk5NmI2NC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUxMjAxJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MTIwMVQwMTIxMDVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1lYTM5ZDVjYzg0ZmQ2MTAwMDgxOTQ3NGFmOTEyM2M1YThmYWEzMjk3MjNlM2RiZWEzNWM4NDYyODY4NGFhZWIzJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.eKqCCY6cxvKMcZs-_csVtSJed8UsZeuXVo9hsKZz9Js">](https://minie-eta.vercel.app/)

---
## ⏱️ 제작 기간
2025.11.03 ~ 2025.12.01

## 🚀 기술 스택
### Languages
<img src="https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=Typescript&logoColor=white"/> <img src="https://img.shields.io/badge/Javascript-F7DF1E?style=flat-square&logo=Javascript&logoColor=black"/>

### Frontend
<img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black"/>  <img src="https://img.shields.io/badge/Chakra UI-1BB2A9?style=flat-square&logo=chakraui&logoColor=white"/>  <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white"/>  <img src="https://img.shields.io/badge/Firebase SDK-DD2C00?style=flat-square&logo=firebase&logoColor=white"/>  <img src="https://img.shields.io/badge/Tosspay API-0005CC?style=flat-square&logoColor=white"/> <img src="https://img.shields.io/badge/Google reCAPTCHA-4285F4?style=flat-square&logo=google&logoColor=white"/>

### Backend
<img src="[https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white](https://img.shields.io/badge/Visual Studio Code-007ACC?style=flat-square&logo=Visual Studio Code&logoColor=white)"/> <img src="https://img.shields.io/badge/Firebase Auth SDK-DD2C00?style=flat-square&logo=firebase&logoColor=white"/>
### Tool & Setting
<img src="https://img.shields.io/badge/Visual Studio Code-007ACC?style=flat-square&logoColor=white"/> <img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=Git&logoColor=white"/> <img src="https://img.shields.io/badge/Figma-F24E1E?style=flat-square&logo=Figma&logoColor=white"/> <img src="https://img.shields.io/badge/Postman-white?style=flat-square&logo=Postman&logoColor=FF6C37"/> <img src="https://img.shields.io/badge/GitHub-black?style=flat-square&logo=Github&logoColor=white"/> <img src="https://img.shields.io/badge/Notion-white?style=flat-square&logo=Notion&logoColor=black"/>

### Database
<img src="https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white"/> <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white"/>

### Deploy
<img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white"/>

---

## 📌 주요 기능

- 로그인 / 회원가입
- 상품 목록 및 상세 보기
- 장바구니
- 결제 기능
- 마이페이지
- 리뷰 / 1:1 문의

---

## 📂 폴더 구조

```bash
 ├─ app/
 ├─ components/
 ├─ lib/
 ├─ context/
 ├─ config/
 ├─ firebase/
 └─ utils/

## 📋 Issue 관리

### 작업 전

- 깃허브 Issue 탭에서 `[태그] 작업 내용` 형식으로 이슈 생성
- 예시: `[Feat] 로그인 페이지 구현`

### 작업 후

- 커밋 메시지에 `#이슈번호` 포함
- 예시: `[Feat] 로그인 기능 추가 #1`

---

### 페이지 관리

- app 폴더 안에 페이지 이름으로 폴더 만들기
- 폴더안에 파일명은 반드시 `page.tsx`로 만들것

  - 예시: 로그인 페이지를 만들거라면 app 폴더 안에 login 폴더 생성 -> login 폴더 안에 page.tsx 파일 생성 후 작업

- 사진은 public 폴더 -> images 폴더 안에 자신의 페이지 이름으로 새로운 폴더 생성 후 거기에 image 소스 넣기

---

### 커밋 컨벤션 가이드

- 브랜치를 새로 만들 때에는 현재 브랜치가 `dev 브랜치`인지 확인하고 새로운 브랜치를 생성하기!

### 주요 브랜치

- **main**: 프로덕션 브랜치 (실제 서비스 중인 안정 버전)
- **dev**: 개발 배포 확인용 브랜치 (다음 배포 준비중인 통합 개발 코드)

### 작업 브랜치

- **feature**: 새로운 페이지 개발
  - 네이밍: `feature/기능명/담당자`
  - 예시: `feature/login-page/홍길동`

### 브랜치 워크플로우

```
브랜치 생성
    ↓
개발 중 add - commit - push
    ↓
작업 완료 후 dev 브랜치에 PR
    ↓
컨트리뷰터 코드 리뷰
    ↓
dev 브랜치에 merge
    ↓
프로덕션 배포 시점에 dev → main merge
```

---

## 💬 커밋 메시지 규칙

### 커밋 타입

| 타입       | 설명                                     |
| ---------- | ---------------------------------------- |
| `feat`     | 새로운 기능 추가                         |
| `fix`      | 버그 수정                                |
| `docs`     | 문서 수정 (README, .gitignore 등)        |
| `design`   | CSS 수정, UI 변경                        |
| `refactor` | 코드 리팩토링 (기능 변경 없이 코드 개선) |
| `perf`     | 성능 개선                                |
| `test`     | 테스트 코드 추가/수정                    |
| `chore`    | 빌드/패키지 관리 변경                    |
| `build`    | 빌드 관련 변경 (설정 파일 등)            |

### 커밋 메시지 형식

[타입] 제목 #이슈번호

### 예시

git commit -m "[feat] 회원가입 기능 구현 #1"

- 이메일 중복 체크 기능 추가
- 비밀번호 유효성 검사 로직 구현"

```
git commit -m "[design] 로그인 페이지 UI 개선 #15

* 로그인 버튼 색상 변경
* 반응형 레이아웃 적용"
```

---

## 🔄 Git 작업 프로세스

### 1. 작업 시작 전 브랜치 확인

git branch 현재 브랜치 확인 (⭐ 필수!)

### 2. dev 브랜치 최신화

git checkout dev
git pull origin dev

### 3. 새 작업 브랜치 생성

git checkout -b feature/login-page

### 4. 코드 수정 및 커밋

git add .
git commit -m "[feat] 로그인 페이지 UI 구현 #10"

### 5. 원격 저장소에 푸시

git push origin feature/login-page

### 6. GitHub에서 Pull Request 생성

1. GitHub 저장소 접속
2. **Pull Request** 탭 클릭
3. `feature/login-page` → `dev` 브랜치로 PR 생성
4. 컨트리뷰터 코드 리뷰 대기
5. 승인 후 merge

---

## ⚠️ 주의사항

1. **작업 전 반드시 브랜치 확인**: `git branch` 명령어로 현재 브랜치 확인
2. **main 브랜치에 직접 커밋 금지**: 항상 작업 브랜치에서 작업
3. **커밋 전 코드 리뷰**: 가능하면 동료에게 코드 확인 요청
4. **명확한 커밋 메시지 작성**: 변경 내용을 구체적으로 기술
5. **정기적인 동기화**: 작업 중 주기적으로 main 브랜치와 동기화
