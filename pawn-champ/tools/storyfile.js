// Reads and writes the story data files in js/stories/ (docs/STORY_DATA.md). Each file is a short
// comment header, then defineStory( <strict JSON> ); so the game can load it with a <script> tag
// (which works from file:// and in the desktop build) and a tool can read it with JSON.parse.
// Writing always produces the same layout, so a file that was read and written back unchanged
// doesn't change, and an editor's save shows up in git as just the lines it touched.
// No dependencies: the story editor can use the same code.
'use strict';

const STORY_WIDTH = 110; // a value that fits in this many columns stays on one line

function parseStoryFile(text) {
  const m = /^defineStory\(/m.exec(text); // the call starts a line; the header may mention it
  const at = m ? m.index : -1;
  const end = text.lastIndexOf(');');
  if (at < 0 || end < at) throw new Error('not a story file: no defineStory( ... );');
  return { header: text.slice(0, at), data: JSON.parse(text.slice(at + 'defineStory('.length, end)) };
}

function oneLine(v) {
  if (Array.isArray(v)) return v.length ? `[${v.map(oneLine).join(', ')}]` : '[]';
  if (v && typeof v === 'object') {
    const ks = Object.keys(v);
    return ks.length ? `{ ${ks.map(k => `${JSON.stringify(k)}: ${oneLine(v[k])}`).join(', ')} }` : '{}';
  }
  return JSON.stringify(v);
}
// Arrays and nested objects open up one entry per line when they don't fit.
// `lead` is what comes before the value on its first line (indent and key), for the width test
function layout(v, indent, lead) {
  const flat = oneLine(v);
  if (!v || typeof v !== 'object' || lead + flat.length <= STORY_WIDTH) return flat;
  // an object with nothing nested (a line of dialogue, a look) stays on one line however long
  if (!Array.isArray(v) && Object.values(v).every(x => !x || typeof x !== 'object')) return flat;
  const pad = ' '.repeat(indent + 2);
  if (Array.isArray(v)) return `[\n${v.map(x => pad + layout(x, indent + 2, indent + 2)).join(',\n')}\n${' '.repeat(indent)}]`;
  const ks = Object.keys(v);
  return `{\n${ks.map(k => { const key = `${JSON.stringify(k)}: `; return pad + key + layout(v[k], indent + 2, indent + 2 + key.length); }).join(',\n')}\n${' '.repeat(indent)}}`;
}

function formatStoryFile(header, data) {
  return `${header}defineStory(${layout(data, 0, 'defineStory('.length)});\n`;
}

if (typeof module !== 'undefined') module.exports = { parseStoryFile, formatStoryFile, STORY_WIDTH };
