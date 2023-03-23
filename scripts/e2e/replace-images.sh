#!/bin/sh
docker run -ti -u 1000:$(id -g) -v $(pwd):/data --security-opt seccomp=scripts/e2e/chrome.json --entrypoint /bin/bash hub.docker.nexus3.linkurious.net/linkurious/docker-agent-jnlp-node:0.0.13 -c 'source .profile;cd /data; npm i sharp --registry=https://registry.npmjs.org/; npx playwright install;CI=true REPLACE=true ./scripts/e2e/index.js;'
git checkout -- package*
