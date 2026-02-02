const SHORTCUT_KEY = 'shortcutEnabled';
const FORM_KEYS = ['name', 'email', 'phone', 'address', 'company', 'date', 'checkbox', 'radio', 'select', 'textarea', 'number', 'password', 'url', 'nid', 'file'];
const STORAGE_KEY = 'formSettings';
const RULES_KEY = 'customRules';
const CUSTOM_FILES_KEY = 'customFiles';

function showToast(msg) {
  const el = document.getElementById('toast');
  const msgEl = document.getElementById('toastMessage');
  if (!el) return;
  if (msgEl) msgEl.textContent = msg || 'Saved';
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2200);
}

const PHONE_FORMAT_KEY = 'phoneFormat';

function load() {
  chrome.storage.sync.get([SHORTCUT_KEY, STORAGE_KEY, RULES_KEY, PHONE_FORMAT_KEY], (r) => {
    if (chrome.runtime?.lastError) return;
    const shortcutEl = document.getElementById('shortcutToggle');
    if (shortcutEl) {
      const on = r[SHORTCUT_KEY] !== false;
      shortcutEl.classList.toggle('on', on);
      shortcutEl.setAttribute('aria-checked', on);
    }
    const settings = r[STORAGE_KEY] || {};
    const phoneFormatEl = document.getElementById('phoneFormat');
    if (phoneFormatEl) phoneFormatEl.value = (r[PHONE_FORMAT_KEY] || settings.phoneFormat || 'local') === 'international' ? 'international' : 'local';
    FORM_KEYS.forEach(k => {
      const t = document.getElementById('t_' + k);
      if (t) {
        const on = settings[k] !== false;
        t.classList.toggle('on', on);
        t.setAttribute('aria-checked', on);
      }
    });
    updateFieldCount();
    const raw = r[RULES_KEY];
    const rules = Array.isArray(raw) ? raw.filter(rule => rule && String(rule.pattern || '').trim()) : [];
    rules.forEach(rule => {
      if (rule.regex === undefined) rule.regex = false;
    });
    renderRules(rules);
  });
}

function updateFieldCount() {
  const el = document.getElementById('fieldCount');
  if (!el) return;
  let on = 0;
  FORM_KEYS.forEach(k => {
    const t = document.getElementById('t_' + k);
    if (t && t.classList.contains('on')) on++;
  });
  el.textContent = `${on} / ${FORM_KEYS.length} on`;
}

function setField(k, on) {
  const t = document.getElementById('t_' + k);
  if (!t) return;
  t.classList.toggle('on', on);
  t.setAttribute('aria-checked', on);
  chrome.storage.sync.get(STORAGE_KEY, (r) => {
    if (chrome.runtime?.lastError) return;
    const s = (r[STORAGE_KEY] && typeof r[STORAGE_KEY] === 'object') ? { ...r[STORAGE_KEY] } : {};
    s[k] = on;
    chrome.storage.sync.set({ [STORAGE_KEY]: s }, () => {
      if (chrome.runtime?.lastError) showToast('Save failed');
      else { updateFieldCount(); showToast('Saved'); }
    });
  });
}
function setAllFields(on) {
  const s = {};
  FORM_KEYS.forEach(k => { s[k] = on; const t = document.getElementById('t_' + k); if (t) { t.classList.toggle('on', on); t.setAttribute('aria-checked', on); } });
  chrome.storage.sync.set({ [STORAGE_KEY]: s }, () => {
    if (chrome.runtime?.lastError) showToast('Save failed');
    else { updateFieldCount(); showToast(on ? 'All fields enabled' : 'All fields disabled'); }
  });
}

