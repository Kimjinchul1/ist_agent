#!/bin/bash

# 에러 발생 시 스크립트 종료
set -e

# 로그 함수
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# 서비스 시작
log "Starting services..."

# Phoenix 서버 시작 (백그라운드)
log "Starting Phoenix server on port 6006..."
phoenix serve --port 6006 --host 0.0.0.0 &
PHOENIX_PID=$!

# 백엔드 서버 시작 (백그라운드)
log "Starting backend server on port 7777..."
cd /app
python playground_team.py &
BACKEND_PID=$!

# 프론트엔드 서버 시작 (백그라운드)
log "Starting frontend server on port 3000..."
cd /app/frontend
npm start &
FRONTEND_PID=$!

# 서비스 대기
log "All services started. Waiting for signals..."

# 시그널 핸들러 설정
cleanup() {
    log "Received termination signal. Shutting down services..."
    
    if kill -0 $PHOENIX_PID 2>/dev/null; then
        log "Stopping Phoenix server..."
        kill $PHOENIX_PID
    fi
    
    if kill -0 $BACKEND_PID 2>/dev/null; then
        log "Stopping backend server..."
        kill $BACKEND_PID
    fi
    
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        log "Stopping frontend server..."
        kill $FRONTEND_PID
    fi
    
    log "All services stopped."
    exit 0
}

# 시그널 트랩
trap cleanup SIGTERM SIGINT

# 서비스들이 실행 중인지 확인하고 대기
while true; do
    # 모든 서비스가 실행 중인지 확인
    if ! kill -0 $PHOENIX_PID 2>/dev/null; then
        log "Phoenix server stopped unexpectedly"
        exit 1
    fi
    
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        log "Backend server stopped unexpectedly"
        exit 1
    fi
    
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        log "Frontend server stopped unexpectedly"
        exit 1
    fi
    
    sleep 10
done 