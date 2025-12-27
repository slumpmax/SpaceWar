function sourceData(args) {
  this._ = {};
  this._.base = args._.base != undefined ? args._.base : '';
  this._.page = args._.page != undefined ? args._.page : '';
  this._.major = args._.major != undefined ? args._.major : '';
  this._.name = args._.name != undefined ? args._.name : '';
  this._.path = args._.path != undefined ? args._.path : '';
  this._.uri = args._.uri != undefined ? args._.uri : '';
  this._.liff_start = args._.liff_start != undefined ? args._.liff_start : false;
  this._.secure = args._.secure != undefined ? args._.secure : '';
  if (args._.move) history.replaceState('', '', args._.move + location.hash);
  for (let k in args) {
    if (this[k] == undefined) this[k] = args[k];
  }
  this._url = (url)=>{
    const major = this._.major && this._.major != 'page' ? `/${this._.major}` : '';
    url = url == undefined || url === false || url === null ? '' : String(url);
    if (url !== '' && url.substr(0, 1) != '/') url = `/${url}`;
    if (this._.name.substr(0, 1) == '/') return  `${major}${this._.name}${url}`;
    const name = this._.name.toString() !== '' ? `/${this._.name}` : '';
    return `/${this._.base}${major}${name}${url}`;
  }
  this._path = (url)=>{
    url = url == undefined || url === false || url === null ? '' : String(url);
    if (url !== '' && url.substr(0, 1) != '/') url = `/${url}`;
    return `${this._.path}${url}`;
  }
  this.api = (args)=>{
    if (args._ == undefined) args._ = {};
    if (args._.base == undefined) args._.base = this._.base;
    if (args._.page == undefined) args._.page = this._.page;
    if (args._.secure == undefined) args._.secure = this._.secure || '';
    if (args.api == undefined) args.api = '';
    if (args._.page.substr(0, 1) != '/' && args._.page.toString() !== '') args._.page = `/${args._.base}/${args._.page}`;
    if (typeof window.__TAURI__ == 'object') return this.invoke('api', { data: args });
    const url = args?.url == undefined ? this._url('api' + (args?.api ? `.${args.api}` : '')) : args.url;
    return request_html({
      url: url,
      query: args.query || '',
      data: args,
      type: 'json',
    });
  }
  this.invoke = (api, data)=>{
    if (typeof window.__TAURI__.core?.invoke == 'function') return window.__TAURI__.core.invoke(api, data);
    return new Promise(function(resolve, reject) {
      resolve({});
    });
  }
  this.embed = (editor, args)=>{
    if (args == undefined) args = {};
    if (!args.url) {
      const data = args.data || {};
      const page = args.page || '';
      if (data._ == undefined) data._ = {};
      if (data._.base == undefined) data._.base = this._.base;
      if (data._.secure == undefined) data._.secure = this._.secure || '';
      args.url = (page.substr(0, 1) == '/' ? '' : `${this._.uri}/`) + page;
      delete(args.page);
    }
    return window.embed_dialog(editor, args);
  }
  this.open = (args)=>{
    if (args == undefined) args = {};
    if (!args.url) {
      const data = args.data || {};
      const page = args.page || '';
      if (data._ == undefined) data._ = {};
      if (data._.base == undefined) data._.base = this._.base;
      if (data._.secure == undefined) data._.secure = this._.secure || '';
      args.url = (page.substr(0, 1) == '/' ? '' : `${this._.path}/`) + page;
      delete(args.page);
    }
    return window.open_dialog(args);
  }
  this.event = (args)=>{
    const query = { _: {} }
    query._.base = args?._?.base || this._.base;
    query._.page = args?._?.page || this._.page;
    query._.secure = args?._?.secure || (this._.secure || '');
    if (args.event == undefined) args.event = '';
    if (args?.data) query.data = typeof args.data == 'function' ? args.data() : args.data;
    if (args?.interval) query.interval = args.interval;
    if (args?.timeout) query.timeout = args.timeout;
    const url = args?.url == undefined ? this._url('event' + (args?.event ? `.${args.event}` : '')) : args.url;
    query.force = false;
    let post_url = build_url(url, query);
    query.force = true;
    let pre_url = build_url(url, query);
    let result = { event: new EventSource(pre_url) };
    if (typeof args?.open == 'function') result.event.addEventListener('open', (e)=>{ args.open(e) });
    if (typeof args?.error == 'function') result.event.addEventListener('error', (e)=>{ args.error(e) });
    if (typeof args?.debug == 'function') result.event.addEventListener('debug', (e)=>{ args.debug(e) });
    if (typeof args?.message == 'function') result.event.addEventListener('message', (e)=>{
      args.message(JSON.parse(e.data));
      if (typeof args?.data == 'function') {
        query.data = args.data();
        query.force = false;
        post_url = build_url(url, query);
      }
      result.event = new EventSource(post_url);
      if (typeof args?.open == 'function') result.event.addEventListener('open', (e)=>{ args.open(e) });
      if (typeof args?.error == 'function') result.event.addEventListener('error', (e)=>{ args.error(e) });
      if (typeof args?.debug == 'function') result.event.addEventListener('debug', (e)=>{ args.debug(e) });
      if (typeof args?.message == 'function') result.event.addEventListener('message', (e)=>{ args.message(JSON.parse(e.data)) });
    });
    return result;
  }
  this._.start_liff = ()=>{
    if (typeof this._.liff_start == 'function') this._.liff_start();
  }
  // if (args.debug) $debug.log(args.debug);
}