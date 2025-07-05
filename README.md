# IST Agent

AI 에이전트 플레이그라운드 프로젝트입니다.

## 기능

- **Web Agent**: 웹 검색 기능을 제공하는 AI 에이전트
- **Finance Agent**: 금융 데이터 분석 기능을 제공하는 AI 에이전트
- **Finance Team**: 웹 에이전트와 금융 에이전트가 협력하는 팀
- **Phoenix**: 추적 및 모니터링 기능

## Docker로 실행하기

### 0. 사전 요구사항
- Docker 및 Docker Compose 설치
- OpenAI API Key

### 1. 저장소 클론
```bash
git clone <repository-url>
cd ist_agent
```

### 2. 환경 변수 설정
`.env` 파일을 생성하고 필요한 환경 변수를 설정합니다:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Docker 빌드 및 실행

#### 방법 1: 편의 스크립트 사용
```bash
# 빌드
./build.sh build

# 실행
./build.sh run

# 로그 확인
./build.sh logs

# 중지
./build.sh stop
```

#### 방법 2: Docker Compose 직접 사용
```bash
# 빌드 및 실행
docker-compose up --build

# 백그라운드에서 실행
docker-compose up --build -d

# 중지
docker-compose down
```

### 4. 서비스 접근
- **프론트엔드 UI**: http://localhost:5500
- **백엔드 API**: http://localhost:7777
- **Phoenix 추적**: http://localhost:6006

### 5. 문제 해결

#### Docker Buildx 플러그인 오류
WSL2 환경에서 `fork/exec /usr/local/lib/docker/cli-plugins/docker-buildx: no such file or directory` 오류가 발생할 수 있습니다.

**해결 방법:**
```bash
# Docker Desktop을 사용하는 경우
# Docker Desktop 재시작

# 또는 Docker 재설치
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

#### 포트 충돌 문제
포트가 이미 사용 중인 경우 `docker-compose.yml`에서 포트를 변경할 수 있습니다:
```yaml
ports:
  - "5501:3000"  # 5500 대신 5501 사용
  - "6007:6006"  # 6006 대신 6007 사용
  - "7778:7777"  # 7777 대신 7778 사용
```

## 로컬 개발 환경 설정

### 1. agno 라이브러리 설치
```bash
cd agno/libs/agno
pip install -e .
```

### 2. Python 의존성 설치
```bash
pip install -r requirements.txt
```

### 3. 프론트엔드 의존성 설치
```bash
cd agent-ui
npm install
```

### 4. 서비스 실행
```bash
# Phoenix 서버 실행
phoenix serve

# 백엔드 실행
python playground_team.py

# 프론트엔드 실행
cd agent-ui
npm run dev
```

## 프로젝트 구조

```
ist_agent/
├── agno/                   # agno 라이브러리
├── agent-ui/              # Next.js 프론트엔드
├── playground_team.py     # 백엔드 서버
├── requirements.txt       # Python 의존성
├── Dockerfile            # Docker 빌드 설정
├── docker-compose.yml    # Docker Compose 설정
├── docker-entrypoint.sh  # 컨테이너 실행 스크립트
├── build.sh              # 빌드 편의 스크립트
└── tmp/                  # 데이터베이스 저장소
```

## 포트 정보

- **5500**: 프론트엔드 UI (외부 접근)
- **3000**: 프론트엔드 서버 (컨테이너 내부)
- **6006**: Phoenix 추적 서버
- **7777**: 백엔드 API 서버 