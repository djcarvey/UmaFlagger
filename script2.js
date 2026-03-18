// script.js

const highProfanity = ["pd a", "ubre", "k1ll", "rading", "arei", "pedo", "injun", "naga", "sixty nine", "69", "terf", "assi", "unti", "shota", "hate", "puto", "anal", "gringo", "buta", "anus", "gaiji", "chinc", "insin", "twat", "tata", "tard", "smut", "suck", "phuq", "ombo", "nabo", "muff", "kuso", "kick", "keto", "cbt", "gay", "gei", "jcb", "jew", "jot", "omg", "omu", "poa", "pud", "baka", "boob", "bomb", "damn", "debu", "dick", "cock", "gash", "isis", "jerk", "roa", "bum", "aho", "xx", "jj", "3p", "ifica", "sex", "tits", "inko", "cul", "impo", "etti"];
const lowProfanity = ["abo", "sag", "kill", "butt", "tit", "fuk", "shine", "ass", "sm", "ho", "hit"];

const input = document.getElementById("input");
const output = document.getElementById("output");

function findOffenses(text, highList, lowList) {
  const offenses = [];

  // Normalize text (alphanumeric only)
  let normalized = "";
  const indexMap = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (/[a-zA-Z0-9]/.test(ch)) {
      normalized += ch.toLowerCase();
      indexMap.push(i);
    }
  }

  function expandSpaces(start, end) {
    while (start > 0 && text[start - 1] === " ") start--;
    while (end < text.length - 1 && text[end + 1] === " ") end++;
    return [start, end];
  }

  // ---------- HIGH profanity ----------
  highList.forEach(word => {
    const normalizedWord = word.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    let idx = normalized.indexOf(normalizedWord);
    while (idx !== -1) {
      let start = indexMap[idx];
      let end = indexMap[idx + normalizedWord.length - 1];

      offenses.push(expandSpaces(start, end));
      idx = normalized.indexOf(normalizedWord, idx + 1);
    }
  });

  // ---------- LOW profanity ----------
  lowList.forEach(word => {
    const normalizedWord = word.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    let idx = normalized.indexOf(normalizedWord);
    while (idx !== -1) {
      let start = indexMap[idx];
      let end = indexMap[idx + normalizedWord.length - 1];

      const hasSpaceBefore = start > 0 && text[start - 1] === " ";
      const hasSpaceAfter = end < text.length - 1 && text[end + 1] === " ";

      if (hasSpaceBefore || hasSpaceAfter) {
        offenses.push(expandSpaces(start, end));
      }

      idx = normalized.indexOf(normalizedWord, idx + 1);
    }
  });

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
  const offenses = findOffenses(text, highProfanity, lowProfanity);
  output.innerHTML = highlight(text, offenses);
});
