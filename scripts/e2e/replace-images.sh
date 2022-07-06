#!/bin/sh
if [ "$(uname)" == "Darwin" ]; then
  npm i -D --platform=linux --arch=x64 sharp;
fi
docker run -ti -u 1000:$(id -g) -v $(pwd):/data --security-opt seccomp=scripts/e2e/chrome.json --entrypoint /bin/bash hub.docker.nexus3.linkurious.net/linkurious/docker-agent-jnlp-node:0.0.13 -c 'source .profile;cd /data;npx playwright install; CI=true REPLACE=true ./scripts/e2e/index.js;'

if [ "$(uname)" == "Darwin" ]; then
  npm rm -D sharp && npm i -D sharp;
fi