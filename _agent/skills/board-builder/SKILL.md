---
name: board-builder
description: GitHub API & Vercel 기반 정적 부동산 게시판 홈페이지를 구축/유지보수하는 스킬. 메인/게시판/상세/글쓰기/관리자 페이지와 서버리스 config API, GitHub Contents API 하이브리드 저장 구조를 생성한다.
---

# board-builder

부동산 중개사무소용 **정적 게시판 홈페이지**를 GitHub API + Vercel 서버리스로 구축하는 스킬.

## 아키텍처

- **정적 호스팅**: Vercel (`@vercel/static`)로 HTML/JS/이미지 서빙
- **서버리스 함수**: `api/config.js` (`@vercel/node`)가 환경변수(`GITHUB_TOKEN`, `ADMIN_PASSWORD`)를 프론트로 전달
- **데이터 저장소**: GitHub Contents API로 `data/posts.json`을 읽고(GET) 커밋(PUT)하는 하이브리드 방식 + LocalStorage 캐시
- **인증**: `sessionStorage.isAdmin` 플래그 기반의 클라이언트 관리자 세션

## 파일 구성

| 파일 | 역할 |
|---|---|
| `index.html` | 메인 페이지 + 최신 게시글 3개 미리보기(`#board-preview`) |
| `news.html` | 전체 게시글 목록(`#news-list`) + 검색(`#search-input`) |
| `news-detail.html` | 게시글 상세 + 관리자 수정/삭제 |
| `news-write.html` | 글쓰기/수정 (관리자 전용, `requireAdmin()`) |
| `admin.html` | 관리자 로그인 + 게시글 관리 대시보드 |
| `db.js` | 설정 로드 · GitHub CRUD · 관리자 세션 제어 |
| `api/config.js` | Vercel 서버리스 config 엔드포인트 |
| `config/git_config.json` | owner/repo/data 경로 (토큰은 placeholder) |
| `vercel.json` | 빌드/라우팅 설정 |
| `data/posts.json` | 게시글 데이터 (JSON 배열) |

## db.js 공개 API

- `loadConfig()` — `/api/config` → `config/git_config.json` 순서로 설정 로드
- `getPosts()` / `getPost(id)` — 게시글 조회 (id 내림차순 정렬)
- `createPost({category,title,content})` — 신규 게시글 커밋
- `updatePost(id, {...})` — 게시글 수정 커밋
- `deletePost(id)` — 게시글 삭제 커밋
- `isAdmin()` — `sessionStorage.isAdmin === 'true'`
- `requireAdmin()` — 비로그인 시 `admin.html`로 리다이렉트

## 데이터 스키마 (posts.json)

```json
[
  { "id": 1720000000000, "category": "시황", "title": "제목", "content": "본문", "date": "2026.07.03" }
]
```

## 배포 절차

1. `git push`로 저장소 업로드
2. Vercel에서 저장소 Import
3. 환경변수 `GITHUB_TOKEN`(repo 권한), `ADMIN_PASSWORD` 등록
4. Deploy

## 주의사항

- `config/git_config.json`에는 실제 토큰을 넣지 않는다(`YOUR_GITHUB_TOKEN` placeholder). GitHub Push Protection 및 토큰 노출 방지.
- 실제 토큰은 Vercel 환경변수로만 주입한다.
- `/api/config`가 토큰을 클라이언트로 전달하므로, **repo 권한 전용 + 짧은 만료 토큰**과 **비공개 저장소** 사용을 권장한다.
