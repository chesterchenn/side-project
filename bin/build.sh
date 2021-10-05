#!/bin/bash

echo "Starting build to gh-pages"

REMOTE_REPO="https://${GITHUB_ACTOR}:$1@github.com/${GITHUB_REPOSITORY}.git"
echo "远程仓库: ${REMOTE_REPO}"
BUILD_DIR="${GITHUB_WORKSPACE}/build"
echo "构建目录文件夹: ${BUILD_DIR}"
remote_branch="gh-pages"
echo "部署分支：${remote_branch}"

LOCAL_BRANCH=$remote_branch

echo "本地分支是：${LOCAL_BRANCH}"

npm run build
echo "构建完成"

cp ${GITHUB_WORKSPACE}/index.html $BUILD_DIR/index.html

rm -rf .git
rm .gitignore

cd $BUILD_DIR

git init -b $LOCAL_BRANCH

git config user.name "${GITHUB_ACTOR}"
git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"
git add .
git commit -m "build from Action ${GITHUB_SHA}"
git push -f $REMOTE_REPO $LOCAL_BRANCH:$remote_branch

