// rjtalbot.com only: lets the story editor and art pages run without tools/editor.js.
// Reads come from the JSON snapshot in ../api/ (made from the game's story files when this copy
// was built). Saves, notes and art notes are kept in this browser's localStorage, not on a server.
'use strict';
(() => {
  const BASE = new URL('../', location.href);
  const KEY = 'pawnchamp-editor:';
  const realFetch = window.fetch.bind(window);
  const reply = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
  const load = k => { try { const v = localStorage.getItem(KEY + k); return v ? JSON.parse(v) : null; } catch (e) { return null; } };
  const keep = (k, v) => { try { localStorage.setItem(KEY + k, JSON.stringify(v)); return true; } catch (e) { return false; } };
  const snapshot = async p => { const r = await realFetch(new URL(p, BASE)); if (!r.ok) throw new Error('Not found'); return r.json(); };

  window.fetch = async (url, opts = {}) => {
    const u = String(url);
    if (!u.startsWith('/')) return realFetch(url, opts);
    const p = u.slice(1);
    if (!p.startsWith('api/')) return realFetch(new URL(p, BASE), opts);
    const method = (opts.method || 'GET').toUpperCase();
    const body = opts.body ? JSON.parse(opts.body) : undefined;
    try {
      if (p === 'api/stories') {
        if (method === 'POST') return reply(400, { error: 'New stories can only be made in the editor on your own computer.' });
        return reply(200, await snapshot('api/stories.json'));
      }
      if (p === 'api/places') return reply(200, await snapshot('api/places.json'));
      let m = p.match(/^api\/stories\/(\w+)$/);
      if (m) {
        const id = m[1];
        const current = async () => load('story:' + id) || snapshot(`api/stories/${id}.json`);
        if (method === 'GET') return reply(200, await current());
        if (method === 'PUT') {
          const cur = await current();
          const text = formatStoryFile(parseStoryFile(cur.text).header, body.data);
          if (!keep('story:' + id, { ...parseStoryFile(text), text })) return reply(400, { error: 'This browser would not keep the change (storage is full or turned off).' });
          return reply(200, { text });
        }
      }
      m = p.match(/^api\/notes\/(\w+)$/);
      if (m) {
        if (method === 'GET') return reply(200, load('notes:' + m[1]) || []);
        keep('notes:' + m[1], body); return reply(200, { ok: true });
      }
      if (p === 'api/art-notes') {
        if (method === 'GET') return reply(200, load('art-notes') || []);
        keep('art-notes', body); return reply(200, { ok: true });
      }
      return reply(404, { error: 'No such thing' });
    } catch (e) {
      return reply(404, { error: e.message });
    }
  };

  // a note in the top bar so nobody expects a save to reach the game
  document.addEventListener('DOMContentLoaded', () => {
    const bar = document.querySelector('.top .brand');
    if (!bar) return;
    const note = document.createElement('span');
    note.className = 'muted';
    note.style.cssText = 'font-weight:normal;font-size:12px;margin-left:10px';
    note.textContent = 'Online copy: saves and notes stay in this browser. ';
    const reset = document.createElement('a');
    reset.href = '#';
    reset.textContent = 'Reset';
    reset.title = 'Forget every change and note made in this browser';
    reset.onclick = e => {
      e.preventDefault();
      if (!confirm('Forget every story change and note made in this browser?')) return;
      Object.keys(localStorage).filter(k => k.startsWith(KEY)).forEach(k => localStorage.removeItem(k));
      location.reload();
    };
    note.append(reset);
    bar.append(note);
  });
})();
