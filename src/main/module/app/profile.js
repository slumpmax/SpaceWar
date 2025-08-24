window.liffinfo = { }

function app_ready(info, app_callback) {
  let data = {
    base: info.base,
    app: info.app,
    user: info.user.id,
    category: info.category.name,
    profile: info.profile,
    href: location.href,
    extras: info.extras,
    inputs: info.inputs,
  }
  // request_html({
    // url: '/main/module/app/api.profile',
    // data: data,
    // json: true,
  // }).then((rsp)=>{
    // const obj = rsp?.content || {}
    // Object.assign(info.user, obj.user || {});
    // Object.assign(info.category, obj.category || {});
    // Object.assign(info.extras, obj.extras || {});
    // Object.assign(info.inputs, obj.inputs || {});
    // liffinfo = info;
    // if (typeof app_callback == 'function') app_callback(liffinfo);
  // });
  liffinfo = info;
  if (typeof app_callback == 'function') app_callback(liffinfo);
}

function app_login(url) {
  localStorage.setItem('liff_login_status', 'logging');
  const frm = document.createElement('iframe');
  frm.style.display = 'block';
  frm.style.position = 'fixed';
  frm.style.left = 'calc(50% - 200px)';
  frm.style.top = 'calc(50% - 200px)';
  frm.style.width = '400px';
  frm.style.height = '400px';
  frm.style.border = 'none';
  frm.src = `/main/module/line/liff/login?url=${url ? url : window.location.href}`;
  document.body.appendChild(frm);
}

function app_liff_init(info, app_callback) {
  const in_dialog = opener?.liff_login_signature == 'liff';
  liff.init({
    liffId: info.liff_id,
  }).then(()=>{
    if (!liff.isLoggedIn()) {
      if (in_dialog) {
        if (info.url) {
          liff.login({ redirectUri: info.url });
        } else liff.login();
      } else app_login(info.url);
      return;
    }
    if (liff.isLoggedIn()) {
      if (in_dialog) {
        opener.top.location.reload();
        window.close();
        return;
      }
      liff.getProfile().then((profile)=>{
        info.have = true;
        info.profile = profile;
        info.token = liff.getAccessToken();
        app_ready(info, app_callback)
      }).catch((err)=>{
        if (liff.getOS() == 'web') {
          console.log(`${err.name} : ${err.code} : ${err.message}`);
        } else alert(`${err.name} : ${err.code} : ${err.message}`);
        liff.logout();
      });
    } else {
      info.have = false;
      info.profile = {
        userId: info.user.id,
        displayName: info.user.name,
      }
      info.token = '';
      app_ready(info, app_callback);
    }
  }).catch((err)=>{
    if (liff.getOS() == 'web') {
      console.log(`${err.name} : ${err.code} : ${err.message}\n${err.stack}`);
    } else if (document.body) alert(`${err.name} : ${err.code} : ${err.message}\n${err.stack}`);
    info.have = false;
    info.profile = {
      userId: info.user.id,
      displayName: info.user.name,
    }
    app_ready(info, app_callback);
  });
}

function app_init(info, app_callback) {
  if (info == undefined) info = { liff_id: '' }
  if (typeof info !== 'object') info = JSON.parse(atob(info));
  if (!info.hasOwnProperty('user')) info.user = {
    id: '',
    code: 0,
    name: '',
    nickName: '',
    shareName: '',
    coin: 0,
    ticket: 0,
    luck: 0,
    secure: '',
  }
  if (!info.hasOwnProperty('category')) info.category = {
    id: 0,
    name: 'public',
    token: '',
    cooltime: 0,
  }
  if (!info.hasOwnProperty('extras')) info.extras = {}
  if (!info.hasOwnProperty('inputs')) info.inputs = {}
  if (info.debug || info.liffed === false || location.host.match(/^localhost($|:)/)) {
    info.have = false;
    info.profile = {
      userId: info.user.id,
      displayName: info.user.name,
    }
    info.token = '';
    app_ready(info, app_callback);
  } else app_liff_init(info, app_callback);
}