function renderRules(rules) {
  const list = document.getElementById('rulesList');
  if (!list) return;
  if (rules.length === 0) {
    list.innerHTML = `
      <div class="rules-empty">
        <div class="illus" aria-hidden="true">📝</div>
        <p>No custom rules yet</p>
        <p class="hint">Add patterns below. Complete values (like +8801878578504) fill EXACT value. Text (like "phone") fills random data.</p>
        <p class="hint" style="margin-top:10px;text-align:left"><strong>Fixed value</strong>: <code>+8801878578504</code> [fixed] → Phone = fills that exact number. <strong>Text</strong>: <code>nickname</code> → Name (any field containing "nickname").<br><strong>Regex</strong>: <code>my_.*field</code> → Email (pattern match).<br><strong>Skip</strong>: <code>internal_id</code> → Skip (don’t fill).</p>
      </div>`;
    return;
  }
  list.innerHTML = rules.map((rule, i) =>
    `<div class="rule-item" data-i="${i}">
      <span class="pattern">${escapeHtml(rule.pattern)}</span>
      <span class="fillType">${rule.regex ? '[regex]' : '[fixed]'} → ${escapeHtml(rule.fillType)}</span>
      <button type="button" class="btn btn-danger delRule" data-i="${i}" aria-label="Remove rule">Remove</button>
    </div>`
  ).join('');
  list.querySelectorAll('.delRule').forEach(btn => {
    btn.onclick = () => {
      const idx = +btn.dataset.i;
      chrome.storage.sync.get(RULES_KEY, (r) => {
        if (chrome.runtime?.lastError) return;
        const arr = (Array.isArray(r[RULES_KEY]) ? r[RULES_KEY] : []).filter((_, j) => j !== idx);
        chrome.storage.sync.set({ [RULES_KEY]: arr }, () => {
          if (chrome.runtime?.lastError) { showToast('Remove failed'); return; }
          load();
          showToast('Rule removed');
        });
      });
    };
  });
}

function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

// ——— Tabs ———
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const panelId = 'panel-' + tab.dataset.panel;
    document.querySelectorAll('.tab').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const panel = document.getElementById(panelId);
    if (panel) panel.classList.add('active');
  });
});

// ——— General: shortcut ———
const shortcutEl = document.getElementById('shortcutToggle');
const phoneFormatEl = document.getElementById('phoneFormat');
if (phoneFormatEl) phoneFormatEl.addEventListener('change', function () {
  const val = this.value === 'international' ? 'international' : 'local';
  chrome.storage.sync.set({ [PHONE_FORMAT_KEY]: val }, () => {
    if (chrome.runtime?.lastError) showToast('Save failed');
    else showToast('Saved');
  });
});

if (shortcutEl) {
  shortcutEl.addEventListener('click', function () {
    const on = !this.classList.toggle('on');
    this.setAttribute('aria-checked', on);
    chrome.storage.sync.set({ [SHORTCUT_KEY]: on }, () => {
      if (chrome.runtime?.lastError) showToast('Save failed');
      else showToast('Saved');
    });
  });
  shortcutEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); }
  });
}

// ——— Field chips: toggle + label click ———
FORM_KEYS.forEach(k => {
  const t = document.getElementById('t_' + k);
  const chip = t?.closest('.field-chip');
  if (!t) return;
  const toggle = () => {
    const on = !t.classList.toggle('on');
    t.setAttribute('aria-checked', on);
    chrome.storage.sync.get(STORAGE_KEY, (r) => {
      if (chrome.runtime?.lastError) return;
      const s = (r[STORAGE_KEY] && typeof r[STORAGE_KEY] === 'object') ? { ...r[STORAGE_KEY] } : {};
      s[k] = on;
      chrome.storage.sync.set({ [STORAGE_KEY]: s }, () => {
        if (chrome.runtime?.lastError) showToast('Save failed');
        else { updateFieldCount(); showToast('Saved'); }
      });
    });
  };
  t.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
  t.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  if (chip) chip.addEventListener('click', (e) => { if (e.target === chip || e.target.classList.contains('label')) toggle(); });
});

// ——— Enable all / Disable all ———
document.getElementById('enableAll')?.addEventListener('click', () => setAllFields(true));
document.getElementById('disableAll')?.addEventListener('click', () => setAllFields(false));

