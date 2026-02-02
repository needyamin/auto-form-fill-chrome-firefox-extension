const KEY = 'shortcutEnabled';
const b = typeof browser !== 'undefined' ? browser : chrome;

b.storage.sync.get(KEY, (r) => {
  const el = document.getElementById('shortcutToggle');
  if (el) {
    const on = r[KEY] !== false;
    el.classList.toggle('on', on);
    el.setAttribute('aria-checked', on);
  }
});

const shortcutToggle = document.getElementById('shortcutToggle');
if (shortcutToggle) shortcutToggle.addEventListener('click', function () {
  const on = !this.classList.toggle('on');
  this.setAttribute('aria-checked', on);
  b.storage.sync.set({ [KEY]: on });
});

const settingsLink = document.getElementById('settingsLink');
if (settingsLink) settingsLink.addEventListener('click', (e) => {
  e.preventDefault();
  try { b.runtime.openOptionsPage(); } catch (err) {}
});

const fillBtn = document.getElementById('fillBtn');
if (fillBtn) fillBtn.addEventListener('click', async () => {
  const [tab] = await b.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;
  await b.tabs.executeScript(tab.id, { file: 'content.js' });
  await b.tabs.executeScript(tab.id, { code: 'typeof window.__bengaliFakeFill === "function" && window.__bengaliFakeFill();' });
  window.close();
});
