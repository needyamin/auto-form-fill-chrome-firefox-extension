const KEY = 'shortcutEnabled';

chrome.storage.sync.get(KEY, (r) => {
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
  chrome.storage.sync.set({ [KEY]: on });
});

const settingsLink = document.getElementById('settingsLink');
if (settingsLink) settingsLink.addEventListener('click', (e) => {
  e.preventDefault();
  try { chrome.runtime.openOptionsPage(); } catch (err) {}
});

const fillBtn = document.getElementById('fillBtn');
if (fillBtn) fillBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;
  await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => { typeof window.__bengaliFakeFill === 'function' && window.__bengaliFakeFill(); }
  });
  window.close();
});
