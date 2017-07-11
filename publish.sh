#!/usr/bin/env bash

echo ""
echo "--- git commit ---"
echo ""

git add .
git commit

echo ""
echo "--- git push ---"
echo ""

git push origin master