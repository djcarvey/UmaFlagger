// script.js

const bannedWords = ["sag", "kill", "butt", "tit", "fuk", "shine", "ass", "sm", "ho"];
const exceptions = ["gringo", "buta", "anus", "gaiji", "chinc", "insin", "twat", "tata", "tard", "smut", "suck", "phuq", "ombo", "nabo", "muff", "kuso", "kick", "keto", "cbt", "gay", "gei", "jcb", "jew", "jot", "omg", "omu", "poa", "pud", "baka", "boob", "bomb", "damn", "debu", "dick", "cock", "gash", "isis", "jerk", "roa", "bum", "aho", "xx", "jj", "3p", "ifica", "sex", "tits", "inko", "cul", "impo", "etti"];

const input = document.getElementById("input");
const output = document.getElementById("output");

function findOffenses(text, banned, exceptions) {
  const offenses = [];

  // ---------- helpers ----------
  function expandRange(start, end) {
    while (start > 0 && text[start - 1] === " ") start--;
    while (end < text.length - 1 && text[end + 1] === " ") end++;
    return [start, end];
  }

  function hasRequiredSpace(start, end) {
    if (start > 0 && text[start - 1] === " ") return true;
    if (end < text.length - 1 && text[end + 1] === " ") return true;
    for (let i = start; i <= end; i++) {
      if (text[i] === " ") return true;
    }
    return false;
  }

  // ---------- build normalized stream ----------
  let buffer = "";
  let bufferMap = [];

  function flushBuffer() {
    if (!buffer) return;

    // banned words (space-sensitive)
    banned.forEach(word => {
      let idx = buffer.indexOf(word);
      while (idx !== -1) {
        let start = bufferMap[idx];
        let end = bufferMap[idx + word.length - 1];

        if (hasRequiredSpace(start, end)) {
          offenses.push(expandRange(start, end));
        }
        idx = buffer.indexOf(word, idx + 1);
      }
    });

    // exceptions (ALWAYS trigger)
    exceptions.forEach(word => {
      let idx = buffer.indexOf(word);
      while (idx !== -1) {
        let start = bufferMap[idx];
        let end = bufferMap[idx + word.length - 1];
        offenses.push(expandRange(start, end));
        idx = buffer.indexOf(word, idx + 1);
      }
    });

    buffer = "";
    bufferMap = [];
  }

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (/[a-zA-Z]/.test(ch)) {
      buffer += ch.toLowerCase();
      bufferMap.push(i);
    } else if (ch === " " || ch === "'" || ch === "_") {
      continue;
    } else {
      flushBuffer();
    }
  }

  flushBuffer();
  return offenses;
}

function highlight(text, ranges) {
  if (ranges.length === 0) return escapeHTML(text);

  ranges.sort((a, b) => a[0] - b[0]);

  let result = "";
  let lastIndex = 0;

  for (const [start, end] of ranges) {
    result += escapeHTML(text.slice(lastIndex, start));
    result += `<mark>${escapeHTML(text.slice(start, end + 1))}</mark>`;
    lastIndex = end + 1;
  }

  result += escapeHTML(text.slice(lastIndex));
  return result;
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));
}

input.addEventListener("input", () => {
  const text = input.value;
  const offenses = findOffenses(text, bannedWords, exceptions);
  output.innerHTML = highlight(text, offenses);
});
