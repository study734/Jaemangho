# 🚢 라이엇 정식 평생 키 (Personal Product Key) 발급 및 승인 노하우 가이드

매일 24시간마다 API 키를 갱신해야 했던 불편함을 끝내고, **평생 만료되지 않는 정식 'Personal Product Key'**를 Riot Games로부터 완벽하게 승인받기 위한 실전 가이드라인입니다.

---

## 📅 신청 방법 (3분 소요)

1. **[Riot Developer Portal](https://developer.riotgames.com/)**에 로그인합니다.
2. 상단 메뉴의 **[My Apps]**로 이동한 뒤, 우측 상단의 **[Register Project]** 버튼을 클릭합니다.
3. 등록 유형 중 **[Personal Product]**를 선택합니다.
4. 아래에 작성된 **실전 심사용 템플릿**을 복사/붙여넣기하여 양식을 채운 뒤 제출합니다.

---

## ✍️ 실전 심사 신청서 작성 템플릿

라이엇 심사역들은 **"개인 연구용"**이거나 **"소수 길드의 사설 전적 대시보드"** 목적으로 기재했을 때 승인을 가장 부드럽고 완벽하게 해줍니다. 아래 템플릿의 `[괄호]` 영역만 본인 정보로 치환하여 그대로 복사해 사용하세요.

### 1. Project Name (프로젝트 이름)
> `Jaemangho Squad Dashboard`

### 2. Game Interest (해당 게임)
> `League of Legends`

### 3. Product Description (프로젝트 상세 설명) - ⭐️ 가장 중요!
> **[영어 작성 본 (Riot 심사역 제출용)]**
> Hello, Riot Developer Support Team.
> I am building a private/closed-group dashboard named "Jaemangho" for my local League of Legends squad and clan members.
>
> The primary purpose of this web application is to track and visualize member ranks, league points (LP), profile levels, and active games within our small crew. We are also building a synergy analysis tab to study matches played together and showcase champion mastery ranks among our 6-10 crew members.
>
> The application runs securely as a static React client with a custom Vercel Serverless Function proxy (/api/riot) to query the Riot API securely without exposing keys or causing origin CORS conflicts. 
>
> This app is hosted privately on Vercel at [본인의 jaemangho.shop 도메인 입력], and access is limited strictly to our squad members for non-commercial, hobby usage. We do not store or monetize any Riot Games data, and all calls strictly adhere to your Developer Terms.
>
> Thank you for your support.
>
> **[한글 번역 및 의미]**
> *우리 로컬 소환사 크루 6-10명을 위한 비공개 랭킹/전적 대시보드 앱이며, 비상업적 취미 용도로 사용됩니다. 마스터리 점수 조회 및 인게임 관전을 위한 API 호출을 진행하며, Vercel 서버리스 환경에서 API 키를 감추고 안전하게 구동됩니다.*

---

## 💡 승인 통과 확률을 200% 높이는 핵심 꿀팁

1. **절대 "상업적 서비스"나 "광고 부착"을 암시하지 마세요**:
   * 라이엇은 개인용 평생 키(Personal Product Key)를 줄 때, 돈을 벌거나 대중에게 공개 배포하는 서비스를 극도로 경계합니다. 철저히 **"비공개 서클용, 비상업적(Non-commercial) 용도"**임을 명시해야 즉시 승인됩니다.
2. **도메인을 함께 제출하세요**:
   * 사용자님이 가비아에서 도메인을 입혀 Vercel에 올려둔 **`https://jaemangho.shop`** 주소를 프로젝트 설명란에 함께 기재하면, "실제로 완성도 있게 구동되는 프로젝트구나"라고 판단하여 신뢰도가 급상승해 승인이 매우 빨라집니다.
3. **승인 소요 시간**:
   * 보통은 **영업일 기준 2일 ~ 5일** 이내에 승인 메일이 날아옵니다.
   * 승인이 완료되면 포털의 `My Apps` 탭에 영구 키(`Permanent Key`)가 활성화되며, 이 키는 더 이상 **24시간 리프레시 버튼을 누를 필요 없이 영구히 사용**하실 수 있습니다!
