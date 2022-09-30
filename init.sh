#!/bin/bash

# params

PROJ_ID=${1:-1-pilot}
BATTLE_ID=${2:-99}
BATTLE_NAME=${3:-letter man}
TODAY=$(date +%F)

# code

MDX_FILE_PATH="$(npm root)/../_battles/${PROJ_ID}/${BATTLE_ID}-${BATTLE_NAME}.mdx"
echo "creating ${MDX_FILE_PATH}"
mkdir -p "$(basename "${MDX_FILE_PATH}")"
cat >"$MDX_FILE_PATH" <<EOF
---
title: ${BATTLE_NAME}
description: CSSBattle solution
date: '${TODAY}'
---
EOF

SOLUTION_FILE_PATH="$(npm root)/../public/solutions/${PROJ_ID}/${BATTLE_ID}.html"
echo "creating ${SOLUTION_FILE_PATH}"
mkdir -p "$(basename "${SOLUTION_FILE_PATH}")"
touch "${SOLUTION_FILE_PATH}"

echo "DONE"