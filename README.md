# RoopHero — 끝없는 회랑

뒷골목 출신 주인공이 스킬·장비·동료를 **카드**로 모아 무한 던전을 오르는
카드형 덱빌딩 던전 크롤러. 웹 기반 PWA로, 안드로이드에서 홈 화면에 추가해
앱처럼 설치할 수 있다.

**플레이**: https://ecsrusia-dot.github.io/roophero/

## 코어 루프

1. **출전 준비** — 보유 카드로 로드아웃 구성 (스킬 4 / 장비 3 / 동료 2)
2. **자동 사냥** — 층별 전투를 한 번에 시뮬레이션하고 로그를 애니메이션처럼 재생
3. **사망 → 환생** — `층수×10 + 처치×1 + 아이템 등급 합×5` 로 환생 포인트 정산
4. **가챠** — 포인트로 카드 소환 (일반 60% / 희귀 25% / 영웅 12% / 전설 3%), 중복은 강화 재료로 자동 전환
5. **경지** — 뽑기 운과 무관한 영구 스탯을 포인트로 직접 수련

## 로컬 실행

```bash
npm install
npm run icons   # PWA placeholder 아이콘 생성 (최초 1회)
npm run dev
```

Firebase 설정 없이도 바로 실행된다 — 이 경우 세이브는 브라우저 localStorage에 저장된다.

## Firebase 연결 (선택)

1. [Firebase 콘솔](https://console.firebase.google.com)에서 프로젝트 생성
2. **빌드 > Authentication > 로그인 방법**에서 **익명** 사용 설정
3. **빌드 > Firestore Database** 생성 후, `firestore.rules` 내용을 보안 규칙에 붙여넣기
4. **프로젝트 설정 > 일반 > 내 앱**에서 웹 앱 등록 후 설정값 확인
5. `.env.example`을 `.env`로 복사하고 값 채우기

```bash
cp .env.example .env
# VITE_FIREBASE_* 값 입력 후 dev 서버 재시작
```

## 배포 (GitHub Pages)

`main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 자동으로 빌드해서
GitHub Pages에 배포한다.

1. 저장소 **Settings > Pages**에서 Source를 **GitHub Actions**로 설정
2. Firebase를 쓰는 경우 **Settings > Secrets and variables > Actions**에
   `VITE_FIREBASE_*` 시크릿 6개 등록 (없으면 localStorage 모드로 빌드됨)
3. 저장소 이름이 `roophero`가 아니면 `vite.config.js`의 `BASE` 수정

## 프로젝트 구조

```
/src
  /components   → 카드, 화면 UI (출전 준비 / 전투 로그 / 가챠)
  /systems      → battleSimulator.js (전투 시뮬), gacha.js (소환/강화)
  data.js       → 카드/적/경지 정의 및 밸런스 상수
  firebase.js   → Firestore 초기화 + 세이브 저장/불러오기 (localStorage 폴백)
  App.jsx       → 화면 전환 및 전역 상태
vite.config.js  → PWA 매니페스트 포함
firestore.rules → Firestore 보안 규칙 (본인 세이브만 접근)
.github/workflows/deploy.yml → Pages 자동 배포
```
