#!/bin/bash

# Docker 빌드 및 실행 스크립트

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# 사용법 출력
usage() {
    echo "Usage: $0 [OPTION]"
    echo "Options:"
    echo "  build    - Docker 이미지 빌드"
    echo "  run      - 컨테이너 실행"
    echo "  stop     - 컨테이너 중지"
    echo "  restart  - 컨테이너 재시작"
    echo "  logs     - 컨테이너 로그 확인"
    echo "  clean    - 모든 컨테이너 및 이미지 삭제"
    echo "  help     - 도움말 표시"
}

# Docker 설치 확인
check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker가 설치되지 않았습니다. Docker를 먼저 설치해주세요."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose가 설치되지 않았습니다. Docker Compose를 먼저 설치해주세요."
        exit 1
    fi
}

# 환경 변수 확인
check_env() {
    if [ ! -f .env ]; then
        warn ".env 파일이 존재하지 않습니다."
        echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
        warn ".env 파일을 생성했습니다. OPENAI_API_KEY를 설정해주세요."
    fi
}

# 빌드 함수
build() {
    log "Docker 이미지 빌드를 시작합니다..."
    docker-compose build
    log "빌드 완료!"
}

# 실행 함수
run() {
    log "컨테이너를 시작합니다..."
    docker-compose up -d
    log "컨테이너가 시작되었습니다."
    log "서비스 접근 주소:"
    echo "  - 프론트엔드: http://localhost:5500"
    echo "  - 백엔드 API: http://localhost:7777"
    echo "  - Phoenix 추적: http://localhost:6006"
}

# 중지 함수
stop() {
    log "컨테이너를 중지합니다..."
    docker-compose down
    log "컨테이너가 중지되었습니다."
}

# 재시작 함수
restart() {
    log "컨테이너를 재시작합니다..."
    docker-compose restart
    log "컨테이너가 재시작되었습니다."
}

# 로그 확인 함수
logs() {
    log "컨테이너 로그를 확인합니다..."
    docker-compose logs -f
}

# 정리 함수
clean() {
    log "모든 컨테이너와 이미지를 삭제합니다..."
    docker-compose down -v --rmi all
    log "정리 완료!"
}

# 메인 로직
main() {
    check_docker
    check_env
    
    case "${1:-help}" in
        build)
            build
            ;;
        run)
            run
            ;;
        stop)
            stop
            ;;
        restart)
            restart
            ;;
        logs)
            logs
            ;;
        clean)
            clean
            ;;
        help|*)
            usage
            ;;
    esac
}

main "$@" 