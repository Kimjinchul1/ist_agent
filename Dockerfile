# Multi-stage build를 사용하여 최적화
FROM node:18-alpine AS frontend-builder

# 프론트엔드 빌드
WORKDIR /app/frontend
COPY agent-ui/package.json agent-ui/package-lock.json ./
RUN npm ci
COPY agent-ui/ .
RUN npm run build

# Python 백엔드와 프론트엔드를 포함하는 최종 이미지
FROM python:3.11-slim

# 시스템 의존성 설치
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Node.js 설치 (프론트엔드 서버 실행용)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# 작업 디렉토리 설정
WORKDIR /app

# Python 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# agno 라이브러리 복사 및 설치
COPY agno/ ./agno/
RUN pip install -e ./agno/libs/agno

# 백엔드 코드 복사
COPY playground_team.py .
COPY tmp/ ./tmp/

# 프론트엔드 빌드 결과물 복사
COPY --from=frontend-builder /app/frontend /app/frontend

# 환경 변수 설정
ENV PYTHONUNBUFFERED=1
ENV NODE_ENV=production

# 포트 노출
EXPOSE 3000 6006 7777

# 시작 스크립트 생성
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# 서비스 실행
CMD ["/docker-entrypoint.sh"] 