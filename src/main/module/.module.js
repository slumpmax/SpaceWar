function build_query(obj, prefix) {
  let query = '', v;
  if (['object', 'array'].indexOf(typeof(obj)) >= 0) {
    for (let k in obj) {
      let sk = prefix ? `${prefix}[${k}]` : k;
      if (['object', 'array'].indexOf(typeof(obj[k])) >= 0) {
        sk = build_query(obj[k], sk);
      } else {
        v = obj[k];
        switch (typeof v) {
          case 'boolean': v = v ? 1 : 0;
        }
        sk = `${encodeURIComponent(sk)}=${encodeURIComponent(v)}`;
      }
      if (sk) {
        if (query) query += '&';
        query += sk;
      }
    }
  } else query = obj;
  return query;
}

function build_url(url, query) {
  query = build_query(query);
  return url + (query ? (url.indexOf('?') >= 0 ? '&' : '?') + query : '');
}

function time_token() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function replace_location(url) {
  parent.history.replaceState({}, "", url);
  parent.location.reload();
}

function get_embed_dlgs() {
  if (!window.embed_dlgs) {
    if (!(window.embed_dlgs = parent?.embed_dlgs)) {
      window.embed_dlgs = [];
    }
  }
  return window.embed_dlgs;
}

function set_embed_dlgs(token, value) {
  get_embed_dlgs()[token] = value;
}

