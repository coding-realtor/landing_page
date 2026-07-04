---
name: board-builder
description: GitHub API + Vercel 기반 정적 게시판 홈페이지 구축 스킬. 부동산 중개사 홈페이지의 게시판 기능을 GitHub API로 데이터 저장·불러오기, Vercel 서버리스로 토큰 관리하는 방식으로 구현한다.
metadata:
  type: project
---

## 아키텍처

- **프론트엔드**: 순수 HTML + Tailwind CSS CDN (빌드 불필요)
- **데이터 저장**: `data/posts.json` → GitHub Contents API (PUT)로 직접 커밋
- **토큰 관리**: Vercel 환경변수 → `/api/config` 서버리스 함수로 프론트에 전달
- **인증**: sessionStorage `isAdmin` 플래그, 비밀번호는 Vercel `ADMIN_PASSWORD` 환경변수

## 파일 구조

- `index.html` — 메인 + 최신 게시글 3개 미리보기
- `news.html` — 전체 게시글 목록 + 실시간 검색
- `news-detail.html` — 게시글 상세 (마크다운 렌더링)
- `news-write.html` — 글쓰기/수정 (관리자 전용)
- `admin.html` — 관리자 로그인 + 게시글 대시보드
- `db.js` — GitHub API 연동, renderMarkdown, markdownToText, 인증 유틸
- `api/config.js` — Vercel 서버리스: 환경변수 → JSON 응답
- `config/git_config.json` — 로컬 fallback 설정 (token = YOUR_GITHUB_TOKEN)
- `data/posts.json` — 게시글 데이터 (GitHub에 저장)
- `vercel.json` — cleanUrls, trailingSlash 설정

## Vercel 환경변수

| Key | Value |
|-----|-------|
| `GITHUB_TOKEN` | GitHub Personal Access Token (repo 권한) |
| `ADMIN_PASSWORD` | 관리자 비밀번호 (기본: admin1234) |

## 주의사항

- `public/` 폴더를 만들면 Vercel이 이를 루트로 취급해 HTML 404 발생
- `vercel.json`에 `builds` 배열 사용 금지 → `/api/config` 라우팅 누락 원인
- 토큰에 공백/줄바꿈 포함 시 GitHub fetch 실패 → `.trim()` 처리 필수
