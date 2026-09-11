# 서민혁 Portfolio

순수 HTML, CSS, JavaScript로 만든 반응형 웹 포트폴리오입니다. 웹 개발의 기본 구조부터 사용자 이벤트, 상태 변경, DOM 렌더링, 외부 API 연동까지 직접 구현하며 학습한 내용을 담았습니다.

## 배포 URL

- [포트폴리오 바로가기](https://wasw2123.github.io/cds-b1-1/)

## 저장소

- [GitHub 저장소](https://github.com/wasw2123/cds-b1-1)

## 주요 기능

- 모바일 햄버거 메뉴와 내비게이션 상태 관리
- 섹션 링크의 부드러운 스크롤 이동
- 스크롤 위치에 따른 고정 헤더와 맨 위로 이동 버튼 표시
- `IntersectionObserver`를 이용한 섹션 등장 애니메이션
- 라이트·다크 모드 전환과 `localStorage` 설정 저장
- 저장된 테마가 없을 때 운영체제 테마 설정 감지
- GitHub REST API를 이용한 공개 저장소 목록 렌더링
- 로딩, 성공, 빈 결과, 오류, 요청 제한 상태별 화면 처리
- 저장소의 사용 언어를 기준으로 프로젝트 필터링
- 문의 폼의 필수 입력과 이메일 형식 검증
- 모바일, 태블릿, 데스크톱을 지원하는 반응형 레이아웃
- 사용자의 모션 감소 설정을 고려한 애니메이션 처리

## 사용 기술

- Semantic HTML5
- CSS Custom Properties
- Flexbox, CSS Grid
- Media Queries
- Vanilla JavaScript
- DOM API, Fetch API
- Local Storage
- Intersection Observer API
- GitHub REST API
- Git, GitHub Pages

별도의 프레임워크나 빌드 도구 없이 브라우저 기본 기능으로 구현했습니다.

## 프로젝트 구조

```text
cds-b1-1/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── images/
│   ├── profile.jpeg
│   ├── profile.webp
│   └── screenshots/
├── docs/
└── README.md
```

## 로컬 실행 방법

1. 저장소를 클론합니다.

   ```bash
   git clone https://github.com/wasw2123/cds-b1-1.git
   ```

2. 프로젝트 폴더로 이동합니다.

   ```bash
   cd cds-b1-1
   ```

3. VS Code에서 폴더를 엽니다.

   ```bash
   code .
   ```

4. VS Code의 Live Server 확장을 설치하고 `index.html`에서 **Open with Live Server**를 선택합니다.

이 프로젝트는 빌드 과정이나 패키지 설치가 필요하지 않습니다. 간단히 확인할 때는 `index.html`을 브라우저로 열 수도 있지만, API 요청과 실제 배포 환경에 가까운 테스트를 위해 로컬 서버 사용을 권장합니다.

## 주요 동작 기준

| 기능 | 기준값 | 동작 |
| --- | ---: | --- |
| 고정 헤더 스타일 | `60px` | 스크롤 위치가 60px 이상이면 배경과 그림자를 표시합니다. |
| 맨 위로 버튼 | `300px` | 스크롤 위치가 300px 이상이면 버튼을 표시합니다. |
| 섹션 등장 애니메이션 | `threshold: 0.2` | 요소의 약 20%가 화면에 들어오면 표시합니다. |
| 태블릿 레이아웃 | `768px` | 햄버거 메뉴를 일반 내비게이션으로 전환합니다. |
| 데스크톱 레이아웃 | `1024px` | 섹션 여백과 주요 제목 크기를 확장합니다. |

스크롤 이동은 사용자가 모션 감소를 설정하지 않았을 때만 `smooth`로 처리합니다.

## GitHub API

Projects 영역은 다음 GitHub REST API에서 공개 저장소를 불러옵니다.

```text
https://api.github.com/users/wasw2123/repos?sort=updated&per_page=12
```

- 최근 업데이트 순으로 최대 12개를 요청합니다.
- 포크하거나 보관 처리된 저장소는 목록에서 제외합니다.
- 저장소 이름, 설명, 주 언어, 스타 수, 최근 업데이트 날짜를 표시합니다.
- API 응답 상태에 따라 로딩, 성공, 빈 결과, 오류 화면을 구분합니다.
- 오류가 발생하면 사용자가 다시 요청할 수 있는 재시도 버튼을 제공합니다.
- GitHub 토큰은 클라이언트 코드에 포함하지 않습니다.

인증하지 않은 GitHub REST API 요청은 기본적으로 시간당 60회로 제한됩니다. 요청 제한에 도달하면 잠시 기다린 뒤 다시 시도해야 합니다.

## 문의 폼 안내

현재 문의 폼은 학습용 클라이언트 검증 기능입니다.

- 이름, 이메일, 메시지의 필수 입력을 검사합니다.
- 입력값 앞뒤의 공백을 제거한 뒤 유효성을 판단합니다.
- 이메일 형식을 검사합니다.
- 오류 메시지를 각 입력 요소와 연결하고 첫 번째 오류 입력으로 포커스를 이동합니다.
- 올바르게 입력하면 작성 완료 상태를 표시하고 폼을 초기화합니다.

현재 버전은 실제 이메일을 전송하지 않습니다. 실제 전송 기능을 추가하려면 Formspree 또는 EmailJS 같은 외부 서비스를 별도로 연결하고 개인정보 처리 내용을 함께 안내해야 합니다.

## 접근성 고려 사항

- 콘텐츠 구조에 `header`, `nav`, `main`, `section`, `article`, `footer` 요소를 사용했습니다.
- 모바일 메뉴 상태를 `aria-expanded`로 전달합니다.
- 프로젝트 필터의 선택 상태를 `aria-pressed`로 전달합니다.
- 상태 메시지와 폼 오류를 `aria-live`로 전달합니다.
- 폼의 `label`, `aria-describedby`, `aria-invalid`를 연결했습니다.
- 키보드 사용자를 위한 `:focus-visible` 스타일을 제공합니다.
- `prefers-reduced-motion` 설정을 존중합니다.

## 스크린샷

### 데스크톱

![포트폴리오 데스크톱 화면](images/screenshots/desktop.png)

### 모바일

![포트폴리오 모바일 화면](images/screenshots/mobile.png)

### 다크 모드

![포트폴리오 다크 모드 화면](images/screenshots/dark-mode.png)

## 향후 개선 사항

- Hero 영역 타이핑 애니메이션
- Formspree 또는 EmailJS를 이용한 실제 문의 전송
- 프로젝트별 라이브 데모 링크

## 작성자

- GitHub: [@wasw2123](https://github.com/wasw2123)
- Email: [wasw2123@gmail.com](mailto:wasw2123@gmail.com)
