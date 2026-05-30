# ⚓ 재망호 (Jaemangho) - League of Legends 크루원 전적 대시보드

재망호(Jaemangho)는 리그 오브 레전드(LoL) 크루원들의 실시간 게임 상태, 솔로 랭크 티어, 최근 매치 히스토리, 그리고 개인별 모스트 챔피언 마스터리 점수를 한눈에 확인하고 시너지를 분석할 수 있는 프리미엄 크루 대시보드 애플리케이션입니다.

본 프로젝트의 UI/UX 디자인은 **MongoDB의 공식 디자인 시스템 테마**를 차용하여 깊은 Teal 컬러 테두리와 생생한 브랜딩 그린 포인트를 극대화한 다크 모드 스킨으로 설계되었습니다.

---

## 🌟 핵심 기능

1. **실시간 크루 전적 현황 대시보드**
   - 크루원들의 솔로 랭크 티어, 승률, LP 현황판.
   - 인게임 시뮬레이션 및 실시간 라이엇 API를 이용한 실시간 게임(Active Game) 상태 모니터링.
2. **크루원 관리 (Squad Manager)**
   - 소환사 검색 및 신규 크루원 추가, 수정, 강퇴 기능.
3. **시너지 분석기 (Synergy Analyzer)**
   - 멤버들 간의 게임 플레이 매치 데이터 분석 및 듀오 승률/시너지 자동 분석.
4. **마스터리 전시관 (Mastery Showcase)**
   - 소환사별 모스트 3 챔피언 마스터리 레벨 및 마스터리 포인트 시각화.
5. **라이브 Riot API 연동 엔진 및 CORS 프록시 지원**
   - 개발자 API 키와 CORS 우회 프록시 서버 설정을 완벽하게 지원하여 실제 유저 데이터를 실시간으로 동기화.

---

## 🎨 디자인 시스템 (MongoDB Theme)

[DESIGN.md](file:///c:/Users/zes13/OneDrive/Dokumen/Jaemangho/DESIGN.md) 규격을 엄격하게 준수합니다.
- **색상**: 
  - Primary CTA: MongoDB Green (`#00ed64`)
  - Background & Hero Panel: Deep Navy Teal (`#001e2b`)
  - Category Accent: Purple (`#7b3ff2`), Orange (`#fa6e39`), Pink (`#f06bb8`), Blue (`#3d4f9f`)
- **타이포그래피**: `Euclid Circular A` (기본 폰트), `Source Code Pro` (코드 뷰어)
- **컴포넌트 형태**: 모든 버튼은 알약 형상(`rounded.full` / `border-radius: 9999px`), 카드는 12px 둥근 모서리(`rounded.lg`) 고정.

---

## ⚙️ 엔진 작동 모드 및 외부 API 설정

우측 상단의 **시스템 설정(Settings)** 탭에서 두 가지 모드를 선택할 수 있습니다.

### A. 시뮬레이션 모드 (Default)
- 라이엇 API 키 없이 로컬 가상 엔진이 실시간 게임 중 상태, 티어 변화, 매치 내역을 시뮬레이션하여 100% 끊김 없이 작동합니다.

### B. 실시간 Riot API 연동 모드
- [Riot Developer Portal](https://developer.riotgames.com/)에서 획득한 개인 API Key(`RGAPI-...`)를 등록하여 실제 유저 전적을 조회합니다.
- **CORS 우회 설정**: 브라우저 보안 정책에 의한 API 차단을 방지하기 위해 CORS 프록시 주소(예: `https://corsproxy.io/?` 혹은 `https://cors-anywhere.herokuapp.com/`)를 경유하여 동기화합니다.

---

## 🚀 빌드 및 GitHub Pages 배포 (GitHub Pages Deployment)

본 애플리케이션은 서버가 없는 정적 웹 애플리케이션(Static Client-side SPA)으로 빌드되며, **GitHub Pages**를 통해 배포·호스팅됩니다.

### 1. 로컬 개발 환경 실행
```bash
npm install
npm run dev
```

### 2. 정적 파일 빌드
```bash
npm run build
```
- 빌드 결과물은 `./dist` 폴더에 생성됩니다.
- GitHub Pages 배포를 위해 [vite.config.ts](file:///c:/Users/zes13/OneDrive/Dokumen/Jaemangho/vite.config.ts)의 `base` 경로는 반드시 상대 경로인 `'./'`로 유지되어야 합니다.

### 3. GitHub Pages 배포 관리 (GitHub Actions)
- 배포 프로세스는 [.github/workflows/deploy.yml](file:///c:/Users/zes13/OneDrive/Dokumen/Jaemangho/.github/workflows/deploy.yml)에 의해 구동됩니다.
- **배포 방식 (수동 실행 권장)**: 무분별한 빌드 남용을 막기 위해 커밋 푸시 시 자동 배포 트리거는 비활성화되어 있습니다.
- **배포 방법**: GitHub 저장소 페이지의 **Actions** 탭 ➡️ **Deploy static content to Pages** 선택 ➡️ **Run workflow** 버튼을 눌러 수동으로 배포를 완료해 주세요.
