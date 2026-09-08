#!/usr/bin/env node
/** Strip AI co-author trailers and neutralize commit messages for history rewrite. */
import fs from "node:fs";

const LINE_PATTERNS = [
  /cursoragent@cursor\.com/i,
  /Made-with:\s*Cursor/i,
  /Co-authored-by:\s*Cursor\b/i,
];

const SUBJECT_REPLACEMENTS = [
  [
    /^chore: stop tracking Cursor rules.*$/m,
    "chore: stop tracking local IDE rules in git",
  ],
  [
    /^chore: ignore local docs, scripts, postman, and cursor config$/m,
    "chore: ignore local docs, scripts, and postman",
  ],
  [
    /^Add git hook to strip Cursor commit attribution.*$/m,
    "Add git hook to strip co-author trailers on every commit",
  ],
  [/^On main: wip-before-cursor-attribution-rewrite$/m, "On main: wip before history rewrite"],
];

const stripMessage = (text) => {
  let msg = text
    .split(/\r?\n/)
    .filter((line) => !LINE_PATTERNS.some((pattern) => pattern.test(line)))
    .join("\n");

  for (const [pattern, replacement] of SUBJECT_REPLACEMENTS) {
    msg = msg.replace(pattern, replacement);
  }

  msg = msg.replace(/\n{3,}/g, "\n\n").trimEnd();
  if (msg.length) msg += "\n";
  return msg;
};

const msgFile = process.argv[2];
if (msgFile) {
  fs.writeFileSync(msgFile, stripMessage(fs.readFileSync(msgFile, "utf8")), "utf8");
} else {
  process.stdout.write(stripMessage(fs.readFileSync(0, "utf8")));
}
