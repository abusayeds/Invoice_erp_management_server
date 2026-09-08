#!/bin/sh
# Used by git filter-branch --tree-filter (Git Bash on Windows).
rm -rf .cursor 2>/dev/null || true
if test -f git-hooks/strip-cursor-git-attribution.mjs; then
  mv git-hooks/strip-cursor-git-attribution.mjs git-hooks/strip-coauthor-trailers.mjs
fi
