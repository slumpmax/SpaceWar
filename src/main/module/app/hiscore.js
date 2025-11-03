function hiscorePanel(arg) {
  let self = this;
  self.app = arg.app;
  self.base = arg.base;
  self.category = arg.category;
  self.button_new = arg.button_new;
  self.factor = arg.factor ? arg.factor : 1;
  self.user = liffinfo.category.token;
  self.token = false;
  self.have = false;
  self.score = 0;
  self.counter = 0;
  self.ypos = 0;
  self.time = 0;
  self.interval = null;
  self.ny = 0;
  self.dy = 0;
  self.delay = 2;
  self.api_url = '/main/module/app/api.hiscore';
  self.scroll = function() {
    let elist = document.getElementById('hiscore_panel_list');
    elist.scrollBy({ top: self.dy / self.delay });
    self.interval = setInterval(function() {
      if (self.dy) self.dy -= self.dy > 0 ? Math.min(1, self.dy) : Math.max(-1, self.dy);
      if (self.dy) {
        elist.scrollBy({ top: Math.floor(self.dy / self.delay) });
      } else {
        clearInterval(self.interval);
        self.interval = null;
      }
    }, 5);
  }
  self.load = function(callback) {
    request_html({
      url: self.api_url,
      data: {
        base: self.base,
        action: 'panel.load',
      },
      type: 'json',
    }).then(rsp=>{
      if (rsp.ok) {
        const obj = rsp?.content || {}
        let e = document.createElement('div');
        document.body.appendChild(e);
        e.outerHTML = obj.html;
        self.have = true;
        let epanel = document.getElementById('hiscore_panel');
        let elist = document.getElementById('hiscore_panel_list');
        epanel.addEventListener('touchstart', function(event) {
          event.preventDefault();
          self.ypos = event.touches[0].clientY;
          self.time = (new Date()).getTime();
          self.ny = self.dy = 0;
        }, { passive: false });
        epanel.addEventListener('touchmove', function(event) {
          event.preventDefault();
          let etime = (new Date()).getTime();
          self.ny = self.ypos - event.touches[0].clientY;
          elist.scrollBy({ top: self.ny });
          self.ypos = event.touches[0].clientY;
          self.time = etime;
        }, { passive: false });
        epanel.addEventListener('touchend', function(event) {
          event.preventDefault();
          if (self.interval) {
            clearInterval(self);
            self.interval = null;
          }
          self.dy = self.ny * self.delay;
          self.scroll();
        }, { passive: false });
        document.getElementById('hiscore_button_new').addEventListener('click', function(event) { self.click_new(event) });
        document.getElementById('hiscore_button_new').addEventListener('touchstart', function(event) { self.click_new(event) }, { passive: false });
        if (callback) callback();
      }
    });
  }
  self.click_new = function(event) {
    if (self.button_new) self.button_new(event);
  }
  self.show = function() {
    let arg = {
      app: self.app,
      base: self.base,
      category: self.category,
      action: 'score.list',
    }
    request_html({
      url: self.api_url,
      data: arg,
      type: 'json',
    }).then(rsp=>{
      const obj = rsp?.content || {}
      let elist = document.getElementById('hiscore_panel_list');
      elist.innerHTML = '';
      if (obj.scores) for (var n = 0; n < obj.scores.length; n++) {
        var score = obj.scores[n];
        var d = document.createElement('div');
        d.className = 'hiscore_panel_score';
        d.innerHTML = `<img class="hiscore_img_score" id="hiscore_img${n}" src="/chaom/pic/avatar/i${score.secure}-${score.id}/y140/s/c64,64,,14">
        <span class="hiscore_panel_detail">
          <div class="hiscore_label_name" id="hiscore_name${n}">${score.name}</div>
          <div class="hiscore_label_score" id="hiscore_score${n}">${score.score}</div>
        </span>`;
        elist.appendChild(d);
      }
      elist.scrollTop = 0;
      document.getElementById('hiscore_panel').style.visibility = 'visible';
    });
  }
  self.hide = function() {
    document.getElementById('hiscore_panel').style.visibility = 'hidden';
  }
  self.score_add = function(score) {
    return self.score = Math.round((self.counter += score) * self.factor);
  }
  self.score_start = function(callback) {
    self.score = self.counter = 0;
    let data = {
      app: self.app,
      base: self.base,
      category: self.category,
      user: self.user,
      action: 'score.start',
    }
    request_html({
      url: self.api_url,
      data: data,
      type: 'json',
    }).then(rsp=>{
      if (rsp.ok) {
        const obj = rsp?.content || {}
        self.token = obj.token;
        if (callback) callback();
      }
    });
  }
  self.score_update = function(callback) {
    let data = {
      app: self.app,
      base: self.base,
      category: self.category,
      user: self.user,
      token: self.token,
      score: self.score,
      action: 'score.update',
    }
    request_html({
      url: '/main/module/app/api.score',
      data: data,
      type: 'json',
    }).then(rsp=>{
      if (rsp.ok && callback) callback();
    });
  }
}