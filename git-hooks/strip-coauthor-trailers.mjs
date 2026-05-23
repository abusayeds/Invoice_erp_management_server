#!/usr/bin/env node
/**
 * Removes Cursor git attribution from commit messages.
 * Used by .husky/prepare-commit-msg.
 */
import fs from "node:fs";

const PATTERNS = [
  /cursoragent@cursor\.com/i,
  /Made-with:\s*Cursor/i,
  /Co-authored-by:\s*Cursor\b/i,
];

const stripMessage = (text) => {
  const kept = text
    .split(/\r?\n/)
    .filter((line) => !PATTERNS.some((pattern) => pattern.test(line)));
  let body = kept.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd();
  if (body.length) body += "\n";
  return body;
};

const msgFile = process.argv[2];
if (msgFile) {
  const original = fs.readFileSync(msgFile, "utf8");
  fs.writeFileSync(msgFile, stripMessage(original), "utf8");
} else {
  const stdin = fs.readFileSync(0, "utf8");
  process.stdout.write(stripMessage(stdin));
}
