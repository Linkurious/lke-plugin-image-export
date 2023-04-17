#!/bin/sh
if [ "$(uname)" == "Darwin" ]; then
  npm install --arch=arm64 --platform=linux --libc=musl sharp
fi
docker run -ti -u 1000:$(id -g) -v $(pwd):/data --security-opt seccomp=scripts/e2e/chrome.json --entrypoint /bin/bash hub.docker.nexus3.linkurious.net/linkurious/docker-agent-jnlp-node:0.0.27 -c 'source .profile;cd /data;npx playwright install chromium; CI=true REPLACE=true ./scripts/e2e/index.js;'

if [ "$(uname)" == "Darwin" ]; then
  npm i;
fi
