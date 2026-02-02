(() => {
  if (window.__bengaliFakeFill) return;
  const storage = (typeof browser !== 'undefined' ? browser : chrome).storage;
  const firstNames = [
    "Rahim", "Karim", "Jamal", "Kamal", "Shamim", "Rafiq", "Nazmul", "Faruk", "Imran", "Sajid",
    "Ayesha", "Sharmin", "Shamima", "Farhana", "Nusrat", "Jannat", "Mahi", "Runa", "Salma", "Rashida"
  ];
  const lastNames = [
    "Uddin", "Ahmed", "Islam", "Hossain", "Rahman", "Chowdhury", "Miah", "Sarkar", "Talukder", "Biswas"
  ];
  const streets = [
    "Mirpur Road", "Dhanmondi 27", "Banani 11", "Gulshan 2", "Uttara Sector 4",
    "Chawk Bazar", "Agrabad", "Kumarpara", "Zindabazar", "New Market Road"
  ];
  const cities = ["Dhaka", "Chattogram", "Sylhet", "Khulna", "Rajshahi", "Barishal", "Rangpur", "Mymensingh"];
  const companies = [
    "Dhaka Soft Ltd", "Bangla Tech Solutions", "Padma Group", "Jamdani IT", "Sundarban Logistics"
  ];

  /* --- Helpers --- */
  function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

  function fakeDateISO() {
    const start = new Date(2000, 0, 1);
    const end = new Date(2018, 11, 31);
    const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function fakeBirthDateISO() {
    const start = new Date(1995, 0, 1);
    const end = new Date(2015, 11, 31);
    const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function fakeName() { return rand(firstNames) + " " + rand(lastNames); }
  function fakeAddress() { return randInt(10, 999) + " " + rand(streets) + ", " + rand(cities); }
  function fakeCity() { return rand(cities); }
  function fakePostcode() { return String(randInt(1200, 9999)); }
  function fakePhone() {
    const ops = ["13", "14", "15", "16", "17", "18", "19"];
    const op = rand(ops);
    let rest = "";
    for (let i = 0; i < 8; i++) rest += randInt(0, 9);
    return "+8801" + op + rest.substring(0, 8);
  }
  function fakePhoneLocal() {
    const ops = ["13", "14", "15", "16", "17", "18", "19"];
    const op = rand(ops);
    let rest = "";
    for (let i = 0; i < 8; i++) rest += randInt(0, 9);
    return "01" + op + rest.substring(0, 8);
  }
  function fakeEmailForContext(ctx) {
    const name = fakeName();
    const clean = name.toLowerCase().replace(/[^a-z]/g, ".");
    const base = (clean || "user") + randInt(10, 999);
    if (/gmail/i.test(ctx)) return base + "@gmail.com";
    if (/yahoo/i.test(ctx)) return base + "@yahoo.com";
    if (/outlook|hotmail|live|msn/i.test(ctx)) return base + "@outlook.com";
    if (/icloud|apple/i.test(ctx)) return base + "@icloud.com";
    if (/proton/i.test(ctx)) return base + "@protonmail.com";
    if (/company|work|office|corp/i.test(ctx)) return base + "@company.com";
    const domains = ["mail.com", "example.com", "bdmail.com", "demo.net"];
    return base + "@" + rand(domains);
  }
  function fakeDateFormatted(format) {
    const start = new Date(2000, 0, 1);
    const end = new Date(2018, 11, 31);
    const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), day = String(d.getDate()).padStart(2, "0");
    if (format === "dd/mm/yyyy") return day + "/" + m + "/" + y;
    if (format === "mm/dd/yyyy") return m + "/" + day + "/" + y;
    if (format === "dd-mm-yyyy") return day + "-" + m + "-" + y;
    if (format === "mm-dd-yyyy") return m + "-" + day + "-" + y;
    return y + "-" + m + "-" + day;
  }
  function fakeBirthDateFormatted(format) {
    const start = new Date(1995, 0, 1);
    const end = new Date(2015, 11, 31);
    const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), day = String(d.getDate()).padStart(2, "0");
    if (format === "dd/mm/yyyy") return day + "/" + m + "/" + y;
    if (format === "mm/dd/yyyy") return m + "/" + day + "/" + y;
    if (format === "dd-mm-yyyy") return day + "-" + m + "-" + y;
    if (format === "mm-dd-yyyy") return m + "-" + day + "-" + y;
    return y + "-" + m + "-" + day;
  }
  function getDateFormatFromContext(ctx) {
    if (/dd\/mm|d\/m|day\/month|\.dd\.mm|dmY/i.test(ctx)) return "dd/mm/yyyy";
    if (/mm\/dd|m\/d|month\/day|\.mm\.dd|mdY/i.test(ctx)) return "mm/dd/yyyy";
    if (/dd-mm|d-m-y|dd\.mm/i.test(ctx)) return "dd-mm-yyyy";
    if (/mm-dd|m-d-y/i.test(ctx)) return "mm-dd-yyyy";
    return "yyyy-mm-dd";
  }
  function fakeNumberForContext(ctx) {
    if (/age|year.*old|years?\s*old/i.test(ctx)) return String(randInt(18, 65));
    if (/qty|quantity|amount|count|num.*item/i.test(ctx)) return String(randInt(1, 99));
    if (/year|birth\s*year|graduation/i.test(ctx)) return String(randInt(1980, 2005));
    if (/percent|%|percentage/i.test(ctx)) return String(randInt(0, 100));
    if (/price|salary|amount|tk|taka|bdt/i.test(ctx)) return String(randInt(5000, 150000));
    if (/roll|student.*id|registration/i.test(ctx)) return String(randInt(100, 99999));
    return String(randInt(1, 999));
  }
  function fakeNidForContext(ctx) {
    const n = String(randInt(1000000000, 9999999999));
    if (/dash|hyphen|xxxx-xxxx-xxxx|nid\s*format/i.test(ctx)) return n.slice(0, 4) + "-" + n.slice(4, 8) + "-" + n.slice(8);
    return n;
  }
  function fakePasswordForContext(ctx) {
    if (/pin|simple|numeric|digit/i.test(ctx)) return String(randInt(1000, 9999));
    if (/strong|complex|secure/i.test(ctx)) return "Test@" + randInt(100, 999) + "Ab!";
    return "Test@12345";
  }
  function fakeUrlForContext(ctx) {
    if (/http\s*only|no\s*https/i.test(ctx)) return "http://example.com";
    if (/www\.|with\s*www/i.test(ctx)) return "https://www.example.com";
    return "https://example.com";
  }
  function fakeCompany() { return rand(companies); }
  function fakeSentence() {
    const parts = [
      "This is sample bangla style data for testing form.",
      "Customer from Dhaka city with typical address.",
      "Order created for demo purpose only.",
      "Please ignore this fake registration information.",
      "Sample description for Bengali user profile."
    ];
    return rand(parts);
  }

  function getValueByType(fillType, ctx, opts) {
    const rulePattern = (opts && opts.rulePattern) ? String(opts.rulePattern) : '';
    const fromCustomRule = !!(opts && opts.fromCustomRule);
    const isRegexRule = !!(opts && opts.isRegexRule);
    const pf = (opts && opts.phoneFormat) || 'local';
    switch (fillType) {
      case 'name': return /first|fname|given/i.test(ctx) ? rand(firstNames) : /last|lname|sur/i.test(ctx) ? rand(lastNames) : fakeName();
      case 'email':
        if (fromCustomRule && rulePattern && !isRegexRule && /@/.test(rulePattern)) {
          const match = rulePattern.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
          if (match) return rulePattern;
          const domain = rulePattern.split('@')[1];
          if (domain) {
            const name = fakeName().toLowerCase().replace(/[^a-z]/g, ".");
            return (name || "user") + randInt(10, 999) + "@" + domain;
          }
        }
        return fakeEmailForContext(ctx);
      case 'phone':
        if (fromCustomRule && rulePattern && !isRegexRule) {
          const clean = rulePattern.replace(/[-\s]/g, '');
          if (/^(\+88)?01\d{8,9}$/.test(clean)) return rulePattern;
          return /\+88/.test(rulePattern) ? fakePhone() : fakePhoneLocal();
        }
        return pf === 'international' ? fakePhone() : fakePhoneLocal();
      case 'address': return /city|town/i.test(ctx) ? fakeCity() : /zip|post|pin/i.test(ctx) ? fakePostcode() : fakeAddress();
      case 'company': return fakeCompany();
      case 'date':
        let df = getDateFormatFromContext(ctx);
        if (fromCustomRule && rulePattern && !isRegexRule && /^\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}$/.test(rulePattern)) return rulePattern;
        return /birth|dob/i.test(ctx) ? fakeBirthDateFormatted(df) : fakeDateFormatted(df);
      case 'number':
        if (fromCustomRule && rulePattern && !isRegexRule && /^\d{1,10}$/.test(rulePattern)) return rulePattern;
        return fakeNumberForContext(ctx);
      case 'password':
        if (fromCustomRule && rulePattern && !isRegexRule && rulePattern.length >= 4) return rulePattern;
        return fakePasswordForContext(ctx);
      case 'url':
        if (fromCustomRule && rulePattern && !isRegexRule && /^https?:\/\//.test(rulePattern)) return rulePattern;
        return fakeUrlForContext(ctx);
      case 'textarea':
        if (fromCustomRule && rulePattern && !isRegexRule && rulePattern.length > 10) return rulePattern;
        return fakeSentence();
      case 'nid':
        if (fromCustomRule && rulePattern && !isRegexRule) {
          const clean = rulePattern.replace(/[-\s]/g, '');
          if (/^\d{10,13}$/.test(clean)) return rulePattern;
        }
        return fakeNidForContext(ctx);
      default: return '';
    }
  }

  function getFieldContext(el) {
    const attrs = [
      el.name, el.id, el.placeholder, (el.className && typeof el.className === 'string' ? el.className : ''),
      el.getAttribute?.('data-field') || '', el.getAttribute?.('data-testid') || '', el.getAttribute?.('data-name') || '',
      el.getAttribute?.('data-label') || '', el.getAttribute?.('formcontrolname') || '', el.getAttribute?.('name') || '',
      el.getAttribute?.('ng-reflect-name') || ''
    ].filter(Boolean).join(' ').toLowerCase();
    let label = "";
    const root = el.getRootNode?.()?.host ? el.getRootNode() : document;
    if (el.id) {
      const lbl = root.querySelector?.(`label[for="${el.id}"]`);
      if (lbl) label = lbl.textContent.toLowerCase();
    }
    if (!label && el.previousElementSibling?.tagName === "LABEL") label = el.previousElementSibling.textContent.toLowerCase();
    if (!label) {
      const parent = el.closest("div, td, th, form, fieldset");
      const lbl = parent?.querySelector("label");
      if (lbl) label = lbl.textContent.toLowerCase();
    }
    const aria = (el.getAttribute?.("aria-label") || el.getAttribute?.("aria-labelledby") || el.getAttribute?.("aria-placeholder") || "").toLowerCase();
    return (attrs + " " + label + " " + aria).trim();
  }

  function setValueAndNotify(el, value) {
    try {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement?.prototype || HTMLInputElement.prototype, 'value')?.set;
      const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement?.prototype || HTMLTextAreaElement.prototype, 'value')?.set;
      const tag = (el.tagName || '').toLowerCase();
      if (tag === 'input' && nativeInputValueSetter) {
        nativeInputValueSetter.call(el, value);
      } else if (tag === 'textarea' && nativeTextareaValueSetter) {
        nativeTextareaValueSetter.call(el, value);
      } else {
        el.value = value;
      }
      el.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true, inputType: 'insertText', data: value }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.dispatchEvent(new Event('blur', { bubbles: true }));
    } catch (e) { el.value = value; el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true })); }
  }

  function guessAndFillInput(el, set, customRules, phoneFormat, customFiles) {
    if (phoneFormat === undefined) phoneFormat = 'local';
    if (el.disabled || el.type === "hidden") return;
    if (el.readOnly && !el.classList.contains("flatpickr-input")) return;
    customFiles = customFiles || {};
    const ctx = getFieldContext(el);
    if (!set) set = () => true;

    if (el.type === "checkbox") {
      if (!set("checkbox")) return;
      el.checked = Math.random() > 0.35;
      el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      return;
    }
    if (el.type === "radio") return;
    if (el.type === "file") {
      if (!set("file")) return;
      const isImage = /image|photo|picture|avatar|logo|pic/i.test(ctx);
      const isPdf = /pdf|document|resume|cv/i.test(ctx);
      const multiple = el.hasAttribute('multiple');
      const accept = (el.getAttribute('accept') || '').toLowerCase();
      const hasImage = accept.includes('image') || /\.(jpg|jpeg|png|gif|bmp|webp|svg)/i.test(accept) || isImage;
      const hasPdf = accept.includes('pdf') || /\.(pdf|doc|docx)/i.test(accept) || isPdf;
      const dataURLtoFile = (dataurl, filename) => {
        if (!dataurl) return null;
        try {
          const arr = dataurl.split(',');
          const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while(n--) u8arr[n] = bstr.charCodeAt(n);
          return new File([u8arr], filename, {type:mime});
        } catch(e) { return null; }
      };
      const setFilesAndNotify = (el, files) => {
        try {
          if (!files || files.length === 0) return;
          el.files = files;
          ['input', 'change', 'blur'].forEach(ev => el.dispatchEvent(new Event(ev, { bubbles: true })));
        } catch(e) {}
      };
      try {
        const dt = new DataTransfer();
        if (hasImage) {
          if (customFiles?.image) {
            const f = dataURLtoFile(customFiles.image, customFiles.imageName || 'custom-image.png');
            if (f) dt.items.add(f);
          } else {
            const TINY_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
            const f = dataURLtoFile(TINY_PNG, 'demo-image.png');
            if (f) dt.items.add(f);
          }
          if (hasPdf && !dt.files.length) {
            const pdfBlob = new Blob(['%PDF-1.4\n%Demo'], { type: 'application/pdf' });
            dt.items.add(new File([pdfBlob], 'demo-doc.pdf', { type: 'application/pdf' }));
          }
          if (multiple && dt.files.length === 1) {
            const f2 = dataURLtoFile('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'demo-image-2.png');
            if (f2) dt.items.add(f2);
          }
          setFilesAndNotify(el, dt.files);
        } else if (hasPdf) {
          if (customFiles?.pdf) {
            const f = dataURLtoFile(customFiles.pdf, customFiles.pdfName || 'custom-doc.pdf');
            if (f) dt.items.add(f);
          } else {
            dt.items.add(new File([new Blob(['%PDF-1.4\n%Demo PDF'], { type: 'application/pdf' })], 'demo-doc.pdf', { type: 'application/pdf' }));
          }
          setFilesAndNotify(el, dt.files);
        } else {
          dt.items.add(new File([new Blob(['Demo file content'], { type: 'text/plain' })], 'demo.txt', { type: 'text/plain' }));
          setFilesAndNotify(el, dt.files);
        }
      } catch(e) { console.error('File upload error:', e); }
      return;
    }

    let value = "";
    const rules = customRules || [];
    for (const rule of rules) {
      let match = false;
      const pat = (rule.pattern || '').replace(/[-\s]/g, '');
      const isPhoneNumber = /^(\+88)?01\d{8,9}$/.test(pat);
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rule.pattern || '');
      const isDate = /^\d{1,4}[-\/]\d{1,2}[-\/]\d{1,4}$/.test(rule.pattern || '');
      const isNID = /^\d{10,13}$/.test(pat);
      const isURL = /^https?:\/\//.test(rule.pattern || '');
      const isNumber = /^\d{1,10}$/.test(pat) && !isPhoneNumber && !isNID;
      if (isPhoneNumber && rule.fillType === 'phone') match = el.type === 'tel' || /phone|mobile|contact|cell|tel/i.test(ctx);
      else if (isEmail && rule.fillType === 'email') match = el.type === 'email' || /e?-?mail/i.test(ctx);
      else if (isDate && rule.fillType === 'date') match = el.type === 'date' || /date|birth|dob/i.test(ctx);
      else if (isNID && rule.fillType === 'nid') match = /national.*id|nid|passport/i.test(ctx);
      else if (isURL && rule.fillType === 'url') match = /url|website|link/i.test(ctx);
      else if (isNumber && rule.fillType === 'number') match = el.type === 'number' || /age|qty|quantity|amount|count|num/i.test(ctx);
      else if (rule.regex === true) { try { match = new RegExp(rule.pattern, 'i').test(ctx); } catch (e) {} }
      else match = ctx.toLowerCase().includes((rule.pattern || '').toLowerCase());
      if (match) {
        if (rule.fillType === 'skip') return;
        if (set(rule.fillType)) value = getValueByType(rule.fillType, ctx, { fromCustomRule: true, rulePattern: rule.pattern, isRegexRule: rule.regex, phoneFormat });
        break;
      }
    }

    if (!value) {
      if (el.type === "date") {
        if (!set("date")) return;
        value = /birth|dob|b\.?d/i.test(ctx) ? fakeBirthDateISO() : fakeDateISO();
      } else if (el.type === "datetime-local") { if (set("date")) value = new Date().toISOString().slice(0, 16); }
      else if (el.type === "time") { if (set("date")) value = "09:00"; }
      else if (el.type === "month") { if (set("date")) value = new Date().toISOString().slice(0, 7); }
      else if (el.type === "week") { if (set("date")) value = new Date().getFullYear() + "-W01"; }
      else if (/birth|dob|b\.?d/i.test(ctx) && /date/i.test(ctx)) { if (set("date")) value = fakeBirthDateFormatted(getDateFormatFromContext(ctx)); }
      else if (/date/i.test(ctx)) { if (set("date")) value = fakeDateFormatted(getDateFormatFromContext(ctx)); }
      else if (/roll|student.*num|registration.*num/i.test(ctx)) { if (set("number")) value = fakeNumberForContext(ctx); }
      else if (el.type === "email" || /e?-?mail/i.test(ctx)) { if (set("email")) value = fakeEmailForContext(ctx); }
      else if (el.type === "tel" || /phone|mobile|contact|cell|tel/i.test(ctx)) { if (set("phone")) value = phoneFormat === 'international' ? fakePhone() : fakePhoneLocal(); }
      else if (/first.*name|given.*name|fname/i.test(ctx)) { if (set("name")) value = rand(firstNames); }
      else if (/middle.*name|mname/i.test(ctx)) { if (set("name")) value = rand(firstNames); }
      else if (/last.*name|sur.*name|family.*name|lname/i.test(ctx)) { if (set("name")) value = rand(lastNames); }
      else if (/full.*name|complete.*name|student.*name|person.*name/i.test(ctx) || /^\s*name\s*$/i.test(ctx)) { if (set("name")) value = fakeName(); }
      else if (/user.*name|username|login/i.test(ctx)) { if (set("name")) value = fakeName().toLowerCase().replace(/\s+/g, ""); }
      else if (/father|parent|guardian/i.test(ctx) && /name/i.test(ctx)) { if (set("name")) value = fakeName(); }
      else if (/mother/i.test(ctx) && /name/i.test(ctx)) { if (set("name")) value = rand(firstNames) + " " + rand(lastNames); }
      else if (/company|organization|employer|institute|school/i.test(ctx)) { if (set("company")) value = fakeCompany(); }
      else if (/address|street|location|residence/i.test(ctx)) { if (set("address")) value = fakeAddress(); }
      else if (/city|town|municipality/i.test(ctx)) { if (set("address")) value = fakeCity(); }
      else if (/zip|post.*code|pin/i.test(ctx)) { if (set("address")) value = fakePostcode(); }
      else if (/country|nation(?!al)/i.test(ctx)) { if (set("address")) value = "Bangladesh"; }
      else if (/district|state|division|region/i.test(ctx)) { if (set("address")) value = "Dhaka"; }
      else if (/national.*id|nid|passport/i.test(ctx)) { if (set("nid")) value = fakeNidForContext(ctx); }
      else if (el.type === "number" || /age|year.*old|qty|quantity|amount|count/i.test(ctx)) { if (set("number")) value = fakeNumberForContext(ctx); }
      else if (/password|passwd|pwd/i.test(ctx) || el.type === "password") { if (set("password")) value = fakePasswordForContext(ctx); }
      else if (/desc|about|note|comment|remark|detail/i.test(ctx)) { if (set("textarea")) value = fakeSentence(); }
      else if (/url|website|link/i.test(ctx)) { if (set("url")) value = fakeUrlForContext(ctx); }
      else if (el.type === "text" || el.type === "search" || !el.type) { if (!el.value && set("name")) value = fakeName(); }
    }

    if (value) {
      try {
        const oldValue = el.value;
        setValueAndNotify(el, value);
        if (el.validity && !el.validity.valid) setValueAndNotify(el, oldValue);
      } catch (e) { }
    }
  }

  function fillRadiosByGroup() {
    const groups = {};
    document.querySelectorAll("input[type=radio]").forEach(r => {
      if (r.disabled) return;
      const name = r.name || ("__no_group__" + Math.random());
      (groups[name] ||= []).push(r);
    });
    Object.values(groups).forEach(list => {
      if (!list.length) return;
      const choice = rand(list);
      choice.checked = true;
      choice.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
      choice.dispatchEvent(new Event("input", { bubbles: true }));
      choice.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  const withTimeout = (promise, ms = 1500) => new Promise(resolve => {
    const t = setTimeout(() => resolve("timeout"), ms);
    promise.then(res => { clearTimeout(t); resolve(res); }).catch(() => { clearTimeout(t); resolve("error"); });
  });

  function smoothScrollTo(element) {
    if (!element) return;
    try { element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" }); } catch (e) { try { element.scrollIntoView(); } catch (e2) {} }
  }

  async function processSequentialVueSelect(input) {
    if (input.disabled || input.readOnly) return;
    const antSel = input.closest(".ant-select");
    if (antSel?.querySelector(".ant-select-selector")) {
      return new Promise(resolve => {
        antSel.querySelector(".ant-select-selector").click();
        const tryPick = (attempt = 0) => {
          if (attempt > 12) { resolve(); return; }
          const items = document.querySelectorAll(".ant-select-dropdown .ant-select-item:not(.ant-select-item-disabled)");
          const vis = Array.from(items).filter(o => o.getBoundingClientRect().height > 0);
          if (vis.length > 0) { rand(vis).click(); setTimeout(resolve, 80); return; }
          setTimeout(() => tryPick(attempt + 1), 120);
        };
        setTimeout(() => tryPick(0), 150);
      });
    }
    const reactSel = input.closest(".react-select");
    if (reactSel?.querySelector(".react-select__control")) {
      return new Promise(resolve => {
        reactSel.querySelector(".react-select__control").click();
        const tryPick = (attempt = 0) => {
          if (attempt > 12) { resolve(); return; }
          const opts = document.querySelectorAll(".react-select__menu .react-select__option:not([class*='disabled'])");
          const vis = Array.from(opts).filter(o => o.getBoundingClientRect().height > 0);
          if (vis.length > 0) { rand(vis).click(); setTimeout(resolve, 80); return; }
          setTimeout(() => tryPick(attempt + 1), 120);
        };
        setTimeout(() => tryPick(0), 150);
      });
    }
    let vselect = input.closest(".v-select, .vue-select, div[class*='select']");
    let toggle = vselect?.querySelector(".vs__dropdown-toggle") || input.closest(".vs__dropdown-toggle");
    if (!vselect && toggle) vselect = toggle.parentElement;
    if (!vselect) vselect = input.parentElement;
    if (vselect?.classList.contains("vs--disabled")) return;
    const triggers = [vselect?.querySelector(".vs__open-indicator, .vs__actions"), toggle, input].filter(Boolean);
    return new Promise(resolve => {
      let attempts = 0;
      const tryPick = () => {
        if (attempts > 12) { resolve(); return; }
        attempts++;
        for (const t of triggers) { t.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true, view: window })); t.click(); }
        setTimeout(() => {
          const listbox = document.getElementById(input.getAttribute("aria-controls") || (toggle?.getAttribute("aria-owns"))) || vselect?.querySelector("ul[role=listbox]") || Array.from(document.querySelectorAll("ul[role=listbox], .vs__dropdown-menu")).find(el => el.getBoundingClientRect().height > 5);
          if (listbox) {
            const options = Array.from(listbox.querySelectorAll("li, .vs__dropdown-option, [role=option]")).filter(o => o.textContent?.trim() && !o.classList.contains("disabled"));
            if (options.length > 0) { rand(options).click(); setTimeout(resolve, 50); return; }
          }
          setTimeout(tryPick, 150);
        }, 100);
      };
      tryPick();
    });
  }

  async function processCustomDropdown(wrapper) {
    if (wrapper.getAttribute("aria-disabled") === "true") return;
    const btn = wrapper.querySelector("button, [role=button], .dropdown-toggle, .ant-select-selector, .react-select__control");
    if (!btn || btn.disabled) return;
    return new Promise(resolve => {
      btn.click();
      const tryPick = (attempt = 0) => {
        if (attempt > 8) { resolve(); return; }
        const opts = Array.from(document.querySelectorAll('[role="option"], .dropdown-item, .ant-select-item, .react-select__option')).filter(o => o.getBoundingClientRect().height > 2 && !/select|choose|loading/i.test(o.textContent?.trim() || ''));
        if (opts.length > 0) { rand(opts).click(); setTimeout(resolve, 80); }
        else setTimeout(() => tryPick(attempt + 1), 150);
      };
      setTimeout(() => tryPick(0), 200);
    });
  }

  function collectFromRoot(root, list) {
    if (!root || list.seen.has(root)) return;
    list.seen.add(root);
    const q = (sel) => Array.from((root.querySelectorAll?.call(root, sel)) || []);
    q("input").forEach(el => {
      if (list.seenEl.has(el)) return;
      list.seenEl.add(el);
      if (el.type === 'file') { list.items.push({ type: 'input', el }); return; }
      if (el.classList.contains("flatpickr-input")) list.items.push({ type: 'input', el });
      else if (/vs__search|react-select|ant-select/i.test(el.className || '')) list.items.push({ type: 'vue-select', el });
      else list.items.push({ type: 'input', el });
    });
    q("textarea").forEach(el => { if (!list.seenEl.has(el)) { list.seenEl.add(el); list.items.push({ type: 'textarea', el }); } });
    q("select").forEach(el => { if (!list.seenEl.has(el)) { list.seenEl.add(el); list.items.push({ type: 'select', el }); } });
    q("[contenteditable=true]").forEach(el => { if (!list.seenEl.has(el)) { list.seenEl.add(el); list.items.push({ type: 'contenteditable', el }); } });
    q('[role="combobox"]').forEach(el => {
      if (list.seenEl.has(el)) return;
      list.seenEl.add(el);
      const hasInput = el.querySelector("input");
      if (hasInput && !list.seenEl.has(hasInput)) { list.seenEl.add(hasInput); list.items.push({ type: 'vue-select', el: hasInput }); }
      else { const btn = el.querySelector("button, [role=button]"); if (btn) list.items.push({ type: 'custom-dropdown', el: el }); }
    });
    q(".dropdown, .ant-select, .react-select__control, .react-select, .MuiSelect-select, mat-select").forEach(el => {
      if (list.seenEl.has(el)) return;
      const input = el.querySelector("input:not([type=hidden])");
      if (input && !list.seenEl.has(input)) { list.seenEl.add(input); list.items.push({ type: 'vue-select', el: input }); }
      else { const btn = el.querySelector("button, [role=button], .ant-select-selector, .react-select__control"); if (btn) { list.seenEl.add(el); list.items.push({ type: 'custom-dropdown', el: el }); } }
    });
    try { q("*").forEach(el => { if (el.shadowRoot) collectFromRoot(el.shadowRoot, list); }); } catch (err) {}
  }

  window.__bengaliFakeFill = async function () {
    const r = await new Promise(res => { storage.sync.get(["formSettings", "customRules", "phoneFormat"], data => res(data)); });
    const s = r.formSettings && typeof r.formSettings === 'object' ? r.formSettings : {};
    const phoneFormat = r.phoneFormat || s.phoneFormat || 'local';
    const set = (k) => s[k] !== false;
    const customRules = Array.isArray(r.customRules) ? r.customRules.filter(rule => rule && String(rule.pattern || '').trim() && rule.fillType).map(rule => ({ pattern: String(rule.pattern).trim(), fillType: rule.fillType, regex: rule.regex === true })) : [];

    const list = { items: [], seen: new Set(), seenEl: new Set() };
    collectFromRoot(document, list);
    const allElements = list.items;
    allElements.sort((a, b) => {
      const rectA = a.el.getBoundingClientRect(), rectB = b.el.getBoundingClientRect();
      const topDiff = (rectA.top + window.scrollY) - (rectB.top + window.scrollY);
      return Math.abs(topDiff) > 10 ? topDiff : rectA.left - rectB.left;
    });
    const uniqueElements = [];
    const seen = new Set();
    for (const item of allElements) {
      if (!seen.has(item.el)) { seen.add(item.el); uniqueElements.push(item); }
    }

    const customFilesData = await new Promise(res => {
      storage.local.get(["customFiles"], (data) => {
        const cf = data.customFiles;
        if (!cf || typeof cf !== 'object') { res({}); return; }
        const out = {};
        if (typeof cf.image === 'string' && cf.image.startsWith('data:')) { out.image = cf.image; out.imageName = cf.imageName; }
        if (typeof cf.pdf === 'string' && cf.pdf.startsWith('data:')) { out.pdf = cf.pdf; out.pdfName = cf.pdfName; }
        if (typeof cf.doc === 'string' && cf.doc.startsWith('data:')) { out.doc = cf.doc; out.docName = cf.docName; }
        res(out);
      });
    });

    for (const item of uniqueElements) {
      const { type, el } = item;
      if (el.offsetParent === null && type !== 'vue-select' && el.type !== 'file') continue;
      if ((el.disabled || el.readOnly) && !el.classList.contains("flatpickr-input") && type !== 'vue-select') continue;
      smoothScrollTo(el);
      const origShadow = el.style.boxShadow, origTrans = el.style.transition;
      el.style.transition = "box-shadow 0.2s ease";
      el.style.boxShadow = "0 0 8px 2px rgba(33, 150, 243, 0.5)";
      try {
        if (type === 'vue-select') { if (set("select")) await withTimeout(processSequentialVueSelect(el), 2000); }
        else if (type === 'custom-dropdown') { if (set("select")) await withTimeout(processCustomDropdown(el), 1200); }
        else if (type === 'input') {
          guessAndFillInput(el, set, customRules, phoneFormat, customFilesData);
          await new Promise(r => setTimeout(r, el.type === 'file' ? 150 : 60));
        } else if (type === 'textarea') { if (set("textarea")) setValueAndNotify(el, fakeSentence()); await new Promise(r => setTimeout(r, 60)); }
        else if (type === 'select') {
          const sel = el;
          if (set("select") && !sel.disabled) {
            const ctx = getFieldContext(sel).toLowerCase();
            const allOpts = Array.from(sel.options).filter(o => !o.disabled && o.value && !/select|choose/i.test(o.textContent));
            const opts = allOpts.length ? allOpts : Array.from(sel.options).slice(1);
            if (opts.length) {
              let choice = /bangladesh/i.test(ctx) ? (opts.filter(o => /bangladesh/i.test(o.textContent))[0] || rand(opts)) : /dhaka/i.test(ctx) ? (opts.filter(o => /dhaka/i.test(o.textContent))[0] || rand(opts)) : rand(opts);
              if (sel.multiple) { Array.from(sel.options).forEach(o => o.selected = false); choice.selected = true; }
              else { sel.value = choice.value; sel.selectedIndex = Array.from(sel.options).indexOf(choice); }
              sel.dispatchEvent(new Event("input", { bubbles: true })); sel.dispatchEvent(new Event("change", { bubbles: true }));
              if (window.jQuery) try { window.jQuery(sel).trigger('change'); } catch (e) {}
            }
          }
          await new Promise(r => setTimeout(r, 60));
        } else if (type === 'contenteditable') { if (set("textarea")) { el.textContent = fakeSentence(); el.dispatchEvent(new Event("input", { bubbles: true })); } }
      } catch (e) { console.error(e); }
      setTimeout(() => { el.style.boxShadow = origShadow; el.style.transition = origTrans; }, 300);
    }
    if (set("radio")) fillRadiosByGroup();
    if (window.jQuery?.fn?.select2) {
      try {
        window.jQuery("select.select2, .select2-hidden-accessible").each(function () {
          const $sel = window.jQuery(this);
          if ($sel.prop("disabled") || $sel.prop("readonly") || ($sel.val() && $sel.val() !== "" && $sel.val() !== "0")) return;
          const opts = $sel.find("option:not([disabled])").filter(function () { const txt = window.jQuery(this).text().trim(), val = window.jQuery(this).val(); return val && !/^(select|choose|pick|--|none|null)$/i.test(txt); });
          if (opts.length > 0) $sel.val(opts.eq(Math.floor(Math.random() * opts.length)).val()).trigger("change").trigger("change.select2");
        });
      } catch (e) {}
    }
  };

  let shortcutEnabled = true, lastVPress = 0;
  function updateShortcut(enabled) { shortcutEnabled = enabled !== false; }
  storage.sync.get('shortcutEnabled', (r) => updateShortcut(r.shortcutEnabled));
  storage.onChanged.addListener((changes, area) => { if (area === 'sync' && changes.shortcutEnabled) updateShortcut(changes.shortcutEnabled.newValue); });

  window.addEventListener("keydown", (e) => {
    if (!shortcutEnabled) return;
    if ((e.key === "v" || e.key === "V") && (e.ctrlKey || e.metaKey) && e.shiftKey) {
      const now = Date.now();
      if (now - lastVPress < 500) { e.preventDefault(); e.stopPropagation(); if (typeof window.__bengaliFakeFill === "function") window.__bengaliFakeFill(); lastVPress = 0; }
      else lastVPress = now;
    }
  });
})();
