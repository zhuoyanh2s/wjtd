#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:-}"
if [[ -z "$VERSION" ]]; then
  echo "用法: ./build.sh <version> [--skip-maven] [--sync-htmls] [--sync-config] [--push]"
  exit 1
fi

case "$VERSION" in
  *[!A-Za-z0-9._-]*)
    echo "版本号只能包含字母、数字、点、下划线、横线"
    exit 1
    ;;
esac

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEPLOY="$ROOT/deploy"
IMAGE="${REGISTRY:+$REGISTRY/}wjtd-ow:$VERSION"

SKIP_MAVEN=0
SYNC_HTMLS=0
SYNC_CONFIG=0
PUSH=0

for arg in "${@:2}"; do
  case "$arg" in
    --skip-maven) SKIP_MAVEN=1 ;;
    --sync-htmls) SYNC_HTMLS=1 ;;
    --sync-config) SYNC_CONFIG=1 ;;
    --push) PUSH=1 ;;
    *) echo "未知参数: $arg"; exit 1 ;;
  esac
done

command -v docker >/dev/null || {
  echo "未安装 docker"
  exit 1
}

if [[ "$SKIP_MAVEN" -eq 0 ]]; then
  (cd "$ROOT" && mvn  -DskipTests package)
fi

JAR="$(ls -t "$ROOT"/web/target/fastcms-web-*-exec.jar 2>/dev/null | head -n 1 || true)"
if [[ -z "$JAR" ]]; then
  echo "找不到 exec jar，请先执行 mvn package"
  exit 1
fi

cp "$JAR" "$DEPLOY/app.jar"

HTMLS_DIR="$DEPLOY/htmls"
TEMPLATE_DIR="$ROOT/templates/src/main/resources"

if [[ "$SYNC_HTMLS" -eq 1 ]]; then
  echo "同步 htmls: $TEMPLATE_DIR -> $HTMLS_DIR"
  rm -rf "${HTMLS_DIR:?}"
  mkdir -p "$HTMLS_DIR"
  cp -r "$TEMPLATE_DIR/." "$HTMLS_DIR/"
elif [[ ! -d "$HTMLS_DIR/cms" ]]; then
  echo "初始化 htmls: $HTMLS_DIR"
  mkdir -p "$HTMLS_DIR"
  cp -r "$TEMPLATE_DIR/." "$HTMLS_DIR/"
fi

CONFIG_DIR="$DEPLOY/config"
CONFIG_FILE="$CONFIG_DIR/application-prod.yml"
SRC_CONFIG="$ROOT/web/src/main/resources/application-prod.yml"

if [[ "$SYNC_CONFIG" -eq 1 ]]; then
  echo "同步 config: $SRC_CONFIG -> $CONFIG_FILE"
  mkdir -p "$CONFIG_DIR"
  cp "$SRC_CONFIG" "$CONFIG_FILE"
  chmod 600 "$CONFIG_FILE" 2>/dev/null || true
elif [[ ! -f "$CONFIG_FILE" ]]; then
  echo "初始化 config: $CONFIG_FILE"
  mkdir -p "$CONFIG_DIR"
  cp "$SRC_CONFIG" "$CONFIG_FILE"
  chmod 600 "$CONFIG_FILE" 2>/dev/null || true
fi

docker build -t "$IMAGE" "$DEPLOY"

if [[ "$PUSH" -eq 1 ]]; then
  docker push "$IMAGE"
fi

echo "构建完成: $IMAGE"
