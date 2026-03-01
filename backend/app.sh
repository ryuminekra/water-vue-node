#!/bin/bash

# 后端服务启动脚本
# 支持 start、stop、status 命令

# 配置项
APP_NAME="water-backend"
APP_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="${APP_DIR}/logs"
LOG_FILE="${LOG_DIR}/app.log"
PID_FILE="${APP_DIR}/app.pid"
NODE_BIN="node"
APP_ENTRY="app.js"

# 确保日志目录存在
mkdir -p "${LOG_DIR}"

# 启动服务
start() {
    # 检查服务是否已启动
    if [ -f "${PID_FILE}" ]; then
        local pid=$(cat "${PID_FILE}")
        if ps -p "${pid}" > /dev/null 2>&1; then
            echo "服务 ${APP_NAME} 已在运行，PID: ${pid}"
            return 0
        else
            # PID文件存在但进程不存在，删除PID文件
            rm -f "${PID_FILE}"
        fi
    fi
    
    echo "正在启动 ${APP_NAME} 服务..."
    
    # 启动服务并将进程ID写入PID文件
    cd "${APP_DIR}" && nohup "${NODE_BIN}" "${APP_ENTRY}" > "${LOG_FILE}" 2>&1 &
    local pid=$!
    
    # 检查服务是否成功启动
    sleep 2
    if ps -p "${pid}" > /dev/null 2>&1; then
        echo "${pid}" > "${PID_FILE}"
        echo "服务 ${APP_NAME} 启动成功，PID: ${pid}"
        echo "日志文件: ${LOG_FILE}"
    else
        echo "服务 ${APP_NAME} 启动失败"
        return 1
    fi
}

# 停止服务
stop() {
    if [ ! -f "${PID_FILE}" ]; then
        echo "服务 ${APP_NAME} 未运行"
        return 0
    fi
    
    local pid=$(cat "${PID_FILE}")
    
    if ps -p "${pid}" > /dev/null 2>&1; then
        echo "正在停止 ${APP_NAME} 服务，PID: ${pid}..."
        kill "${pid}"
        
        # 等待服务停止
        local timeout=10
        local count=0
        while ps -p "${pid}" > /dev/null 2>&1 && [ "${count}" -lt "${timeout}" ]; do
            sleep 1
            count=$((count + 1))
        done
        
        if ps -p "${pid}" > /dev/null 2>&1; then
            echo "服务 ${APP_NAME} 停止超时，强制杀死进程"
            kill -9 "${pid}"
            sleep 1
        fi
        
        rm -f "${PID_FILE}"
        echo "服务 ${APP_NAME} 已停止"
    else
        echo "服务 ${APP_NAME} 未运行，但存在PID文件，已清理"
        rm -f "${PID_FILE}"
    fi
}

# 查看服务状态
status() {
    if [ ! -f "${PID_FILE}" ]; then
        echo "服务 ${APP_NAME} 未运行"
        return 1
    fi
    
    local pid=$(cat "${PID_FILE}")
    
    if ps -p "${pid}" > /dev/null 2>&1; then
        echo "服务 ${APP_NAME} 正在运行，PID: ${pid}"
        echo "日志文件: ${LOG_FILE}"
        return 0
    else
        echo "服务 ${APP_NAME} 未运行，但存在PID文件"
        return 1
    fi
}

# 查看日志
tail_log() {
    if [ -f "${LOG_FILE}" ]; then
        echo "查看 ${APP_NAME} 服务日志..."
        tail -n 50 "${LOG_FILE}"
    else
        echo "日志文件不存在: ${LOG_FILE}"
    fi
}

# 帮助信息
usage() {
    echo "用法: $0 {start|stop|status|log}"
    echo "  start   - 启动服务"
    echo "  stop    - 停止服务"
    echo "  status  - 查看服务状态"
    echo "  log     - 查看服务日志"
    exit 1
}

# 主函数
main() {
    case "$1" in
        start)
            start
            ;;
        stop)
            stop
            ;;
        status)
            status
            ;;
        log)
            tail_log
            ;;
        *)
            usage
            ;;
    esac
}

# 执行主函数
main "$@"
