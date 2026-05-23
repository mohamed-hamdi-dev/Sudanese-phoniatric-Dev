function initRichEditors(root = document) {
  const textareas = root.querySelectorAll('.evaluations-textarea.rich-editor-field');
  const selectionOnlyCommands = new Set(['strikeThrough', 'underline', 'italic', 'bold']);

  const toolbarHTML = `
    <div class="editor-toolbar">
      <button type="button" class="editor-btn" data-cmd="strikeThrough" title="Strikethrough" style="text-decoration:line-through; font-family:serif;">S</button>
      <button type="button" class="editor-btn" data-cmd="underline" title="Underline" style="text-decoration:underline; font-family:serif;">U</button>
      <button type="button" class="editor-btn" data-cmd="italic" title="Italic" style="font-style:italic; font-family:serif;"><em>I</em></button>
      <button type="button" class="editor-btn" data-cmd="bold" title="Bold" style="font-weight:bold; font-family:serif;">B</button>

      <div class="editor-divider"></div>

      <button type="button" class="editor-btn" data-cmd="insertOrderedList" title="Numbered list"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10 6h10M10 12h10M10 18h10M4 6h2v12M4 6l1-1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
      <button type="button" class="editor-btn" data-cmd="insertUnorderedList" title="Bulleted list"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>

      <div class="editor-divider"></div>

      <button type="button" class="editor-btn" data-cmd="foreColor" title="Text color"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 20h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 4L4 16h3l2-5h6l2 5h3L12 4z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M10 11h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
      <button type="button" class="editor-btn" data-cmd="hiliteColor" title="Highlight color"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 20h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 2"/><path d="M12 4L4 16h3l2-5h6l2 5h3L12 4z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M10 11h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>

      <div class="editor-divider"></div>

      <button type="button" class="editor-btn" data-cmd="insertImage" title="Image"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      <button type="button" class="editor-btn" data-cmd="createLink" title="Link"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>

      <div class="editor-divider"></div>

      <button type="button" class="editor-btn" data-cmd="justifyRight" title="Align right"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M10 12h10M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
      <button type="button" class="editor-btn" data-cmd="justifyCenter" title="Align center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M8 12h8M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
      <button type="button" class="editor-btn" data-cmd="justifyLeft" title="Align left"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h10M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
      <button type="button" class="editor-btn" data-cmd="justifyFull" title="Justify"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>

      <div class="editor-divider"></div>

      <select class="editor-select" data-cmd="formatBlock" title="Text style">
        <option value="p" selected>Normal</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
        <option value="h5">Heading 5</option>
        <option value="h6">Heading 6</option>
      </select>
    </div>
  `;

  textareas.forEach(textarea => {
    if (textarea.parentElement.classList.contains('rich-editor-wrap')) return;

    const wrap = document.createElement('div');
    wrap.className = 'rich-editor-wrap';
    textarea.parentNode.insertBefore(wrap, textarea);

    const editable = document.createElement('div');
    editable.className = 'editor-content';
    editable.contentEditable = 'true';
    editable.dir = 'rtl';
    editable.innerHTML = textarea.value || '';
    editable.setAttribute('data-placeholder', textarea.placeholder || 'Enter text here...');

    textarea.style.display = 'none';
    wrap.appendChild(textarea);
    wrap.insertAdjacentHTML('afterbegin', toolbarHTML);
    wrap.appendChild(editable);

    editable.addEventListener('input', () => {
      textarea.value = editable.innerHTML;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    });

    function getEditorSelection() {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return null;

      const range = selection.getRangeAt(0);
      if (!editable.contains(range.commonAncestorContainer)) return null;

      return selection;
    }

    wrap.querySelectorAll('.editor-btn[data-cmd]').forEach(btn => {
      btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
      });
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cmd = btn.dataset.cmd;
        const selection = getEditorSelection();

        if (selectionOnlyCommands.has(cmd) && (!selection || selection.isCollapsed)) {
          editable.focus();
          return;
        }

        if (cmd === 'createLink') {
          const url = prompt('Enter link URL:');
          if (url) document.execCommand(cmd, false, url);
        } else if (cmd === 'insertImage') {
          const url = prompt('Enter image URL:');
          if (url) document.execCommand(cmd, false, url);
        } else if (cmd === 'foreColor') {
          const color = prompt('Enter text color (example: red or #ff0000):');
          if (color) document.execCommand(cmd, false, color);
        } else if (cmd === 'hiliteColor') {
          const color = prompt('Enter highlight color (example: yellow or #ffff00):');
          if (color) document.execCommand(cmd, false, color);
        } else {
          document.execCommand(cmd, false, null);
        }

        editable.focus();
        textarea.value = editable.innerHTML;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      });
    });

    const styleSelect = wrap.querySelector('.editor-select[data-cmd="formatBlock"]');
    if (styleSelect) {
      styleSelect.addEventListener('change', () => {
        editable.focus();
        const blockTag = `<${styleSelect.value}>`;
        document.execCommand('formatBlock', false, blockTag);
        textarea.value = editable.innerHTML;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      });
    }
  });
}

window.initRichEditors = initRichEditors;
document.addEventListener('DOMContentLoaded', () => initRichEditors(document));
