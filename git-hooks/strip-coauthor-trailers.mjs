#!/usr/bin/env node
/** Remove unwanted co-author trailers before each commit (husky prepare-commit-msg). */
import fs from "node:fs";

const LINE_PATTERNS = [
  /cursoragent@cursor\.com/i,
  /Made-with:\s*Cursor/i,
  /Co-authored-by:\s*Cursor\b/i,
];

const stripMessage = (text) => {
  const kept = text
    .split(/\r?\n/)
    .filter((line) => !LINE_PATTERNS.some((pattern) => pattern.test(line)));
  let body = kept.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd();
  if (body.length) body += "\n";
  return body;
};

const msgFile = process.argv[2];
if (msgFile) {
  fs.writeFileSync(msgFile, stripMessage(fs.readFileSync(msgFile, "utf8")), "utf8");
} else {
  process.stdout.write(stripMessage(fs.readFileSync(0, "utf8")));
}