// ——— Custom rules: add ———
const addBtn = document.getElementById('addRule');
const patternInput = document.getElementById('rulePattern');
const ruleTypeSelect = document.getElementById('ruleType');
const ruleRegexCheckbox = document.getElementById('ruleRegex');
if (addBtn && patternInput && ruleTypeSelect) {
  addBtn.addEventListener('click', () => {
    const pattern = patternInput.value.trim();
    const fillType = ruleTypeSelect.value;
    const regex = !!ruleRegexCheckbox?.checked;
    if (!pattern) return;
    chrome.storage.sync.get(RULES_KEY, (r) => {
      if (chrome.runtime?.lastError) { showToast('Error loading rules'); return; }
      const arr = Array.isArray(r[RULES_KEY]) ? r[RULES_KEY].slice() : [];
      arr.push({ pattern, fillType, regex: !!regex });
      chrome.storage.sync.set({ [RULES_KEY]: arr }, () => {
        if (chrome.runtime?.lastError) { showToast('Save failed'); return; }
        patternInput.value = '';
        if (ruleRegexCheckbox) ruleRegexCheckbox.checked = false;
        load();
        showToast('Rule added');
      });
    });
  });
  patternInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addBtn.click(); });
}

// ——— Reset: modal ———
const modalOverlay = document.getElementById('modalOverlay');
const modalCancel = document.getElementById('modalCancel');
const modalConfirm = document.getElementById('modalConfirm');
const resetBtn = document.getElementById('resetBtn');

function openModal() {
  if (modalOverlay) {
    modalOverlay.classList.add('show');
    modalOverlay.setAttribute('aria-hidden', 'false');
    modalCancel?.focus();
  }
}
function closeModal() {
  if (modalOverlay) {
    modalOverlay.classList.remove('show');
    modalOverlay.setAttribute('aria-hidden', 'true');
    resetBtn?.focus();
  }
}

if (resetBtn) resetBtn.addEventListener('click', openModal);
modalCancel?.addEventListener('click', closeModal);
modalConfirm?.addEventListener('click', () => {
  chrome.storage.sync.set({
    [SHORTCUT_KEY]: true,
    [STORAGE_KEY]: {},
    [RULES_KEY]: [],
    [PHONE_FORMAT_KEY]: 'local'
  }, () => {
    closeModal();
    load();
    showToast('Reset to defaults');
  });
});
modalOverlay?.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
modalOverlay?.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// ——— Custom Files ———
function saveCustomFile(key, dataUrl, fileName) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) { showToast('Invalid file'); return; }
  chrome.storage.local.get([CUSTOM_FILES_KEY], (r) => {
    const prev = r[CUSTOM_FILES_KEY] && typeof r[CUSTOM_FILES_KEY] === 'object' ? r[CUSTOM_FILES_KEY] : {};
    const cf = { ...prev, [key]: dataUrl, [key + 'Name']: fileName };
    chrome.storage.local.set({ [CUSTOM_FILES_KEY]: cf }, () => {
      if (chrome.runtime?.lastError) showToast('Save failed');
      else { showToast('Saved'); updateCustomFilesStatus(cf); }
    });
  });
}

document.getElementById('customImage')?.addEventListener('change', function(e) {
  const file = e.target.files?.[0];
  if (!file || file.size > 2000000) { showToast(file ? 'File too large (max 2MB)' : 'No file'); return; }
  const reader = new FileReader();
  reader.onload = () => { saveCustomFile('image', reader.result, file.name); };
  reader.readAsDataURL(file);
});

document.getElementById('customPdf')?.addEventListener('change', function(e) {
  const file = e.target.files?.[0];
  if (!file || file.size > 2000000) { showToast(file ? 'File too large (max 2MB)' : 'No file'); return; }
  const reader = new FileReader();
  reader.onload = () => { saveCustomFile('pdf', reader.result, file.name); };
  reader.readAsDataURL(file);
});

document.getElementById('customDoc')?.addEventListener('change', function(e) {
  const file = e.target.files?.[0];
  if (!file || file.size > 2000000) { showToast(file ? 'File too large (max 2MB)' : 'No file'); return; }
  const reader = new FileReader();
  reader.onload = () => { saveCustomFile('doc', reader.result, file.name); };
  reader.readAsDataURL(file);
});

document.getElementById('clearCustomFiles')?.addEventListener('click', () => {
  chrome.storage.local.remove([CUSTOM_FILES_KEY], () => {
    if (chrome.runtime?.lastError) showToast('Clear failed');
    else {
      showToast('Custom files cleared');
      updateCustomFilesStatus(null);
      ['customImage', 'customPdf', 'customDoc'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
    }
  });
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', load);
} else {
  load();
}
window.addEventListener('pageshow', () => load());