function embed_dialog(container, args) {
  return new Promise((resolve, reject)=>{
    if (args.event) args.event.stopPropagation();
    if (args.name == undefined) args.name = '';
    if (args.url == undefined) args.url = '';
    if (args.visible == undefined) args.visible = true;
    if (args.clear == undefined) args.clear = false;
    if (args.style == undefined) args.style = '';
    args.classname = args.classname ? ` ${args.classname}` : '';
    args.query = build_query(args.query == undefined ? '' : args.query);
    let uname = args.name ? '_' + args.name.replace(/\.|\//g, m=>m == '.' ? '_' : '__') : '';
    let cname = args.name ? ' ' + args.name.replace(/\.|\//g, m=>m == '.' ? '_' : '__') : '';
    let down_target = null;
    let frame = document.createElement('iframe');
    const token = time_token();
    frame.id = 'editdoc' + uname;
    frame.className = 'editdoc' + cname;
    container.appendChild(frame);
    args.query = 'embed_token=' + token + (args.query ? '&' : '') + args.query;
    if (args.query) args.url = build_url(args.url, args.query);
    set_embed_dlgs(token, {
      container: container,
      frame: frame,
      resolve: resolve,
      reject: reject,
    });
    request_html({
      url: args.url,
      data: args.data,
    }).then((rsp)=>{
      if (rsp.status == 200) {
        frame.srcdoc = rsp.content;
      }
    });
  });
}

function close_embed(token) {
  const pembeds = get_embed_dlgs();
  const pembed = pembeds[token];
  if (pembed) {
    pembed.container.removeChild(pembed.frame);
    delete(pembeds[token]);
  }
}

function return_embed(value) {
  if (value !== undefined && typeof(value) != 'object') {
    try {
      value = JSON.parse(value);
    } catch(err) {
      console.log(value, err);
    }
  }
  const pembed = get_embed_dlgs()[value?.token];
  const resolve = pembed?.resolve;
  if (resolve) resolve(value);
}

function text_dialog(text, options) {
  options = options == undefined ? {} : options;
  return open_dialog({
    url: '/main/dialog/text',
    data: {
      title: text?.title || '',
      text: typeof text == 'string' ? text : text?.text || '',
      style: text?.style || 'border-color: #C0C0C0',
    },
    embed: true,
    width: options.width || false,
    height: options.height || false,
  });
}

function open_dialog(args) {
  let pm = new Promise((resolve, reject)=>{
    if (args.event) args.event.stopPropagation();
    if (args.name == undefined) args.name = '';
    if (args.url == undefined) args.url = '';
    if (args.visible == undefined) args.visible = true;
    if (args.opener == undefined) {
      let opwin = window;
      while (opwin.parent != opwin && opwin.parent.opened_dlgs) opwin = opwin.parent;
      args.opener = opwin.document.body;
    }
    if (args.embed == undefined) args.embed = false;
    if (args.full == undefined) args.full = false;
    if (args.clear == undefined) args.clear = false;
    if (args.style == undefined) args.style = '';
    args.classname = args.classname ? ` ${args.classname}` : '';
    args.query = build_query(args.query == undefined ? '' : args.query);

    let uname = args.name ? '_' + args.name.replace(/\.|\//g, m=>m == '.' ? '_' : '__') : '';
    let cname = args.name ? ' ' + args.name.replace(/\.|\//g, m=>m == '.' ? '_' : '__') : '';
    let down_target = null;
    
    let edit_dim = document.createElement('div');
    edit_dim.id = 'editdim' + uname;
    edit_dim.className = 'editdim';
    edit_dim.addEventListener("mousedown", function(event) {
      if (event.target == edit_dim) {
        event.preventDefault();
        event.stopPropagation();
        down_target = event.target;
      }
    });
    edit_dim.addEventListener("mouseup", function(event) {
      let target = down_target;
      if (target == edit_dim && event.target == edit_dim) {
        event.preventDefault();
        event.stopPropagation();
        down_target = null;
        window.history.back();
      }
    });
    
    if (!window.opened_dlgs) {
      if (!(window.opened_dlgs = parent.opened_dlgs)) {
        window.opened_dlgs = [{ win: document.body, editor: document.body, doc: document.body, step: 0, name: '', opener: false, scripts: [], resolve: null, reject: null }];
      }
      if (!window.event_ready) {
        window.event_ready = true;
        window.addEventListener('popstate', function (event) {
          let n = Math.max(0, window.opened_dlgs.length - 1);
          if (n) close_dialog(window.opened_dlgs[n].doc);
        });
      }
    }
    
    let editor = document.createElement('div');
    editor.id = 'editor' + uname;
    editor.className = 'editor' + cname + (args.full ? ' full' : '') + (args.clear ? ' clear' : '') + args.classname;
    editor.style = args.style;
    edit_dim.appendChild(editor);
    
    let c = document.createElement('div');
    c.className = 'close_button';
    c.onclick = function () {
      let n = Math.max(0, window.opened_dlgs.length - 1);
      if (n) window.history.go(-window.opened_dlgs[n].step);
    }
    c.innerHTML = '&times;';
    editor.appendChild(c);

    let edit_doc = document.createElement('iframe');
    edit_doc.id = 'editdoc' + uname;
    edit_doc.className = 'editdoc' + cname;
    editor.appendChild(edit_doc);
    editor.style.paddingLeft = '0';
    editor.style.paddingRight = '0';
    editor.style.paddingTop = '0';
    editor.style.paddingBottom = '0';
    if (args.style) editor.style.cssText += args.style;
    edit_doc.style.paddingLeft = '0';
    edit_doc.style.paddingRight = '0';
    edit_doc.style.paddingTop = '0';
    edit_doc.style.paddingBottom = '0';
    edit_doc.style.marginLeft = '0';
    edit_doc.style.marginRight = '0';
    edit_doc.style.marginTop = '0';
    edit_doc.style.marginBottom = '0';
    edit_doc.style.left = '-1px';
    edit_doc.style.top = '-1px';

    edit_dim.style.visibility = 'visible';
    args.opener.appendChild(edit_dim);

    let dlgs = window.opened_dlgs;
    let dlg = dlgs[dlgs.length - 1];
    dlg.win.classList.add('noscroll');
    dlgs.push(dlg = {
      win: edit_dim,
      editor: editor,
      doc: edit_doc,
      name: args.name,
      opener: args.opener,
      step: 1,
      scripts: [],
      resolve: resolve,
      reject: reject,
      min_width: args.minWidth,
      min_height: args.minHeight,
      max_width: args.maxWidth,
      max_height: args.maxHeight,
      // callback: args.callback
    });
    
    args.query = 'win=' + args.name + (args.query ? '&' : '') + args.query;
    if (args.query) args.url = build_url(args.url, args.query);
    if (args.full) {
      edit_doc.style.width = `100%`;
      edit_doc.style.height = `100%`;
    } else {
      edit_doc.style.width = `${editor.clientWidth}px`;
      edit_doc.style.height = `${editor.clientHeight}px`;
    }
    edit_doc.addEventListener('load', ()=>{
      let scroll_w, scroll_h;
      if (args.full) {
        scroll_w = undefined;
        scroll_h = undefined;
      } else {
        [scroll_w, scroll_h] = get_element_size(edit_doc);
        scroll_w += 18;
        scroll_h += 18;
      }
      if (args.minWidth && scroll_w < args.minWidth) scroll_w = args.minWidth;
      if (args.maxWidth && scroll_w > args.maxWidth) scroll_w = args.maxWidth;
      if (args.minHeight && scroll_h < args.minHeight) scroll_h = args.minHeight;
      if (args.maxHeight && scroll_h > args.maxHeight) scroll_h = args.maxHeight;
      show_window({
        doc: edit_doc,
        width: args.width !== true && parseInt(args.width) ? args.width : scroll_w,
        height: args.height !== true && parseInt(args.height) ? args.height : scroll_h,
        left: args.left,
        top: args.top,
        visible: args.visible,
      });
    });
    if (args.embed) {
      dlg.reload = ()=>{
        request_html({
          url: args.url,
          data: args.data,
        }).then((rsp)=>{
          if (rsp.status == 200) {
            edit_doc.srcdoc = rsp.content;
            adjust_dlg_height(true, 0, false && args.visible);
          }
        });
      };
      dlg.reload();
    } else {
      const uri = build_url(args.url, args.data);
      edit_doc.src = uri;
    }
    window.history.pushState({}, '', window.location);
    return false;
  });
  if (typeof(args.callback) == 'function') {
    pm.then((obj)=>{
      args.callback(obj);
    }).catch((obj)=>{
      if (args.callback_error) args.callback_error(obj);
    });
  } else return pm;
}

function get_content_size(obj, is_child) {
  let wn, hn;
  let rect = is_child ? obj.getBoundingClientRect() : { left: 0, top: 0, right: 0, bottom: 0 };
  if (obj.childElementCount) {
    for (let n = 0; n < obj.childElementCount; n++) {
      [wn, hn] = get_content_size(obj.children[n], true);
      wn += rect.left;
      hn += rect.top;
      if (wn > rect.right) rect.right = wn;
      if (hn > rect.bottom) rect.bottom = hn;
    }
  }
  return [rect.right, rect.bottom];
}

function get_element_width(obj) {
  let doc;
  if ((obj.tagName == 'OBJECT' || obj.tagName == 'IFRAME') && (doc = obj.contentElement)) {
    return Math.max(
      doc.body.scrollWidth, doc.documentElement.scrollWidth,
      doc.body.offsetWidth, doc.documentElement.offsetWidth,
      doc.body.clientWidth, doc.documentElement.clientWidth,
    );
  } else return obj.scrollWidth;
}

function get_element_height(obj, fit) {
  let h;
  const doc = obj.contentDocument || obj.contentWindow?.document;
  if ((obj.tagName == 'OBJECT' || obj.tagName == 'IFRAME') && doc) {
    h = fit ? Math.min(
      doc.body.scrollHeight, doc.documentElement.scrollHeight,
      doc.body.offsetHeight, doc.documentElement.offsetHeight,
      doc.body.clientHeight, doc.documentElement.clientHeight,
    ) : Math.max(
      doc.body.scrollHeight, doc.documentElement.scrollHeight,
      doc.body.offsetHeight, doc.documentElement.offsetHeight,
      doc.body.clientHeight, doc.documentElement.clientHeight,
    );
  } else h = obj.scrollHeight;
  return h;
}

function get_element_size(obj) {
  return [get_element_width(obj), get_element_height(obj)];
}

function get_opened_dlgs() {
  let wp = window;
  while (!wp.opened_dlgs && parent != wp) {
    wp = wp.parent;
  }
  if (!wp.opened_dlgs) {
    wp = window;
    wp.opened_dlgs = [{ win: document.body, editor: document.body, doc: document.body, step: 0, name: '', opener: false, scripts: [], resolve: null, reject: null }];
  }
  return wp.opened_dlgs;
}

function get_opened_editor(name) {
  const opwins = get_opened_dlgs();
  let n = 0, editor = false;
  if (name == undefined) {
    editor = opwins.length > 1 && opwins[opwins.length - 1].editor;
  } else while (n < opwins.length && !editor) {
    if (opwins[n].name == name) editor = opwins[n].editor;
    n++;
  }
  return editor;
}

function get_opened_doc(name) {
  let opwins = get_opened_dlgs();
  let n = 0;
  let doc = false;
  while (n < opwins.length > 1 && !doc) {
    if (opwins[n].name == name) doc = opwins[n].doc;
    n++;
  }
  return doc;
}

function adjust_dlg_height(fit, oh, visible) {
  let win = get_opened_dlgs();
  if (visible == undefined) visible = true;
  if (win) win = win[win.length - 1];
  if (win) {
    let h = get_element_height(win.doc, fit);
    if (win.min_height && h < win.min_height) h = win.min_height;
    if (win.max_height && h > win.max_height) h = win.max_height;
    show_window({ doc: win.doc, height: h + 18 + (oh != undefined ? oh : 0), visible: visible });
  }
}

function dialog_reload() {
  let win = get_opened_dlgs();
  if (win) win = win[win.length - 1];
  const reload = win?.reload;
  if (typeof reload == 'function') {
    reload();
  } else window.location.reload(true);
}

function show_window(arg) {
  if (arg.doc) {
    let win = arg.doc.parentNode;
    if (win) {
      if (arg.height != undefined) {
        let h = parseInt(arg.height === true || !parseInt(arg.height) ? get_element_height(arg.doc) : parseInt(arg.height));
        win.style.height = (h - 2) + 'px';
        arg.doc.style.height = (h + 0) + 'px';
      }
      if (arg.width != undefined) {
        let w = parseInt(arg.width === true || !parseInt(arg.width) ? get_element_width(arg.doc) : parseInt(arg.width));
        win.style.width = (w - 2) + 'px';
        arg.doc.style.width = (w + 0) + 'px';
      }
      if (arg.left != undefined) {
        win.style.left = arg.left + 'px';
        win.style.position = 'fixed';
        win.style.marginLeft = '0';
      }
      if (arg.top != undefined) {
        win.style.top = arg.top + 'px';
        win.style.position = 'fixed';
        win.style.marginTop = '0';
      }
      win.classList.add(arg.visible || arg.visible == undefined ? 'show' : 'stay');
    }
  }
}

function close_dialog(doc) {
  let edoc, ewin, edim;
  if (typeof doc == 'object') {
    edoc = doc;
    ewin = edoc.parentNode;
    edim = ewin.parentNode;
  } else {
    if (doc == undefined) doc = '';
    if (doc) doc = '_' + doc.replace(/\./g, '_');
    edoc = document.getElementById("editdoc" + doc);
    ewin = document.getElementById("editor" + doc);
    edim = document.getElementById("editdim" + doc);
  }
  if (ewin) ewin.style.visibility = "hidden";
  if (edim) edim.parentNode.removeChild(edim);

  let wins = window.opened_dlgs;
  let done = false;
  let n = wins.length;
  while (n-- && !done) {
    if (done = edoc == wins[n].doc) {
      for (let m = 0; m < wins[n].scripts.length; m++) document.head.removeChild(wins[n].scripts[m]);
      wins.splice(n, 1);
      wins[--n].win.classList.remove('noscroll');
    }
  }
}

function wait_state(nstart, resolve, arg) {
  let n = Math.max(0, window.opened_dlgs.length - 1);
  if (n && n == nstart) {
    window.setTimeout(()=>{ wait_state(nstart, resolve, arg) }, 100);
  } else resolve(arg);
}

function return_dialog(arg, step, is_parent) {
  if (is_parent == undefined) is_parent = false;
  if (is_parent) {
    return_modal(arg, step);
  } else if (parent) parent.return_modal(arg, step);
}

function return_modal(arg, step) {
  if (step == undefined) step = 1;
  if (arg !== undefined && typeof(arg) != 'object') {
    try {
      arg = JSON.parse(arg);
    } catch(err) {
      console.log(arg, err);
    }
  }
  let pwin = window.opened_dlgs ? window.opened_dlgs.slice(-1)[0] : null;
  let resolve = pwin ? pwin.resolve : null;
  let nstart = Math.max(0, window.opened_dlgs.length - 1);
  window.history.go(-step);
  wait_state(nstart, resolve, arg);
}

function show_progress(backdrop) {
  let d = document.body, p, c;
  if (backdrop) {
    p = document.createElement('div');
    p.className = "loading_backdrop";
    p.id = "loading_backdrop";

    c = document.createElement('div');
    c.className = "loading_close";
    c.id = "loading_close";
    c.onclick = function() {
      hide_progress();
    }
    p.appendChild(c);

    d.appendChild(p);
  } else p = d;
  let e = document.createElement('div');
  e.className = "loading show";
  e.id = "loading";
  p.appendChild(e);
}

function hide_progress() {
  let e = document.getElementById('loading_backdrop');
  if (!e) {
    e = document.getElementById('loading');
    e.className = "loading hide";
  }
  document.body.removeChild(e);
}

function request_headers(url, callback) {
  return new Promise(function(resolve, reject) {
    fetch(url, { method: 'HEAD' }).then(rsp=>{
      resolve({ headers: rsp.headers, ok: rsp.ok, status: rsp.status, statusText: rsp.statusText });
    }).catch(error=>{
      reject({ error: error });
    });
  });
}

function request_html(args) {
  return new Promise(function(resolve, reject) {
    const options = {}
    args.url = build_url(args.url, args.query);
    if (args.headers) options.headers = args.headers;
    if (typeof(args.data) == 'object') args.data = json_encode(args.data);
    if (args.data) {
      options.method = 'POST';
      options.body = args.data;
      options.headers = {...options.headers, "Content-Type": "application/json; charset=utf-8"};
    } else options.method = 'GET';
    fetch(args.url, options).then(rsp=>{
      if (!rsp.ok) {
        resolve({ error: `${rsp.status}: ${rsp.statusText}` });
        return;
      }
      let rdata;
      switch (args.type || false) {
        case 'arraybuffer': rdata = rsp.arrayBuffer(); break;
        case 'blob': rdata = rsp.blob(); break;
        case 'bytes': rdata = rsp.bytes(); break;
        case 'clone': rdata = rsp.clone(); break;
        case 'form': rdata = rsp.formData(); break;
        case 'json': rdata = rsp.text(); break;
        default: rdata = rsp.text();
      }
      rdata.then(data=>{
        if (args.type == 'json') {
          try {
            data = JSON.parse(data.replace(/^\s+|\s+$/g, ''));
          } catch(err) {
            const error = err.message;
            $debug.log(error, data);
          }
        }
        resolve({ content: data, ok: rsp.ok, status: rsp.status, statusText: rsp.statusText, error: rsp.ok ? false : `${rsp.status}: ${rsp.statusText}` });
      }).catch(error=>{
        reject({ error: error });
      });
    }).catch(error=>{
      reject({ error: error });
    })
  });
}

function request_queue(url, data, use_json, callback, callback_end) {
  if (typeof request_callback_end == 'undefined') request_callback_end = null;
  if (typeof load_queues == 'undefined') load_queues = [];
  if (typeof request_working == 'undefined') request_working = false;
  if (callback_end !== undefined) request_callback_end = callback_end;
  if (url !== undefined) {
    let qdata = {
      url: url,
      data: data,
      json: use_json,
      callback: callback,
    }
    if (load_queues.push(qdata) == 1) request_queue();
  } else {
    if (request_working) {
      setTimeout(request_queue, 1);
      return;
    }
    request_working = true;
    let qdata = load_queues.shift();
    if (qdata) {
      request_html({
        url: qdata.url,
        data: qdata.data,
        type: qdata.json ? 'json' : 'text',
      }).then((rsp)=>{
        qdata.callback(rsp.content, rsp.status);
        setTimeout(request_queue, 1);
        request_working = false;
      });
    } else {
      if (request_callback_end) request_callback_end();
      request_working = false;
    }
  }
}

function require_script(url, refresh, callback) {
  request_html({
    url: url,
    data: false,
  }).then(rsp=>{
    let e = document.createElement('script');
    e.text = rsp?.content || {};
    document.body.appendChild(e);
    if (callback) callback();
  });
}

function copy_to_clipboard(text) {
  let result = true; 
  if (window.clipboardData) {
    window.clipboardData.setData("Text", text);
  } else {
    let el = document.createElement('textarea');
    el.value = encodeURI(text);
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    if (navigator.userAgent.match(/ipad|iphone/i)) {
      let range, selection;
      range = document.createRange();
      range.selectNodeContents(el);
      selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      el.setSelectionRange(0, 999999);
    } else {
      el.select();
    }
    document.execCommand('copy');
    document.body.removeChild(el);
  }
  return result;
}

function get_select_line(text, start, end) {
  let c = text.charAt(start - 1);
  while (c != "\n" && c) {
    start--;
    c = text.charAt(start - 1);
  }
  if (text.charAt(end - 1) == "\n") end--;
  c = text.charAt(end);
  while (c != "\n" && c != "\r" && c !== '') {
    end++;
    c = text.charAt(end);
  }
  return [start, end];
}

function get_prev_line(text, start, end) {
  let c = text.charAt(start - 1);
  while (c != "\n" && c) {
    start--;
    c = text.charAt(start - 1);
  }
  start = end = start ? start - 1 : 0;
  c = text.charAt(start - 1);
  while (c != "\n" && c) {
    start--;
    c = text.charAt(start - 1);
  }
  return [start, end];
}

function delete_select_text(text, start, end) {
  if (start != end) {
    text = text.substr(0, start) + text.substr(end);
    end = start;
  }
  return [start, end];
}

function set_cookie(cname, cvalue, exdays) {
  let d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function get_cookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function editor_keydown(event, args) {
  let key = event.keyCode || event.which;
  let start = event.target.selectionStart;
  let end = event.target.selectionEnd;
  let text = event.target.value;
  let comment = args.comment == undefined ? '//' : args.comment;
  let p, q, n, indent, s;
  switch (key) {
  case 9: // tab
    event.preventDefault();
    if (start == end) {
      [p, q] = get_select_line(text, start, end);
      p = (start - p) & 1 ? 1 : 2;
      if (event.shiftKey) {
        // p = 3 - p;
        while (p-- && start && text.substr(start - 1, 1) == ' ') {
          text = text.substr(0, start - 1) + text.substr(start);
          start--;
          end--;
        }
      } else {
        text = text.substr(0, start) + ' '.repeat(p) + text.substr(start);
        start = end = end + p;
      }
    } else {
      [start, end] = get_select_line(text, start, end);
      p = start;
      while (p < end) {
        if (text.charAt(p - 1) == "\n" || !p) {
          if (event.shiftKey) {
            if (text.charAt(p) == ' ') {
              q = p + 1;
              if (text.charAt(q) == ' ') q++;
              text = text.substring(0, p) + text.substring(q);
              end -= 2;
            }
            p++;
          } else {
            text = text.substring(0, p) + '  ' + text.substring(p);
            p += 2;
            end += 2;
          }
        } else p++;
      }
    }
    event.target.value = text;
    event.target.selectionStart = start;
    event.target.selectionEnd = end;
    break;
  case 13: // enter
    event.preventDefault();
    [start, end] = delete_select_text(text, start, end);
    [p, q] = get_select_line(text, start, end);
    let c = text.substring(p, q).trimEnd().substr(-1, 1);
    s = (end >= q) && (c == '{' || c == '[') ? '  ' : '';
    while (text.charAt(p++) == ' ') s += ' ';
    text = text.substr(0, start) + "\n" + s + text.substr(end);
    event.target.value = text;
    event.target.selectionStart = start = start + s.length + 1;
    event.target.selectionEnd = start;
    p = text.substr(0, start).match(/\n/g).length - 1;
    q = text.split("\n").length;
    p = event.target.scrollHeight * p / q;
    event.target.scrollTop = p;
    break;
  case 36: // home
    if (!event.ctrlKey) {
      event.preventDefault();
      [p, q] = get_select_line(text, start, end);
      n = p;
      while (n < q && text.charAt(n) == ' ') n++;
      start = start == n ? p : n;
      event.target.selectionStart = start;
      event.target.selectionEnd = event.shiftKey ? end : start;
      event.target.blur();
      event.target.focus();
    }
    break;
  case 83: // s
    if (event.ctrlKey) {
      if (args && args.callback_save) args.callback_save();
      event.preventDefault();
    }
    break;
  case 81: // q
    if (event.ctrlKey) {
      event.preventDefault();
      [start, end] = get_select_line(text, start, end);
      p = start;
      while (p < end) {
        if (text.charAt(p - 1) == "\n" || !p) {
          while (text.charAt(p) == ' ') p++;
          if (text.substring(p, p + comment.length) == comment) {
            q = p + comment.length;
            while (text.charAt(q) == ' ') q++;
            text = text.substring(0, p) + text.substring(q);
            end -= q - p;
            p++;
          } else {
            text = text.substring(0, p) + comment + ' ' + text.substring(p);
            p += comment.length + 1;
            end += comment.length + 1;
          }
        } else p++;
      }
      event.target.value = text;
      event.target.selectionStart = start;
      event.target.selectionEnd = end;
    }
    break;
  case 221: // }
    [start, end] = delete_select_text(text, start, end);
    [p, q] = get_select_line(text, start, end);
    while (q > p && text.charAt(q - 1) == ' ') q--;
    if (p == q) {
      start = Math.max(start - 2, p);
      text = text.substr(0, start) + text.substr(end);
      event.target.value = text;
      event.target.selectionStart = start;
      event.target.selectionEnd = start;
    }
    break;
  }
  if (args && (typeof args.callback) == 'function') args.callback(event, key);
}

window.mobilecheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame   || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame    || 
    window.oRequestAnimationFrame        || 
    window.msRequestAnimationFrame     || 
    function(/* function */ callback, /* DOMElement */ element){
      window.setTimeout(callback, 1);
    };
})();

function canTouched() {
  return ('ontouchstart' in window)
    || (navigator.maxTouchPoints > 0)
    || (navigator.msMaxTouchPoints > 0)
    || window.matchMedia("(any-pointer: coarse)").matches;
}

function draw_canvas_sticker(cv, url, size, angle, align, text_color, bg_color, text, x, y) {
  let img = new Image;
  img.style = 'display: none';
  img.onload = function () {
    draw_canvas_image(cv, img, size, angle, align, text_color, bg_color, text, x, y);
  }
  img.src = url;
}
function draw_canvas_image(cv, img, size, angle, align, text_color, bg_color, text, x, y) {
  if (cv.getContext) {
    text = decodeURIComponent(text);
    let ctx = cv.getContext('2d');
    ctx.drawImage(img, 0, 0, cv.width, cv.height);
    draw_custom_texts(ctx, img.width, img.height, size, angle, align, text_color, bg_color, text, x, y);
  }
}
function draw_canvas_text(cv, w0, h0, size, angle, align, text_color, bg_color, text, x, y) {
  if (cv.getContext) {
    draw_custom_text(cv.getContext('2d'), w0, h0, size, angle, align, text_color, bg_color, text, x, y);
  }
}
function draw_canvas_texts(cv, w0, h0, size, angle, align, text_color, bg_color, text, x, y) {
  if (cv.getContext) {
    draw_custom_texts(cv.getContext('2d'), w0, h0, size, angle, align, text_color, bg_color, text, x, y);
  }
}
function draw_custom_text(ctx, w0, h0, size, angle, align, text_color, bg_color, text, x, y) {
  let w = ctx.canvas.width;
  let h = ctx.canvas.height;
  if (!w0) w0 = w;
  if (!h0) h0 = h;
  let sz = size * 4 / 3;
  ctx.font = (sz * w / w0) + "px ChaomNenNen";
  ctx.fillStyle = text_color;
  if (bg_color) {
    ctx.strokeStyle = bg_color;
    ctx.lineWidth = 4 * w / w0;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  } else ctx.lineWidth = 0;
  switch (align.substr(0, 1)) {
  case 'l':
    ctx.textAlign = 'left';
    break;
  case 'r':
    ctx.textAlign = 'right';
    break;
  default:
    ctx.textAlign = 'center';
  }
  switch (align.substr(-1)) {
  case 't':
    ctx.textBaseline = "hanging";
//      ctx.textBaseline = "top";
    break;
  case 'b':
    ctx.textBaseline = "alphabetic";
//      ctx.textBaseline = "bottom";
    break;
  case 'a':
    ctx.textBaseline = "alphabetic";
    break;
  case 'h':
    ctx.textBaseline = "hanging";
    break;
  default:
    ctx.textBaseline = "middle";
  }
  ctx.save();
  ctx.translate(x * w / w0, y * h / h0);
  if (angle) ctx.rotate(-angle * Math.PI / 180);
  ctx.translate(0, -((size / 7) * h / h0));
  ctx.strokeText(text, 0, 0); 
  ctx.fillText(text, 0, 0); 
  ctx.restore();
}
function draw_custom_texts(ctx, w0, h0, size, angle, align, text_color, bg_color, text, x, y) {
  let texts = text.split('\n');
  let ny = size * 11 / 10;
  switch (align.substr(-1)) {
  case 'm':
    qy = -(texts.length - 1) * ny / 2;
    break;
  case 'b':
    qy = -(texts.length - 1) * ny;
    break;
  default:
    qy = 0;
  }
  radius = angle * Math.PI / 180;
  sina = Math.sin(radius);
  cosa = Math.cos(radius);
  for (n = 0; n < texts.length; n++) {
    px = x + qy * sina;
    py = y + qy * cosa;
    draw_custom_text(ctx, w0, h0, size, angle, align, text_color, bg_color, texts[n], px, py);
    qy += ny;
  }
}

function text_encode(text) {
  text = String(text);
  text = text.replace(/&/g, '&amp;');
  text = text.replace(/</g, '&lt;');
  text = text.replace(/>/g, '&gt;');
  return text.replace(/"/g, '&quot;');
}

function space_encode(text) {
  return text !== '' && text !== null && text !== undefined ? text_encode(text) : '&nbsp;';
}

function memo_encode(text) {
  text = text_encode(text);
  text = text.replace(/\r\n/g, '\n');
  text = text.replace(/\n /g, '\n&nbsp;');
  text = text.replace(/  /g, ' &nbsp;');
  return text.replace(/\n/g, '<br>\n');
}

function base64_decode(text) {
  text = atob(text);
  try {
    text = decodeURIComponent(text.split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  } catch(e) {
  }
  return text;
}

function th_day(day) {
  return ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'][day];
}

function th_sday(day) {
  return ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'][day];
}

function th_smonth(month) {
  return [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.',
    'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.',
    'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ][month - 1];
}

function th_month(month) {
  return [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
    'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
    'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ][month - 1];
}

function th_date(format, adate) {
  adate = adate == undefined ? new Date() : new Date(adate);
  return format.replace(/[a-z]/ig, function (match) {
    switch (match) {
      case 'd': return ('0' + adate.getDate()).substr(-2);
      case 'D': return th_sday(adate.getDay());
      case 'j': return adate.getDate();
      case 'l': return th_day(adate.getDay());
      case 'N': return ((adate.getDay() + 6) % 7) + 1;
      case 'w': return adate.getDay();
      // case 'z': return ('0' + adate.getDate()).substr(-2);

      // case 'W': return adate.getDay();

      case 'F': return th_month(adate.getMonth() + 1);
      case 'm': return ('0' + (adate.getMonth() + 1)).substr(-2);
      case 'M': return th_smonth(adate.getMonth() + 1);
      case 'n': return adate.getMonth() + 1;
      // case 't': return ('0' + (adate.getMonth() + 1)).substr(-2);

      // case 'L': return ('000' + (adate.getFullYear() + 543)).substr(-4);
      // case 'o': return ('000' + (adate.getFullYear() + 543)).substr(-4);
      case 'Y': return ('000' + (adate.getFullYear() + 543)).substr(-4);
      case 'y': return (adate.getFullYear() + 543).toString().substr(-2);

      // case 'g': return ('0' + adate.getHours()).substr(-2);
      case 'G': return adate.getHours();
      // case 'h': return ('0' + adate.getHours()).substr(-2);
      case 'H': return ('0' + adate.getHours()).substr(-2);
      case 'i': return ('0' + adate.getMinutes()).substr(-2);
      case 's': return ('0' + adate.getSeconds()).substr(-2);
      case 'u': return adate.getMilliseconds() * 1000;
      case 'v': return adate.getMilliseconds();
    }
    return match;
  }); 
}

function apply_class(element, name, active) {
  if (element && name) {
    if (active) {
      element.classList.add(name);
    } else element.classList.remove(name);
  }
}

function toggle_class(name, cname) {
  document.querySelector(name).classList.toggle(cname);
}

function apply_now(name, thai) {
  if (thai == undefined) thai = false;
  let e = document.getElementById(name);
  let t = new Date();
  let d = t.getDate();
  let m = t.getMonth() + 1;
  let y = t.getFullYear();
  let h = t.getHours();
  let n = t.getMinutes();
  if (thai) y += 543;
  e.value = ('0' + d).substr(-2) + '-' + ('0' + m).substr(-2) + '-' + ('000' +y).substr(-4) + ' ' + ('0' + h).substr(-2) + ':' + ('0' + n).substr(-2);
}

function stop_audio(player) {
  let audios = document.querySelectorAll('audio');
  for (n = 0; n < audios.length; n++) {
    if (player != audios[n]) {
      audios[n].pause();
      audios[n].currentTime = 0;
    }
  }
}

function call_encode(name, arg, event) {
  let p, s, obj = window;
  do {
    if ((p = name.indexOf('.')) >= 0) {
      s = name.substr(0, p);
      name = name.substr(p + 1);
      obj = obj[s];
    }
  } while (p >= 0);
  arg = JSON.parse(decodeURIComponent(arg));
  if (!Array.isArray(arg)) arg = [arg];
  if (event) arg.unshift(event);
  return typeof obj[name] == 'function' ? obj[name].apply(obj, arg) : false;
}

function json_encode(obj, indent) {
  if (indent == undefined) indent = '';
  let result = '', s = '', n = 0;
  if (typeof obj == 'object' && obj !== null) {
    result += '{';
    for (let k in obj) {
      if (n++) s += ',';
      s += `\n${indent}  "${k}": ` + json_encode(obj[k], indent + '  ');
    }
    result += s + (s ? `\n${indent}` : '') + '}';
  } else result = JSON.stringify(obj, (k, v)=>(v === undefined ? null : v));
  return result;
}

function hex_encode(text) {
  let result = '';
  for (let n = 0; n < text.length; n++) {
    const charCode = text.charCodeAt(n);
    const hexValue = charCode.toString(16);
    result += hexValue.padStart(2, '0');
  }
  return result;
}

function hex_decode(text) {
  let result = '';
  for (let n = 0; n < text.length; n += 2) {
    const hexValue = text.substr(n, 2);
    const decimalValue = parseInt(hexValue, 16);
    result += String.fromCharCode(decimalValue);
  }
  return result;
}

function hex2bin(text) {
  let result = new Uint8Array(hex_decode(text));
  for (let n = 0; n < text.length; n += 2) {
    const hexValue = text.substr(n, 2);
    const decimalValue = parseInt(hexValue, 16);
    result[n] = String.fromCharCode(decimalValue);
  }
  return result;
}

function is_number(text) {
  return /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(text);
}

function force_number(text) {
  return is_number(text) ? parseFloat(text) : false;
}

function object_text(o, indent) {
  if (indent == undefined) indent = '';
  if (o && typeof o == 'object') {
    let s = '';
    for (k in o) {
      s += (s ? "\n" + indent : '') + '  ' + k + ': ' + object_text(o[k], indent + '  ');
    }
    return '{\n' + indent + s + '\n' + indent + '}';
  } else return o;
}

function set_image_content(name, content) {
  if (typeof name == 'object') {
    if (name.content) content = name.content;
    name = name.name;
  }
  // if (input.files[0]) document.getElementById(name).src = window.URL.createObjectURL(input.files[0]);
  if (name && content) {
    let d = document.querySelector(name);
    if (d) d.src = content;
  }
  return true;
}

function prevent_zoom() {
  // window.addEventListener('touchstart', function(e) {
    // window._startY = e.touches[0].pageY;
  // });
  document.addEventListener('touchmove', function(e) {
    // let currentY = e.touches[0].pageY;
    // if ((e.scale !== undefined && e.scale !== 1) || (!e.target.scrollTop && currentY > window._startY) || (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight && currentY < window._startY)) {
    if (e.scale !== undefined && e.scale !== 1) {
      if (e.cancelable) e.preventDefault();
      return false;
    }
    // window._startY = currentY;
  }, { passive: false });
}

window.$debug = { dump_objects: [] }
window.$doc = {}
window.$win = {}

Object.defineProperty($debug , "output", {
  configurable: false,
  enumerable: false,
  writable: false,
  value: function(...texts) {
    for (let text of texts) document.body.innerHTML += text.toString();
  },
});
Object.defineProperty($debug , "echo", {
  configurable: false,
  enumerable: false,
  writable: false,
  value: function(text) { this.output(memo_encode(text.toString())) },
});
Object.defineProperty($debug , "text", {
  configurable: false,
  enumerable: false,
  writable: false,
  value: function(obj, indent, childed) {
    let result = '';
    if (indent == undefined) indent = '';
    if (obj == window) return '{obj} window';
    if (obj === true) return '(true)';
    if (obj === false) return '(false)';
    if (obj === null) return '(null)';
    switch (typeof obj) {
    case 'object':
      if (obj instanceof Element) return '{obj} DOM Element';
      if (!childed) {
        $debug.dump_objects = [];
      } else {
        for (let dobj of $debug.dump_objects) if (dobj === obj) return '{obj} duplicated';
        $debug.dump_objects.push(obj);
      }
      let vals = '';
      for (let k in obj) {
        vals += `${vals ? ',' : ''}\n${indent}  ${k}: ` + this.text(obj[k], `${indent}  `, true);
      }
      result = `{${vals}${vals ? '\n' + indent : ''}}`;
      break;
    case 'function':
      result = 'ƒ ' + obj.toString().match(/^function\s*\([^)]*\)|^\([^)]*\)|[^=]*=>/);
      break;
    case 'undefined':
      result = '(undefined)';
      break;
    default:
      result = obj.toString();
    }
    if (!childed) $debug.dump_objects = [];
    return result;
  },
});

Object.defineProperty($debug , "textBox", {
  configurable: false,
  enumerable: false,
  writable: false,
  value: function(text) {
    return `<div style="border: solid 1px black; border-radius: 6px; padding: 8px; margin: 2px; background-color: #FFF8F0;display: inline-block; width: auto !important">${memo_encode(text)}</div>`;
  },
});
Object.defineProperty($debug , "textDiv", {
  configurable: false,
  enumerable: false,
  writable: false,
  value: function(text) {
    const e = document.createElement('div');
    e.style = "z-index: 1000; position: absolute; left: 8; top: 8; border: solid 1px black; border-radius: 6px; padding: 8px; margin: 2px; background-color: #FFF8F0;display: inline-block; width: auto !important";
    e.innerText = text_encode(text);
    return e;
  },
});
Object.defineProperty($debug , "log", {
  configurable: false,
  enumerable: false,
  writable: false,
  value: function(obj) {
    const e = new Error().stack.split("\n")[2];
    const match = /\((.*):(\d+):(\d+)\)$/.exec(e) || /at\s+(.*):(\d+):(\d+)$/.exec(e);
    const info = {
      path: match?.[1] || '',
      line: match?.[2] || '',
      column: match?.[3] || ''
    }
    let text = `%cfile: ${info.path}\nline: ${info.line} column: ${info.column}%c`;
    for (let k in arguments) {
      text += `\n--> log #${k}: ${this.text(arguments[k])}`;
    }
    console.log(text, "text-decoration: underline; font-weight: bold; color: blue", "");
  },
});
Object.defineProperty($debug , "dump", {
  configurable: false,
  enumerable: false,
  writable: false,
  value: function() {
    for (let k in arguments) document.body.appendChild(this.textDiv(this.text(arguments[k])));
  },
});

Object.defineProperty($doc , "body", {
  configurable: false,
  enumerable: false,
  writable: false,
  value: function() { return document.body },
});
Object.defineProperty($doc , "event", {
  configurable: false,
  enumerable: false,
  writable: false,
  value: function(ename, efunc) { return document.addEventListener(ename, efunc) },
});
Object.defineProperty($doc , "id", {
  configurable: false,
  enumerable: false,
  writable: false,
  value: function(text) { return document.getElementById(text) },
});
Object.defineProperty($doc , "query", {
  configurable: false,
  enumerable: false,
  writable: false,
  value: function(text) { return document.querySelector(text) },
});
Object.defineProperty($doc , "querys", {
  configurable: false,
  enumerable: false,
  writable: false,
  value: function(text) { return document.querySelectorAll(text) },
});

Object.defineProperty($win , "event", {
  configurable: false,
  enumerable: false,
  writable: false,
  value: function(ename, efunc) { return window.addEventListener(ename, efunc) },
});