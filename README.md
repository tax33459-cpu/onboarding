# 유진영 세무회계 - 신규 거래처 온보딩 시스템

고객 정보 입력 → 노션 거래처 DB 자동 등록 → 서류 자동 생성까지 한번에!

## 🚀 자동 생성되는 서류
- 📄 기장대리계약서 (고객 정보 자동 기입)
- 🏦 CMS 출금이체 동의서 (계좌 정보 자동 기입)
- 🏥 건강보험 EDI 업무대행 위임장 (직원 있을 때만)
- 🏗️ 고용산재 보험사무 사무위탁서 (직원 있을 때만)

## 📁 파일 구조
```
yj-onboarding/
├── public/
│   ├── index.html    ← 고객 정보 입력 폼 (5단계)
│   └── docs.html     ← 서류 자동생성 페이지
├── api/
│   └── register.js   ← 노션 DB 등록 API
├── vercel.json       ← Vercel 설정
└── README.md
```

## 🔧 배포 방법 (5분!)

### 1단계 - Notion 통합 토큰 발급
1. https://www.notion.so/my-integrations 접속
2. "새 통합 만들기" → 이름: `거래처 온보딩` → 저장
3. Internal Integration Token 복사
4. 노션 거래처 DB 페이지 → `...` → "연결" → 방금 만든 통합 추가

### 2단계 - GitHub 업로드
GitHub에 새 Repository 만들고 이 폴더 업로드

### 3단계 - Vercel 배포
1. https://vercel.com → New Project → GitHub Repository 선택
2. Environment Variables 추가:
   - Key: `NOTION_TOKEN`
   - Value: 1단계에서 복사한 토큰
3. Deploy!

✅ 배포 완료! `https://your-app.vercel.app` URL로 접속하면 됩니다.

## 💡 사용법
1. 고객 방문 시 태블릿/컴퓨터에서 URL 열기
2. 고객이 직접 5단계 폼 입력
3. "등록 및 서류 생성" 클릭
4. → 노션 거래처 DB 자동 등록
5. → 서류 생성 페이지로 자동 이동
6. 🖨️ 출력 버튼으로 바로 프린트!
