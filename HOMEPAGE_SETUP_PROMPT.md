아래 문구를 출력한 뒤, 지시사항을 순서대로 실행하여 'GitHub API & Vercel 기반 정적 게시판 홈페이지'를 오류 없이 완벽하게 구축해줘.

우선 "Step 0"으로 사용자에게 아래 정보를 "한 번에 하나씩" 순서대로 요청하고, 매 요청마다 사용자의 답변을 대기했다가 다음 정보 요청을 이어나가줘.

### 📥 Step 0: 필수 정보 순차 요청 및 가이드

1. **Step 0-1: 메인 페이지 디자인 소스코드 요청**
   - 사용자에게 메인 페이지의 디자인 소스코드 (HTML/CSS/JS)를 먼저 입력해 달라고 요청하고 대기해줘.
2. **Step 0-2: 게시판 페이지 디자인 소스코드 요청**
   - 메인 페이지 코드를 확인했다는 답변과 함께, 이번에는 게시판 페이지의 디자인 소스코드 (HTML/CSS/JS)를 입력해 달라고 요청하고 대기해줘.
3. **Step 0-3: GitHub Token(개인 액세스 토큰) 요청 및 발급 안내**
   - 게시판 코드를 받으면, 아래의 GitHub 토큰 발급 방법을 아주 상세하게 설명하며 토큰값을 입력해 달라고 요청하고 대기해줘.
     > 💡 **GitHub 개인 액세스 토큰 (Classic) 발급 방법:**
     > 1. [GitHub](https://github.com/) 로그인 후 우측 상단의 **프로필 아이콘**을 클릭하고 **Settings**로 이동합니다.
     > 2. 좌측 메뉴 맨 아래에 있는 **Developer settings**를 클릭합니다.
     > 3. **Personal access tokens** -> **Tokens (classic)** 메뉴를 차례로 클릭합니다.
     > 4. **Generate new token** -> **Generate new token (classic)**을 선택합니다.
     > 5. **Note**에 토큰의 목적(예: `realty-board-sync`)을 적고 **Expiration**(만료일)을 적절히 설정합니다.
     > 6. **Select scopes** 목록 중 **`repo` 권한 전체**에 체크합니다. (원격 저장소 파일 수정 및 커밋을 위해 필수입니다)
     > 7. 맨 아래의 **Generate token** 버튼을 누릅니다.
     > 8. 생성된 토큰값(`ghp_...`로 시작하는 긴 문자열)은 이 페이지를 벗어나면 다시 확인할 수 없으니 즉시 복사하여 여기에 안전하게 붙여넣어 주세요.
4. **Step 0-4: GitHub ID 및 저장소명 요청 및 확인 방법 안내**
   - 토큰을 성공적으로 입력받으면, 아래의 저장소명 확인 및 생성 방법을 친절히 안내하며 저장소 정보(예: username/repository-name 형식)를 입력해 달라고 요청하고 대기해줘.
     > 💡 **GitHub 저장소 생성 및 이름 확인 방법:**
     > 1. [GitHub](https://github.com/) 메인 화면이나 본인 프로필의 **Repositories** 탭에서 **New** 버튼을 눌러 새 저장소(Repository)를 생성합니다.
     > 2. **Repository name**에 원하는 영문 이름(예: `realty-board`)을 입력합니다.
     > 3. 공개 범위(Public / Private)를 선택하고 맨 아래 **Create repository**를 누릅니다.
     > 4. 생성이 완료된 후, 브라우저 주소창의 `github.com/[사용자ID]/[저장소명]` 부분 또는 저장소 화면 상단에 표시되는 **`[사용자ID]/[저장소명]`** 형식을 그대로 복사하여 알려주세요. (예: `gildong/realty-board`)
5. **Step 0-5: 대표 중개사 이미지 파일명 요청**
   - 저장소 정보를 확인했다는 답변과 함께, 아래 내용을 안내하며 대표 중개사 사진 파일명을 입력해 달라고 요청하고 대기해줘.
     > 📸 **대표 중개사(공인중개사) 사진 파일 안내:**
     > - 사용하실 중개사 사진 파일을 프로젝트 루트 폴더에 미리 복사해 두세요.
     > - 파일명은 영문으로 된 것을 권장합니다. (예: `agent.jpg`, `profile.png`, `broker.jpg`)
     > - 사진이 아직 없거나 나중에 교체할 예정이라면 `screen.png`를 기본값으로 입력해 주세요.
     > - 입력하신 파일명은 메인 페이지(index.html)의 대표 소개 섹션과 게시판(news.html) 사이드바 프로필에 자동으로 적용됩니다.

사용자가 위 5가지 정보를 순서대로 모두 알려주면, 전달받은 디자인 코드와 이미지 파일명을 기반으로 게시판 홈페이지 소스코드 파일들(Step 4)을 즉시 생성하고, 깃 연동 정보로 `config/git_config.json`을 만들고(Step 3), 폴더 구조 생성(Step 2)까지 마친 뒤 **배포용 필수 홈페이지 소스코드 파일들의 생성 완료를 알리는 안내를 해주고 대기해줘.**
사용자가 단계별 터미널 조작을 하지 않아도 되도록, 패키지 설치 확인, 폴더 생성, 깃 연동 푸시 등의 명령어 실행은 에이전트가 직접 도구(run_command 등)를 사용해 자동 실행해줘.

```
   [Step 1/4] 부동산 게시판 홈페이지 에이전트 구축을 시작하겠습니다!
```

---

### Step 1: 필수 패키지 및 Git 자동 확인/설치
- Git 설치 여부를 자동으로 체크하고(git --version), 설치가 안 되어 있다면 알려줘.
- 에이전트가 직접 터미널에 `npm install -g http-server`를 실행하여 로컬 정적 서버 패키지를 무중단 자동 설치해줘.

### Step 2: 폴더 구조 자동 생성
- 필수 폴더를 직접 즉시 생성해줘.
  - 생성 폴더: `data`, `config`, `scripts`, `templates`, `_agent/skills/board-builder`, `api`
  - ⚠️ **`public`이라는 이름의 폴더는 절대 만들지 마.** Vercel의 "Other" 프리셋은 저장소에 `public/` 폴더가 있으면 그걸 사이트 루트(output 디렉터리)로 취급해서, 루트의 `index.html`·`admin.html` 등 모든 페이지가 404가 나게 돼. 게시글 데이터는 반드시 `data/` 폴더에 둘 것.

### Step 3: 설정 파일 및 보안 처리 파일 생성
1. **config/git_config.json 직접 생성**: 
   - 깃허브 보안 정책(Push Protection)에 의해 실제 토큰이 파일에 적혀 푸시되는 것이 차단되는 것을 방지하기 위해, 토큰값은 반드시 `"YOUR_GITHUB_TOKEN"`으로 치환하여 저장해줘.
   ```json
   {
     "github_token": "YOUR_GITHUB_TOKEN",
     "github_owner": "your_github_owner",
     "github_repo": "your_github_repo",
     "data_file_path": "data/posts.json"
   }
   ```
2. **api/config.js 직접 생성 (Vercel 서버리스 함수)**:
   - Vercel에 안전하게 주입된 환경 변수를 웹사이트 프론트엔드로 안전하게 전달하기 위한 백엔드 API 엔드포인트를 구현해줘.
   - 토큰 값 끝에 줄바꿈/공백이 섞여 들어오면 `Authorization` 헤더가 깨져 `fetch`가 실패(`Invalid value`)하므로, 반드시 `.trim()`으로 정리해서 내려줘.
   - ⚠️ **이 엔드포인트는 `github_token`과 `admin_password`만 반환하고 `github_owner`·`github_repo`는 반환하지 않는다.** `github_owner`·`github_repo`·`data_file_path`는 항상 정적 파일인 `config/git_config.json`에서 읽도록 설계되어 있어. 이 역할 분리를 지켜야 `loadConfig()`가 올바르게 작동해.
   ```javascript
   export default function handler(req, res) {
     res.setHeader("Access-Control-Allow-Origin", "*");
     res.setHeader("Access-Control-Allow-Methods", "GET");
     res.status(200).json({
       github_token: (process.env.GITHUB_TOKEN || "").trim(),
       admin_password: process.env.ADMIN_PASSWORD || "admin1234"
     });
   }
   ```

### Step 4: 소스코드 파일 자동 생성 및 이미지 파일명 자동 수정
아래 5개의 파일 및 `vercel.json`을 생성하고, Step 0-5에서 입력받은 이미지 파일명을 index.html 및 news.html의 `<img>` src 경로에 즉시 적용해줘. 모든 설명용 주석은 제거해줘. (vercel.json은 zero-config 방식이라 이미지 파일명을 넣을 항목이 없음)

**📱 모바일 최적화 요구사항 (모든 페이지 공통 적용):**
- Tailwind의 반응형 접두사(`sm:`, `md:`, `lg:`)를 적극 활용하여 모바일·태블릿·데스크탑 모든 화면에서 레이아웃이 자연스럽게 전환되도록 구현해줘.
- 버튼, 링크 등 터치 요소는 최소 44×44px 이상의 탭 영역을 확보해줘.
- 모바일(md 미만)에서는 하단 고정 네비게이션(bottom nav)을 표시하고, 데스크탑에서는 숨겨줘.
- 본문 글꼴 크기는 모바일에서도 가독성이 충분하도록 최소 14px 이상을 유지해줘.
- 이미지는 `max-width: 100%`, `object-fit: cover`를 적용하여 어떤 화면 크기에서도 비율이 깨지지 않도록 해줘.
- 게시글 목록(news.html)은 모바일에서 사이드바를 숨기고 본문이 전체 너비를 사용하도록 해줘.
- 글쓰기 폼(news-write.html)은 모바일 키보드가 올라와도 레이아웃이 흐트러지지 않도록 `min-h-screen` 및 `pb-xxl` 여백을 충분히 확보해줘.
- 스크롤 시 상단 네비게이션이 고정(`sticky` 또는 `fixed`)되어 항상 접근 가능하도록 해줘.

1. **vercel.json (Clean URL 설정 파일 — zero-config 방식)**:
   - ⚠️ **`builds` 배열을 절대 사용하지 마.** 레거시 `builds`(특히 `@vercel/node` + `@vercel/static` 혼합)는 `/api` 서버리스 함수 라우팅을 누락시켜 **`/api/config`가 404가 되고, 그 결과 프론트가 토큰을 못 받아 "GitHub 토큰이 설정되지 않았습니다" 오류로 저장이 실패**하는 원인이야.
   - Vercel은 **`/api` 폴더 안의 파일을 자동으로 서버리스 함수로 배포**하고(`api/config.js` → `/api/config`), 나머지 파일(`*.html`, `db.js`, `screen.png`, `data/posts.json`, `config/git_config.json`)은 자동으로 정적 서빙하므로 `builds` 선언이 전혀 필요 없어. 이 zero-config 방식이 함수 배포에 가장 안정적이야.
   - ⚠️ **단, 저장소에 `public/` 폴더가 있으면 안 돼.** Vercel이 `public/`을 사이트 루트로 삼아 루트의 HTML들이 전부 404가 나므로, 데이터는 `data/` 폴더에 둬(Step 2 참고).
   - **`"cleanUrls": true`** → `.html` 없이 `/admin`, `/news`, `/news-detail`, `/news-write`로 접속. `/admin.html` 요청은 자동으로 `/admin`으로 308 리다이렉트되어 정규화됨.
   - **`"trailingSlash": false`** → 주소 끝의 불필요한 슬래시 제거.
   - vercel.json은 아래처럼 **딱 이 두 줄만** 두면 돼. (`version`, `builds`, `routes` 모두 넣지 말 것)
   ```json
   {
     "cleanUrls": true,
     "trailingSlash": false
   }
   ```
   > 📌 **경로 규칙**: `/api/config.js`는 zero-config로 자동 배포되어 `/api/config`로 호출돼. `config/git_config.json`, `data/posts.json`, `db.js`, `screen.png` 등 모든 정적 파일도 자동 서빙되므로 별도 builds가 필요 없어. 내부 페이지 링크(`href`)·JS 리다이렉트는 `admin.html`처럼 `.html`을 붙여도 cleanUrls가 자동 정규화하고 로컬 `http-server`와도 호환돼. 단, `<img src>`·`<script src>`·`fetch()` 등 **실제 리소스 경로(db.js, screen.png, config/git_config.json, data/posts.json, /api/config)는 확장자·경로를 그대로 유지**해야 하며 clean URL 대상이 아니야.
2. **index.html**:
   - 전달받은 메인 디자인을 반영하되, 푸터의 "Agent Login" 링크에 `id="agent-login-btn"`과 `href="admin.html"`을 바인딩하여 클릭 시 관리자 페이지로 이동하게 해줘. 주석을 제거해줘.
   - **메인 페이지에 "최신 게시판 소식" 섹션을 추가**해줘. 기존 디자인의 색상·폰트 스타일을 유지하면서, `id="board-preview"` 영역에 게시글 카드 3개를 동적으로 렌더링하는 섹션을 구현해줘. 섹션 구성:
     - 섹션 제목: "최신 소식" (또는 디자인에 맞는 제목)
     - `db.js`의 `getPosts()`를 호출해 최신 3개 글을 카드 형태(카테고리 배지, 제목, 날짜, 요약 첫 60자)로 표시
     - 카드 클릭 시 `news-detail.html?id={post.id}`로 이동
     - 섹션 하단에 "전체 게시글 보기 →" 버튼 (`news.html` 링크)
     - 게시글이 없을 경우 섹션 자체를 숨김(`display:none`) 처리
3. **news.html**:
   - 푸터의 "Agent Login" 링크를 `href="admin.html"`로 연결하고, 검색창 `#search-input` 및 목록 영역 `#news-list`를 구현한 뒤 주석을 제거해줘.
4. **news-detail.html**:
   - 게시글 상세보기 페이지를 생성하고 주석을 제거해줘.
   - 본문(`content`)은 평문이 아니라 **마크다운으로 렌더링**해줘. `db.js`의 `renderMarkdown(post.content)` 결과 HTML을 상세 영역에 삽입하고(`escapeHtml` 대신), 컨테이너에는 `white-space: pre-wrap`을 쓰지 마(렌더된 블록 요소가 자체 여백을 가짐).
   - 관리자 로그인 상태(`isAdmin()`)일 때만 수정·삭제 버튼을 표시해줘. 수정 버튼은 `news-write.html?id={post.id}`로, 삭제는 `deletePost()` 후 `news.html`로 이동해줘.
5. **news-write.html**:
   - 글쓰기 및 수정 페이지로, 관리자 외 접근 차단(`requireAdmin()`) 로직을 구현하고, 비관리자 접근 시 `admin.html`로 리다이렉트해줘. 주석을 제거해줘.
6. **admin.html (관리자 전용 대시보드 페이지)**:
   - 아래 구조로 독립된 관리자 페이지를 구현해줘. 디자인은 메인 페이지의 색상·폰트를 그대로 사용하되, 심플한 대시보드 레이아웃으로 구성해줘.
   - **① 비로그인 상태 (로그인 폼)**:
     - 화면 중앙에 로그인 카드를 표시. "관리자 로그인" 제목, 비밀번호 입력 필드(`type="password"`), 로그인 버튼으로 구성.
     - 로그인 시 `loadConfig()`로 불러온 `adminPassword`와 입력값을 비교하여 일치하면 `sessionStorage`에 `isAdmin = 'true'`를 저장하고 같은 페이지를 새로고침(reload)해줘.
     - 불일치 시 "비밀번호가 올바르지 않습니다." 오류 메시지를 폼 하단에 표시해줘 (alert 사용 금지).
   - **② 로그인 후 상태 (게시글 관리 대시보드)**:
     - 상단에 페이지 제목("게시글 관리")과 "새 글 작성" 버튼(`news-write.html`로 이동), "로그아웃" 버튼(sessionStorage 초기화 후 reload)을 배치해줘.
     - `getPosts()`로 불러온 전체 게시글을 테이블 형태로 표시해줘. 컬럼: 번호, 카테고리, 제목, 작성일, 수정/삭제 버튼.
     - **수정** 버튼: `news-write.html?id={post.id}`로 이동.
     - **삭제** 버튼: 확인 후 `deletePost(id)` 호출, 성공 시 목록 재렌더링.
     - 게시글이 없을 경우 "작성된 게시글이 없습니다." 안내 문구 표시.
   - `<script src="db.js"></script>`를 반드시 포함해줘.
7. **db.js (LocalStorage & GitHub API 하이브리드 제어 스크립트)**:
   - ⚠️ **`loadConfig()`는 반드시 `/api/config`와 `config/git_config.json` 두 소스를 항상 병렬로 모두 조회하고 결과를 병합**해야 해. `/api/config`가 성공해도 `config/git_config.json` 조회를 건너뛰면 `github_owner`·`github_repo`가 `undefined`가 되어 GitHub API URL이 `repos/undefined/undefined/...`로 깨지고 **저장 시 "저장 실패: Not Found(404)"** 오류가 발생해. 토큰은 `/api/config` 값을 우선 사용하고, `github_owner`·`github_repo`·`data_file_path`는 항상 `config/git_config.json`에서 읽어야 해.
   - 올바른 `loadConfig()` 구현 패턴 (아래 코드를 그대로 사용할 것):
   ```javascript
   async function loadConfig() {
     if (_config) return _config;
     let api = {}, file = {};
     try { const r = await fetch('/api/config'); if (r.ok) api = await r.json(); } catch(e) {}
     try { const r = await fetch('config/git_config.json'); if (r.ok) file = await r.json(); } catch(e) {}
     const apiTok = String(api.github_token || '').trim();
     const fileTok = String(file.github_token || '').trim();
     _config = {
       github_token: (apiTok && apiTok !== 'YOUR_GITHUB_TOKEN') ? apiTok : fileTok,
       github_owner: file.github_owner || '',
       github_repo: file.github_repo || '',
       data_file_path: file.data_file_path || 'data/posts.json',
       admin_password: api.admin_password || file.admin_password || 'admin1234'
     };
     return _config;
   }
   ```
   - `requireAdmin()` 함수는 비로그인 상태일 때 `admin.html`로 리다이렉트하도록 구현해줘.
   - `isAdmin()` 함수는 `sessionStorage.getItem('isAdmin') === 'true'`로 판별해줘.
   - `handleAgentLogin(event)` 함수는 제거하거나 `admin.html`로 단순 이동하는 형태로 대체해줘 (Admin 로그인은 admin.html에서 전담).
   - ⚠️ **토큰 정제 필수**: GitHub 요청 헤더를 만들 때 `Authorization: "token " + 토큰`에서 토큰의 공백·줄바꿈을 반드시 제거(`String(token).replace(/\s+/g, "")` 또는 `.trim()`)해줘. 환경변수에 줄바꿈이 섞이면 `Failed to execute 'fetch' on 'Window': Invalid value` 오류로 저장이 실패하기 때문이야. 설정 로드(`loadConfig`) 시점에도 토큰을 `.trim()` 처리할 것.
   - 📝 **마크다운 렌더러 포함**: 외부 라이브러리 없이 동작하는 `renderMarkdown(src)`(제목 `#`, 목록 `-`/`1.`, `**굵게**`, `*기울임*`, `~~취소선~~`, `` `코드` ``, ```` ```코드블록``` ````, `>` 인용, `[텍스트](url)` 링크, `---` 구분선, 문단·줄바꿈 지원)와 목록 요약용 `markdownToText(src)`(마크다운을 평문으로 변환)를 구현하고 전역 노출해줘.
     - **보안**: `renderMarkdown`은 반드시 입력을 먼저 HTML-escape한 뒤 서식을 적용해서, 본문에 들어온 `<script>` 등 원시 HTML이 그대로 실행되지 않게(안전한 태그만 생성) 해줘. 링크는 `http/https/mailto`만 허용.
     - 코드 스팬 처리는 숫자 플레이스홀더/센티넬 대신 **백틱 기준 분할**로 구현해 "5 억" 같은 일반 숫자가 코드로 오인되지 않게 할 것.
     - `news-detail.html` 본문은 `renderMarkdown`으로, `news.html`·`index.html`의 목록·미리보기 요약은 `markdownToText(...).slice(0, N)`로 렌더링해줘.
   - 📄 **작성 편의용 템플릿**: `templates/post-template.md`를 생성해줘. 상단 프론트매터(`--- title / category / date ---`)로 메타데이터를, 그 아래는 마크다운 본문을 적는 형식이야. (프론트매터는 사이트가 파싱하지 않고, 사용자가 글을 건네줄 때 제목·카테고리·본문을 구분하기 위한 규약임. 본문 마크다운만 `content` 필드에 저장.)

### Step 5: Skill 정의서 저장
`_agent/skills/board-builder/SKILL.md` 파일을 생성하여 스킬 사양을 저장해줘.

### Step 6: 설정 완료 보고 및 원클릭 깃 자동 연동 실행
파일 작성이 완료되면 아래 구조도를 출력한 후, 에이전트가 직접 터미널을 호출하여 사용자의 토큰 정보가 포함된 아래 깃 명령어 세트를 로컬 터미널에서 즉시 백그라운드로 연속 실행하고 결과를 출력해줘.
```
✅ [Step 1/4] 게시판 홈페이지 에이전트 구축 및 깃 연동 준비 완료! 🎉

📂 프로젝트 구조:
├── _agent/skills/board-builder/SKILL.md
├── api/config.js
├── config/git_config.json
├── data/posts.json
├── vercel.json
├── db.js
├── index.html          ← 최신 게시글 3개 미리보기 섹션 포함
├── news.html           ← 전체 게시글 목록 + 검색
├── news-detail.html    ← 게시글 상세 + 관리자 수정/삭제
├── news-write.html     ← 글쓰기/수정 (관리자 전용)
└── admin.html          ← 관리자 로그인 + 게시글 관리 대시보드
```

```bash
git init
git add .
git commit -m "feat: init serverless board homepage"
git branch -M main
git remote add origin https://[GITHUB_TOKEN]@github.com/[GITHUB_OWNER]/[GITHUB_REPO].git
git push -u origin main
```

---

### 🧪 Step 7: Vercel 배포 가이드 및 클로징

깃 업로드가 완료되면, 사용자가 웹사이트를 실제로 배포하고 연동할 수 있도록 아래의 **Vercel 배포 가이드**를 아주 친절하고 상세하게 출력하며 안내해줘.

---

#### 🚀 Vercel을 이용한 초간단 웹사이트 배포 및 설정 가이드

방금 깃허브로 푸시한 홈페이지를 전 세계 어디서나 접속할 수 있도록 Vercel에 무료로 배포해 보겠습니다. 아래 단계를 차례대로 따라 해 주세요.

1. **Vercel 회원가입 및 로그인**
   - [Vercel 공식 홈페이지](https://vercel.com/)에 접속합니다.
   - **Log In** (또는 **Sign Up**) 버튼을 누르고, 반드시 **`Continue with GitHub`**를 선택하여 방금 저장소를 생성한 깃허브 계정으로 로그인/연동합니다.

2. **저장소 가져오기 (Import)**
   - Vercel 로그인 후 첫 대시보드 화면에서 우측 상단의 **[Add New...]** -> **[Project]** 버튼을 클릭합니다.
   - **Import Git Repository** 목록에서 방금 푸시한 저장소(예: `username/repository-name`)를 찾은 뒤, 우측의 **[Import]** 버튼을 클릭합니다.
   - *만약 저장소가 목록에 보이지 않는다면, 하단의 `Configure GitHub App`을 클릭해 Vercel이 본인의 GitHub 저장소에 접근할 수 있도록 권한을 승인해 주어야 합니다.*

3. **환경 변수 (Environment Variables) 설정**
   - **Configure Project** 설정 화면이 나타나면 다른 빌드 옵션은 건드리지 않고, 화면 중간의 **Environment Variables** 메뉴를 클릭하여 펼칩니다.
   - 아래 두 가지 환경 변수를 각각 추가해 줍니다:
     * **첫 번째 변수**
       - **Key (Name)**: `GITHUB_TOKEN`
       - **Value**: 발급하신 깃허브 개인 액세스 토큰 값 (예: `ghp_...`로 시작하는 값) 입력 후 **[Add]** 클릭.
     * **두 번째 변수**
       - **Key (Name)**: `ADMIN_PASSWORD`
       - **Value**: `admin1234` (게시판 관리자 로그인 시 사용할 비밀번호) 입력 후 **[Add]** 클릭.
   - 입력한 두 개의 환경 변수가 리스트에 정상 등록되었는지 확인합니다.

4. **배포 시작 (Deploy)**
   - 모든 설정을 마치셨다면 맨 아래의 **[Deploy]** 버튼을 클릭합니다.
   - 약 1~2분 정도 빌드 및 배포가 진행된 후, 축하 메세지와 함께 실제 웹사이트의 접속 주소(Domain URL, 예: `https://[저장소명].vercel.app`)가 생성됩니다.

5. **Clean URL로 접속 확인 (`.html` 없는 주소)**
   - `vercel.json`의 `cleanUrls` 설정 덕분에 모든 페이지를 확장자 없이 접속할 수 있습니다.
     * 메인: `https://[도메인]/`
     * 게시판: `https://[도메인]/news`
     * 관리자: `https://[도메인]/admin`
     * 상세/글쓰기: `https://[도메인]/news-detail?id=...`, `https://[도메인]/news-write`
   - `/admin.html`처럼 `.html`을 붙여 접속해도 자동으로 `/admin`으로 리다이렉트되어 항상 깔끔한 주소로 정규화됩니다.

---

```text
✅ 깃허브 저장소로의 코드 푸시 및 Vercel 연동 설정 안내가 끝났습니다!
배포가 마무리되면 웹사이트 주소를 확인해 보세요.
```
```
