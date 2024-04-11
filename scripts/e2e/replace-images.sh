#!/bin/sh
if [ "$(uname)" == "Darwin" ]; then
  rm -rf node_modules/sharp
  npm install --foreground-scripts --verbose --platform=linux --arch=x64 -f sharp@0.32.0
fi
docker run -ti -u 1000:$(id -g) -v $(pwd):/data --security-opt seccomp=scripts/e2e/chrome.json --entrypoint /bin/bash hub.docker.nexus3.linkurious.net/linkurious/docker-agent-jnlp-node:0.0.38 -c 'source .profile;cd /data; node -v; npx playwright install chromium; CI=true REPLACE=true ./scripts/e2e/index.js;'

if [ "$(uname)" == "Darwin" ]; then
  rm -rf node_modules/sharp
  npm i;
fi
