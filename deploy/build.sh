#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:-}"
if [[ -z "$VERSION" ]]; then
  echo "用法: ./build.sh <version> [--skip-maven] [--push]"
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
IMAGE="${REGISTRY:+$REGISTRY/}wjtd-website:$VERSION"

SKIP_MAVEN=0
PUSH=0

for arg in "${@:2}"; do
  case "$arg" in
    --skip-maven) SKIP_MAVEN=1 ;;
    --push) PUSH=1 ;;
    *) echo "未知参数: $arg"; exit 1 ;;
  esac
done

command -v docker >/dev/null || {
  echo "未安装 docker"
  exit 1
}

if [[ "$SKIP_MAVEN" -eq 0 ]]; then
  (cd "$ROOT" && mvn -q -DskipTests package)
fi

JAR="$(ls -t "$ROOT"/web/target/fastcms-web-*-exec.jar 2>/dev/null | head -n 1 || true)"
if [[ -z "$JAR" ]]; then
  echo "找不到 exec jar，请先执行 mvn package"
  exit 1
fi

cp "$JAR" "$DEPLOY/app.jar"

docker build -t "$IMAGE" "$DEPLOY"

if [[ "$PUSH" -eq 1 ]]; then
  docker push "$IMAGE"
fi

echo "构建完成: $IMAGE"
