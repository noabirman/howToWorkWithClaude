(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); };

  /* theme */
  $('#theme').addEventListener('click', function () {
    var root = document.documentElement;
    var dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    var next = dark ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* tabs */
  $$('[data-tabs]').forEach(function (list) {
    var group = list.dataset.tabs;
    var tabs = $$('.tab', list);
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        tabs.forEach(function (x) { x.setAttribute('aria-selected', x === t); });
        $$('.panel[data-group="' + group + '"]').forEach(function (p) { p.hidden = p.dataset.id !== t.dataset.p; });
      });
    });
  });

  /* copy buttons */
  $$('.copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = $('pre', b.parentNode).innerText;
      var done = function () { b.textContent = 'Copied ✓'; b.classList.add('ok'); setTimeout(function () { b.textContent = 'Copy'; b.classList.remove('ok'); }, 1500); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
    });
  });

  /* data */
  var shortcuts = [
    ['Control', ['Esc'], 'Stop Claude', 'Interrupts mid-turn and keeps the work done so far. On a permission prompt, declines.'],
    ['Control', ['Esc', 'Esc'], 'Rewind / clear input', 'Empty prompt: opens the rewind menu. With text: clears it (Up restores).'],
    ['Control', ['Shift', 'Tab'], 'Cycle permission mode', 'Manual → Edit automatically → Plan → Auto.'],
    ['Control', ['Ctrl', 'C'], 'Cancel / clear / exit', 'Interrupts a running task. Idle: first press clears the prompt, second exits.'],
    ['Control', ['Ctrl', 'D'], 'Exit session', 'Press twice quickly to exit.'],
    ['Control', ['Alt/⌥', 'P'], 'Switch model', 'Changes model without clearing your prompt.'],
    ['Control', ['Alt/⌥', 'O'], 'Toggle fast mode', 'Faster output on the same model.'],
    ['Control', ['Ctrl', 'B'], 'Run in background', 'Send a running command or agent to the background.'],
    ['View', ['Ctrl', 'O'], 'Transcript viewer', 'See detailed tool usage. Press q or Esc to leave.'],
    ['View', ['Ctrl', 'T'], 'Task checklist', 'Show or hide Claude\'s to-do list.'],
    ['View', ['Ctrl', 'L'], 'Redraw screen', 'Fixes a glitchy display. Keeps input and history.'],
    ['Input', ['Ctrl', 'R'], 'Search history', 'Reverse-search past prompts. Enter runs, Tab edits.'],
    ['Input', ['↑'], 'Previous prompt', 'Walk back through your prompt history.'],
    ['Input', ['Ctrl', 'G'], 'Edit in your editor', 'Opens the prompt (or the plan) in your text editor.'],
    ['Input', ['Ctrl', 'S'], 'Stash prompt', 'Save the draft, press again on empty prompt to restore.'],
    ['Input', ['Ctrl', 'V'], 'Paste image', 'Paste a screenshot (Windows/WSL: Alt+V; iTerm2: Cmd+V).'],
    ['Input', ['Tab'], 'Accept suggestion', 'Accept autocomplete or a suggested next prompt.'],
    ['Multiline', ['\\', 'Enter'], 'New line (works everywhere)', 'Type a backslash, then Enter.'],
    ['Multiline', ['Ctrl', 'J'], 'New line', 'Works in any terminal with no setup.'],
    ['Multiline', ['Shift', 'Enter'], 'New line', 'Native in iTerm2, Ghostty, Kitty, WezTerm, Warp, Apple Terminal. In VS Code/Cursor run /terminal-setup.'],
    ['Editing', ['Ctrl', 'A'], 'Start of line', 'Jump cursor to the beginning.'],
    ['Editing', ['Ctrl', 'E'], 'End of line', 'Jump cursor to the end.'],
    ['Editing', ['Ctrl', 'K'], 'Delete to end of line', 'Deleted text can be pasted back with Ctrl+Y.'],
    ['Editing', ['Ctrl', 'U'], 'Delete to start of line', 'Clear what you typed before the cursor.'],
    ['Editing', ['Ctrl', 'W'], 'Delete previous word', 'Treats a path or flag as one unit.'],
    ['Editing', ['Ctrl', 'Y'], 'Paste deleted text', 'Brings back what Ctrl+K/U/W removed.'],
    ['Editing', ['Alt/⌥', 'B / F'], 'Word back / forward', 'Needs Option-as-Meta on macOS.'],
    ['Editing', ['Ctrl', '_'], 'Undo input edit', 'Undo your last typing change (Ctrl+Shift+-).'],
    ['Prefix', ['/'], 'Commands & skills', 'Opens the slash menu.'],
    ['Prefix', ['!'], 'Shell mode', 'Run a shell command directly: ! npm test'],
    ['Prefix', ['@'], 'Mention a file', 'Autocompletes paths: @src/app.js'],
    ['Prefix', ['?'], 'Shortcut help', 'On an empty prompt, shows the shortcut panel.']
  ];
  var cmds = [
    ['Start here', [
      ['/help', 'Show help and available commands', 1],
      ['/init', 'Generate a starter CLAUDE.md for this project', 1],
      ['/clear', 'New conversation with empty context (aliases /reset, /new)', 1],
      ['/compact [focus]', 'Summarize the conversation to free up context', 1],
      ['/context', 'Visual grid of what fills your context window', 1],
      ['/model [name]', 'Switch model. No argument opens the picker', 1],
      ['/exit', 'Leave Claude (alias /quit)']
    ]],
    ['Undo & review', [
      ['/rewind', 'Roll back conversation and/or code to a checkpoint (/undo, /checkpoint)', 1],
      ['/diff', 'Review uncommitted changes and this session\'s edits', 1],
      ['/code-review', 'Correctness review of your diff (alias /review)'],
      ['/security-review', 'Security review of changes on the current branch']
    ]],
    ['Sessions', [
      ['/resume [name]', 'Resume a past session, or open the picker (alias /continue)'],
      ['/rename', 'Name the current session'],
      ['/branch [name]', 'Branch the conversation to try another direction'],
      ['/fork [prompt]', 'Copy the conversation into a new background session'],
      ['/export [file]', 'Export the conversation as plain text'],
      ['/copy [N]', 'Copy the last response to your clipboard'],
      ['/recap', 'One-line summary of the session'],
      ['/btw <question>', 'Side question that does not enter the history']
    ]],
    ['Control & safety', [
      ['/plan [task]', 'Enter plan mode, optionally with a task', 1],
      ['/permissions', 'Manage allow / ask / deny rules (alias /allowed-tools)'],
      ['/add-dir <path>', 'Let Claude access another directory this session'],
      ['/sandbox', 'Toggle sandbox mode where supported'],
      ['/effort', 'Set how hard Claude thinks (low → max, auto)'],
      ['/fast', 'Toggle fast mode']
    ]],
    ['Memory & extending', [
      ['/memory', 'Edit CLAUDE.md files, toggle auto memory'],
      ['/skills', 'List available skills'],
      ['/agents', 'Reminder how to create and manage subagents'],
      ['/mcp', 'Manage MCP servers and sign-ins'],
      ['/hooks', 'View configured hooks'],
      ['/plugin', 'Install and manage plugins']
    ]],
    ['Setup & info', [
      ['/config', 'Open settings: theme, model, editor mode… (alias /settings)'],
      ['/status', 'Version, model, account, connectivity'],
      ['/usage', 'Session cost, plan limits, stats (alias /cost)'],
      ['/doctor', 'Checkup that diagnoses install and settings problems'],
      ['/terminal-setup', 'Enable Shift+Enter in VS Code, Cursor, etc.'],
      ['/theme', 'Change color theme'],
      ['/login', 'Sign in or switch account (and /logout)'],
      ['/ide', 'Manage IDE integrations']
    ]],
    ['Background work', [
      ['/tasks', 'View background shells and subagents (alias /bashes)'],
      ['/background', 'Detach this session to run in the background (/bg)'],
      ['/loop', 'Repeat a prompt on an interval'],
      ['/schedule', 'Create cloud routines that run on a schedule']
    ]]
  ];

  /* shortcuts render */
  var cats = ['All'].concat(shortcuts.map(function (s) { return s[0]; }).filter(function (v, i, a) { return a.indexOf(v) === i; }));
  var cat = 'All';
  var chips = $('#scChips'), grid = $('#scGrid'), q = $('#scSearch');
  chips.innerHTML = cats.map(function (c) { return '<button class="chip' + (c === 'All' ? ' on' : '') + '">' + c + '</button>'; }).join('');
  function renderSc() {
    var term = q.value.trim().toLowerCase(), n = 0;
    grid.innerHTML = shortcuts.filter(function (s) {
      return (cat === 'All' || s[0] === cat) && (!term || (s[1].join(' ') + ' ' + s[2] + ' ' + s[3]).toLowerCase().indexOf(term) > -1);
    }).map(function (s) {
      n++;
      return '<div class="sc"><div class="keys">' + s[1].map(function (k) { return '<kbd>' + esc(k) + '</kbd>'; }).join('') + '</div><p><b>' + esc(s[2]) + '</b>' + esc(s[3]) + '</p></div>';
    }).join('');
    $('#scEmpty').style.display = n ? 'none' : 'block';
  }
  chips.addEventListener('click', function (e) {
    if (e.target.tagName !== 'BUTTON') return;
    cat = e.target.textContent;
    $$('.chip', chips).forEach(function (c) { c.classList.toggle('on', c === e.target); });
    renderSc();
  });
  q.addEventListener('input', renderSc);
  renderSc();

  /* commands render */
  var tb = $('#cmdTable tbody'), cq = $('#cmdSearch');
  function renderCmd() {
    var term = cq.value.trim().toLowerCase(), n = 0, html = '';
    cmds.forEach(function (g) {
      var rows = g[1].filter(function (c) { return !term || (c[0] + ' ' + c[1]).toLowerCase().indexOf(term) > -1; });
      if (!rows.length) return;
      html += '<tr class="grp"><td colspan="2">' + g[0] + '</td></tr>';
      rows.forEach(function (c) { n++; html += '<tr><td><code>' + esc(c[0]) + '</code>' + (c[2] ? ' ★' : '') + '</td><td>' + esc(c[1]) + '</td></tr>'; });
    });
    tb.innerHTML = html;
    $('#cmdEmpty').style.display = n ? 'none' : 'block';
    $('#cmdTable').style.display = n ? '' : 'none';
  }
  cq.addEventListener('input', renderCmd);
  renderCmd();

  /* terminal demo */
  var demo = $('#demo');
  var script = [
    ['<span class="p">$</span> claude\n', 500],
    ['<span class="d">Manual mode · /help for commands</span>\n\n', 400],
    ['<span class="p">&gt;</span> the signup form crashes on empty email. fix it and run the tests\n\n', 900],
    ['<span class="b">● Read</span> src/signup.js\n', 600],
    ['<span class="b">● Grep</span> "validateEmail"\n', 500],
    ['<span class="b">● Edit</span> src/signup.js <span class="d">(asks permission)</span>\n', 700],
    ['  <span class="g">+ if (!email) return false;</span>\n', 500],
    ['<span class="b">● Bash</span> npm test\n', 700],
    ['  <span class="g">✓ 12 passed</span>\n\n', 500],
    ['Fixed: empty emails are now rejected, and a new test covers it.', 0]
  ];
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function play() {
    demo.innerHTML = ''; var i = 0, out = '';
    (function next() {
      if (i >= script.length) { setTimeout(play, 4500); return; }
      out += script[i][0];
      demo.innerHTML = out + '<span class="cursor"></span>';
      setTimeout(next, script[i++][1]);
    })();
  }
  if (reduce) { demo.innerHTML = script.map(function (s) { return s[0]; }).join(''); } else { play(); }

  /* context meter */
  var r = $('#mRange');
  function meter() {
    var v = +r.value, sys = 8, files = Math.min(v * 0.35, 35), chat = v * 0.55;
    var total = sys + files + chat;
    if (total > 100) { var k = 100 / total; sys *= k; files *= k; chat *= k; total = 100; }
    $('#mSys').style.width = sys + '%'; $('#mFiles').style.width = files + '%'; $('#mChat').style.width = chat + '%';
    var m = $('#mMsg');
    if (total < 50) m.textContent = '😀 Plenty of room. Claude is sharp.';
    else if (total < 80) m.textContent = '🙂 Getting full. Consider /compact or finishing this task.';
    else m.textContent = '😬 Near the limit. Auto-compaction kicks in and details may be lost. Use /clear for the next task.';
  }
  r.addEventListener('input', meter); meter();

  /* scroll: progress, nav highlight, to-top, reveal */
  var prog = $('#progress'), top = $('#toTop');
  var secs = $$('section[id]'), navLinks = $$('#links a');
  function onScroll() {
    var h = document.documentElement, p = h.scrollTop / (h.scrollHeight - h.clientHeight);
    prog.style.width = (p * 100) + '%';
    top.classList.toggle('show', h.scrollTop > 700);
    var cur = '';
    secs.forEach(function (s) { if (s.getBoundingClientRect().top < 140) cur = s.id; });
    navLinks.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + cur); });
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  top.addEventListener('click', function () { scrollTo({ top: 0 }); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .08 });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else { $$('.reveal').forEach(function (el) { el.classList.add('in'); }); }

  /* "/" focuses search when not typing */
  addEventListener('keydown', function (e) {
    if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); $('#cmdSearch').scrollIntoView({ block: 'center' }); $('#cmdSearch').focus(); }
  });
})();
