const enemyMaps = [
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
  1,2,1,2,1,1,2,1,1,2,1,2,2,1,2,2,2,2,2,2,2,1,2,2,2,2,1,2,2,2,1,
  2,2,2,2,1,2,2,2,2,6,2,1,2,2,6,9,2,2,1,2,6,2,2,6,1,2,1,6,2,2,6,
  2,6,2,6,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,6,2,2,1,6,6,1,1,2,6,2,
  6,2,2,1,6,1,6,2,2,1,2,1,6,2,2,10,6,1,2,2,2,2,6,2,2,2,2,6,2,2,6,
  2,6,2,2,6,2,1,2,1,2,6,2,2,2,6,1,2,2,6,2,2,6,2,2,2,2,1,2,6,2,2,
  2,6,2,2,1,2,6,2,2,2,6,2,1,6,9,2,6,2,2,2,2,6,2,6,2,6,2,2,2,6,1,
  1,2,6,2,2,6,2,2,3,6,2,2,6,1,2,2,2,2,2,2,2,2,2,6,1,2,6,2,2,1,2,
  2,1,1,6,3,2,2,6,2,2,6,2,1,2,6,3,2,2,6,2,2,2,6,3,6,2,2,2,6,2,2,
  2,6,3,2,6,2,2,2,6,2,3,2,6,2,2,6,2,2,2,3,2,2,6,2,2,3,6,2,2,2,6,
  3,2,2,6,2,2,2,6,3,2,2,6,2,2,3,10,2,2,2,2,2,2,3,6,2,2,2,6,2,6,2,
  2,6,2,2,2,6,2,2,6,3,2,2,6,2,2,6,2,3,6,2,2,6,2,2,6,2,6,3,6,2,2,
  2,6,3,2,2,6,2,6,3,2,6,2,2,2,6,3,6,2,2,2,3,2,2,6,2,6,3,6,2,2,2,
  3,6,2,6,2,2,6,3,2,2,2,6,3,6,2,3,2,2,3,2,2,3,6,3,1,3,6,2,6,2,2,
  1,1,1,1,1,1,6,3,6,2,6,2,3,2,6,9,2,3,2,6,2,3,2,2,6,3,2,3,6,2,2,
  1,2,6,2,3,2,3,6,2,1,3,2,3,1,6,2,3,2,3,3,2,3,6,2,6,3,3,3,6,2,3,
  6,3,2,3,3,6,2,6,3,2,1,6,3,3,6,1,3,6,1,1,6,1,2,2,6,3,2,3,1,6,2,
  11
];
const enemyScores = [500,75,2000,15,7000000,0,100000,0,0,0,10000,300000,10000000];
const rocket = {
  move: 0,    // variable for start rocket
  boom: 100,  // boom
  swap: 0,    // variable for swap rocket picture
}
const scene = {
  wScreen: 360,
  hScreen: 240,
  width: 260,
  height: 240,
  xPanel: 260,
  yPanel: 0,
  wPanel: 100,
  hPanel: 240,
  xScale: 1.0,
  yScale: 1.0,
  scale: 1.0,
  picScale: 0.2,
  wide: true,
  calcX: function(x) { return x * this.xScale },
  calcY: function(y) { return y * this.yScale },
  calc: function(n) { return n * this.scale },
  clientX: function(x) { return x / this.xScale },
  clientY: function(y) { return y / this.yScale },
  picX: function(x) { return x * this.scale / this.xScale },
  picY: function(y) { return y * this.scale / this.yScale },
}
const song = {
  last: 1,
  count: 10,
  stages: [1, 8, 9],
}
function drawScene(updated) {
  if (customImage.loading) return;
  if (updated == undefined) updated = true;
  retrace = mainTime.oneCount && updated;
  context.fillStyle = '#000000';
  context.fillRect(0, 0, canvas.width, canvas.height);
  putStar();
  if (started) {
    initState();
    titleDelay = 200;
    started = false;
  } else {
    const px = scene.width / 2;
    const py = scene.height / 2;
    if (titleDelay && stage > 0 && stage < 4) {
      if (retrace) titleDelay--;
      if (titleDelay) putText(px, 84, `ฉาก ${stage} สู้ตายเพื่อท่านปึ๋ย!`, '#00CB30', '', 0, '', 'center');
    }
    if (!stage) {
      putText(px, 64, 'CTRL:ยิง ALT:ระเบิด', '#00CB30', '', 0, '', 'center');
      putText(px, 84, 'F1:เฟรมเรต ESC:เริ่มใหม่', '#00CB30', '', 0, '', 'center');
      putText(px, 164, 'กดอะไรก็ได้เพื่อเริ่มเกมส์', '#00CB30', '', 0, '', 'center');
      if (mainKey.lastKeyDown && navigator.userActivation.isActive) {
        stage++;
        updateSong(song.stages[stage - 1]);
      }
    } else if (stage > 3) {
      putText(px, 84, 'ดูเด่ะ เล่นมาตั้งนาน จบเฉยเลย', '#00CB30', '', 0, '', 'center');
      putText(px, 109, 'โปรแกรมโดย เชษฐา เจนจิโรจพิพัฒน์', '#00CB30', '', 0, '', 'center');
      putText(px, 134, 'Windows Engine by SLUMPMAX', '#00CB30', '', 0, '', 'center');
    } else if (putEnemy()) if (passGame()) started = true;
    if (life) {
      putRocket();
      gun();
      toom();
    } else {
      yRocket = 300;
      putText(px, 84, 'นักรบพลีชีพหมดแล้ว ท่านปึ๋ยจงเจริญ!', '#00CB30', '', 0, '', 'center');
      putText(px, 109, 'โปรแกรมโดย เชษฐา เจนจิโรจพิพัฒน์', '#00CB30', '', 0, '', 'center');
      putText(px, 134, 'Windows Engine by SLUMPMAX', '#00CB30', '', 0, '', 'center');
    }
  }
  if (showFPS) putText(10, 17, `Frame Rate: ${Number(mainFrameRate.update()).toFixed(2)} FPS`, '#FFFFFF', '#000000', 10);
  drawStatus();
  xTouchPad = scene.picX(20) + scene.picX(touchPad.w) / 2;
  yTouchPad = scene.height - scene.picY(40) - scene.picY(touchPad.h) / 2;
  xTouchShoot = scene.width - scene.picX(20) - scene.picX(touchButton.w) / 2;
  yTouchShoot = scene.height - scene.picY(50) - scene.picY(touchButton.h) / 2;
  xTouchBomb = scene.width - scene.picX(20) - scene.picX(touchButton.w) / 2;
  yTouchBomb = scene.height - scene.picY(70) - scene.picY(touchButton.h) * 3 / 2;
  if (!scene.wide) {
    context.globalAlpha = 0.3;
    putSprite(xTouchPad, yTouchPad, touchPad);
    putSprite(xTouchShoot, yTouchShoot, touchButton);
    putSprite(xTouchBomb, yTouchBomb, touchButton);
    context.globalAlpha = 1.0;
  }
}
function drawStatus() {
  const n = stage < 1 ? 1 : (stage > 3 ? 3 : stage);
  if (scene.wide) {
    const px = scene.xPanel;
    const py = scene.yPanel;
    fillRect(scene.xPanel, scene.yPanel, scene.wPanel, scene.hPanel, '#000065');
    putText(px + 44, py + 24, 'ฉาก', '#309AFF', '', 0, '', 'center');
    putNumber(px + 61, py + 24, n, '#00CB30', 0, '', 0, '', 'center');

    putText(px + 50, py + 44, 'คะแนน', '#309AFF', '', 0, '', 'center');
    putNumber(px + 50, py + 61, score, '#00CB30', 10, '', 0, '', 'center');

    putText(px + 41, py + 84, 'ระเบิด:', '#309AFF', '', 0, '', 'center');
    putNumber(px + 68, py + 84, bomb, '#00CB30', 2, '', 0, '', 'center');

    putText(px + 50, py + 188, 'x', '#309AFF', '', 0, '', 'center');
    putNumber(px + 66, py + 189, life, '#00CB30', 2, '', 0, '', 'center');
    putSprite(px + 32, py + 186, rocket1);

    putText(px + 50, py + 124, 'พลังงาน', '#309AFF', '', 0, '', 'center');
    showPow();
  } else {
    putText(8, scene.picY(16), 'ฉาก:', '#309AFF');
    putNumber(36, scene.picY(16), n, '#00CB30');

    putText(70, scene.picY(16), 'x', '#309AFF');
    putNumber(80, scene.picY(16), life, '#00CB30', 2);
    putSprite(60, scene.picY(12), rocket2, false, 0.2);

    putText(8, scene.picY(34), 'พลังงาน:', '#309AFF');
    showPow();

    putText(240, scene.picY(16), 'คะแนน:', '#309AFF');
    putNumber(284, scene.picY(16), score, '#00CB30', 10);

    putText(303, scene.picY(34), 'ระเบิด:', '#309AFF');
    putNumber(341, scene.picY(34), bomb, '#00CB30', 2);
  }
}
// Show power
function showPow() {
  const px = scene.wide ? scene.xPanel : 31;
  const py = scene.wide ? scene.yPanel + 132 : scene.picY(25);
  const h = scene.wide ? 6 : scene.picY(10);
  fillRect(px + 29, py, 43, h, '#400000');
  let n = power;
  if (n > 10) n = 10;
  while (n >= 0) {
    fillRect(px + 29 + n-- * 4, py, 3, h, '#FFFF65');
  }
}
// draw black ground star
function putStar() {
  let j, p, i = 0, n = 0;
  while (i < scene.height) {
    j = i + yStar;
  	if (j > scene.height + 1) j -= scene.height + 2;
  	if (!j) cStars[n] = randomInt(scene.width);
  	p = cStars[n++];
  	if (j < scene.height) putPixel(p, j, '#659ACB');
    i += 12;
  }
  if (retrace) {
    yStar++;
    if (yStar > scene.height + 1) yStar -= scene.height + 2;
  }
}
// draw my rocket
function putRocket() {
  if (damage == 200) {
    rocket.move = 70;
    power = 11;
  }
  if ((power < 0 || yRocket > scene.height - scene.picY(rocket1.h) / 2) && !rocket.move) {
  	power = -1;
    if (retrace || !boom) {
      xBoom = xRocket + randomInt(20) - 10;
      yBoom = yRocket + randomInt(20) - 10;
      boom = true;
    }
  	putSprite(xBoom, yBoom, enemyBitmaps[13]);
    if (retrace) {
      rocket.boom--;
    	if (!rocket.boom) {
        rocket.boom = 100;
        damage = 201;
        life--;
        bomb = 3;
        boom = false;
      }
    }
  } else {
  	xOld = xRocket;
    yOld = yRocket;
  	if (rocket.move) {
      xRocket = scene.width / 2;
      yRocket = scene.height / 2 + rocket.move * 2;
    }
    if (retrace) {
      const step = scene.wide ? 3 : 6;
      if (rocket.move) rocket.move--;
      xRocket = xRocket + (mainKey.values(39 /*RIGHT*/) - mainKey.values(37 /*LEFT*/)) * scene.picX(step);
      yRocket = yRocket + (mainKey.values(40 /*DOWN*/) - mainKey.values(38 /*UP*/)) * scene.picY(step);
	    if (xRocket < 0 || xRocket >= scene.width) xRocket = xOld;
 	    if (yRocket < scene.picY(rocket1.h) / 2 || yRocket > scene.height - scene.picY(rocket1.h) / 2) yRocket = yOld;
    }
  	if ((damage & 3) == 1) {
      if ((rocket.swap & 4) > 0)
        putMono(xRocket, yRocket, rocket1, '#FFFFFF')
      else putMono(xRocket, yRocket, rocket2, '#FFFFFF');
    } else if ((rocket.swap & 4) > 0)
      putSprite(xRocket, yRocket, rocket1)
    else putSprite(xRocket, yRocket, rocket2);
  }
  if (retrace) {
    if (damage == 40) power--;
    if (damage) damage--;
    rocket.swap++;
  }
}
// check and draw gun
function gun() {
  shoot |= mainKey.values(17) && stage; // CTRL
  if (!shoot || power < 0) return;
  if (retrace) {
    if (shoot == 1) {
      shoot = 2;
      xGun = xRocket;
      yGun = yRocket;
    }
    yGun -= 20;
    if (yGun < -10) shoot = 0;
  }
  putSprite(xGun, yGun, myGun, true);
  sound.shot.play();
  if (yGun != yRocket - 6) putSprite(xGun, yGun + 10, myGun);
}
// bomb enermy
function toom() {
  let i = 0;
  if (!mainKey.pressOnce(18 /*ALT*/) || !bomb || !stage) return;
  if (enemys[0].id >= 11 && enemys[0].id <= 13) {
    if (enemys[0].hp <= 0) return;
    i++;
    shoot = 0;
    if (enemys[0].hp == 8)
      enemys[0].hp -= 9
    else enemys[0].hp -= 8;
    enemys[0].ww = 40;
  } else enemyDelay = 200;
  bomb--;
  sound.bomb.play();
  while (i < 20) {
    if (enemys[i].id) score += enemyScores[enemys[i].id - 1] || 0;
  	if (enemys[i].id == 4 || enemys[i].id == 8)
      enemys[i].id = 0
  	else if (enemys[i].id > 0 && enemys[i].id != 6 && enemys[i].id != 9 && enemys[i].id != 10) {
	    enemys[i].id = -10;
    }
    i++;
  }
}
function hit(i) {
// return 1 when gun hit sprite
  return shoot && enemys[i].hit(myGun, xGun, yGun);
}
function beat(i) {
// return 1 when rocket hit sprite
  return power >= 0 && enemys[i].hit(rocket1, xRocket, yRocket, 10);
}
function caught(x, y, spr, px, py, offset) {
  if (!offset) offset = 0;
  const bw = Math.max(0, scene.picX(spr.w) / 2 - offset);
  const bh = Math.max(0, scene.picY(spr.h) / 2 - offset);
  return px >= x - bw && px <= x + bw
    && py >= y - bh && py <= y + bh;
}
function newEnemy(i) {
  let spr, w, h;
  switch (enemys[i].id) {
  case 1: // Killer
    enemys[i].x = randomInt(scene.width);
    break;
  case 2: // Warper
    enemys[i].x = randomInt(scene.width);
    if (enemys[i].x < scene.width / 2)
      enemys[i].ww = 2
    else enemys[i].ww = -2;
    enemys[i].hp = randomInt(190) + 30;
    break;
  case 3: //Bird
    enemys[i].x = randomInt(scene.width);
    enemys[i].ww = 0;
    enemys[i].hp = randomInt(100) - 80;
    break;
  case 4: // Ring
    enemyDelay = 20;
    enemys[i].id = 0;
    break;
  case 5: // Slam
    enemys[i].x = randomInt(scene.width);
    enemys[i].ww = 0;
    enemys[i].hp = 2;
    break;
  case 6: // Stone
    enemys[i].x = randomInt(scene.width);
    break;
  case 7: // Head
    enemys[i].x = randomInt(scene.width);
    enemys[i].ww = 2;
    break;
  case 8: // Fire
    spr = enemys[0].image;
    w = scene.picX(spr.w);
    enemys[i].x = randomInt(w) + enemys[0].x - w / 2;
    enemys[i].ww = Math.abs(xRocket - enemys[i].x);
    enemys[i].hp = Math.abs(yRocket - enemys[i].y);
    if ((enemys[i].ww >> 1) == (enemys[i].hp >> 1))
      enemys[i].ww = randomInt(3) + 1
    else if (enemys[i].ww > enemys[i].hp)
      if (enemys[i].ww > (enemys[i].hp << 2))
        enemys[i].ww = randomInt(3) + 2
      else enemys[i].ww = randomInt(4) + 1
    else if (enemys[i].hp > (enemys[i].ww << 2))
      enemys[i].ww = randomInt(2)
    else enemys[i].ww = randomInt(3);
      enemys[i].hp = 4 - enemys[i].ww;
    if ((randomInt(2) && (enemys[i].ww < 2)) || ((enemys[i].ww > 1) && (xRocket < enemys[i].x)))
      enemys[i].ww = -enemys[i].ww;
    if (yRocket < enemys[i].y) enemys[i].hp = -enemys[i].hp;
    break;
  case 9: case 10: // ItemB,ItemP
    enemys[i].x = randomInt(scene.width);
    break;
  case 11: case 12: case 13: // Boss1, Boss2, Boss3
    let j = 0;
    while (j < 20 && (!enemys[j].id || i == j)) j++;
    if (j < 20) {
      enemys[i].id = 0;
      enemyIndex--;
      return;
    }
    if (i) {
      enemys[0].id = enemys[i].id;
      enemys[i].id = 0;
    }
    enemys[0].x = scene.width / 2;
    enemys[0].y = scene.picY(enemys[i].image.h) / 2 + 10;
    enemys[0].ww = 0;
    enemys[0].hp = 60;
    kEnemy = 0;
    break;
  case 14: // Boom1, Boom2, Boom3
    spr = enemys[0].image;
    w = scene.picX(spr.w) + 10;
    h = scene.picY(spr.h) + 10;
    enemys[i].x = enemys[0].x + randomInt(w) - w / 2;
    enemys[i].y = enemys[0].y + randomInt(h) - h / 2;
    enemys[i].ww = 60;
    break;
  }
}
function moveEnemy(i) {
  let hurt = strike = dead = false;
  let j = 0;
  if (enemys[i].id < 0) {
 	  enemys[i].y += 3;
    enemys[i].id++;
  } else if (enemys[i].id > 0) {
    hurt = beat(i);
    strike = hit(i);
   	switch (enemys[i].id) {
      case 6: dead = enemyMove6(i, hurt, strike); break;
      case 7: dead = enemyMove7(i, hurt, strike); break;
      case 8: dead = enemyMove8(i, hurt, strike); break;
      case 9: dead = enemyMove9(i, hurt, strike); break;
      case 10: dead = enemyMove10(i, hurt, strike); break;
      case 11: dead = enemyMove11(i, hurt, strike); break;
      case 12: dead = enemyMove12(i, hurt, strike); break;
      case 13: dead = enemyMove13(i, hurt, strike); break;
      case 14: dead = enemyMove14(i, hurt, strike); break;
      default: dead = enemyMoveOther(i, hurt, strike);
    }
    if (dead) {
      score += enemyScores[enemys[i].id - 1] || 0;
      if (!damage && hurt) damage = 40;
      if (enemys[i].id == 4)
        enemys[i].id = 0
      else enemys[i].id = -10;
      shoot = 0;
      sound.kill.play();
    } else if (strike) sound.hit.play();
  }
}
function enemyMove6(id, hurt, strike) {
  if (strike) shoot = 0;
  if (hurt) {
    xRocket = xOld;
    yOld += 4;
    yRocket = yOld;
  }
  enemys[id].y++;
  return false;
}
function enemyMove7(id, hurt, strike) {
  if (!enemys[id].ww || hurt) return true;
  if (!randomInt(100)) for (let j = 0; j < 20; j++) if (!enemys[j].id) {
    enemys[j].id = 4;
    enemys[j].x = enemys[id].x + 3;
    enemys[j].y = enemys[id].y + 8;
    if (Math.abs(xRocket - enemys[j].x) > Math.abs(yRocket - enemys[j].y)) {
      enemys[j].ww = 2;
      enemys[j].hp = 1;
    } else {
      enemys[j].ww = 1;
      enemys[j].hp = 2;
    }
    if (xRocket < enemys[j].x) enemys[j].ww = -enemys[j].ww;
    if (yRocket < enemys[j].y) enemys[j].hp = -enemys[j].hp;
    break;
  }
  if (strike) {
    enemys[id].ww--;
    enemys[id].y -= 6;
    shoot = 0;
  }
  enemys[id].y++;
  return false;
}
function enemyMove8(id, hurt, strike) {
  if (!damage && hurt) damage = 40;
  enemys[id].x = enemys[id].x + enemys[id].ww;
  enemys[id].y = enemys[id].y + enemys[id].hp;
  return false;
}
function enemyMove9(id, hurt, strike) {
  if (hurt) {
    enemys[id].id = 0;
    bomb++;
  }
  enemys[id].y++;
  return false;
}
function enemyMove10(id, hurt, strike) {
  if (hurt && power < 11) {
    enemys[id].id = 0;
    power += 4;
    if (power > 10) power = 10;
  }
  enemys[id].y++;
  return false;
}
function enemyMove11(id, hurt, strike) {
  if ((strike && enemys[id].hp > 0) || enemys[id].hp < 0) {
    shoot = 0;
    if (!enemys[id].ww) {
      enemys[id].ww = 40;
      if (enemys[id].hp > 0)
        enemys[id].hp--
      else enemys[id].hp = 0;
      if (!enemys[id].hp) kEnemy = 500;
    }
  }
  if (enemys[id].ww) enemys[id].ww--;
  if (!enemys[id].hp) {
    kEnemy--;
    if (kEnemy < 100) enemys[id].y++;
  } else if (!damage && hurt) damage = 40;
  return false;
}
function enemyMove12(id, hurt, strike) {
  const bw = scene.picX(enemys[id].image.w) / 2 + 10;
  enemyMove11(id, hurt, strike);
  if (enemys[id].hp) {
    if (enemys[id].x > scene.width - bw)
      kEnemy = 0
    else if (enemys[id].x < bw) kEnemy = 1;
    if (kEnemy)
      enemys[id].x++
    else enemys[id].x--;
  }
  return false;
}
function enemyMove13(id, hurt, strike) {
  const spr = enemys[id].image;
  const bw = scene.picX(spr.w) / 2 + 10;
  const bh = scene.picY(spr.h) / 2 + 10;
  enemyMove11(id, hurt, strike);
  if (enemys[id].hp) {
    if (enemys[id].x > scene.width - bw) {
      kEnemy = 1;
      enemys[id].x -= 2;
    } else if (enemys[id].y > scene.height - bh) {
      kEnemy = 2;
      enemys[id].y -= 2;
    } else if (enemys[id].x < bw) {
      kEnemy = 3;
      enemys[id].x += 3;
    } else if (enemys[id].y < bh) {
      kEnemy = 0;
      enemys[id].y += 2;
    }
    if (!kEnemy)
      enemys[id].x += 2
    else if (kEnemy == 2) enemys[id].x -= 3;
    if (kEnemy == 1)
      enemys[id].y += 2
    else if (kEnemy == 3) enemys[id].y -= 2;
  }
  return false;
}
function enemyMove14(id, hurt, strike) {
  enemys[id].ww--;
  if (enemys[id].ww)
    enemys[id].y -= 2
  else enemys[id].id = 0;
  return false;
}
function enemyMoveOther(id, hurt, strike) {
  if (enemys[id].id < 6 && !strike && !hurt) {
    switch (enemys[id].id) {
    case 1:
      enemys[id].y += 4;
      break;
    case 2:
      if (enemys[id].y > enemys[id].hp)
        enemys[id].x = enemys[id].x - enemys[id].ww
      else enemys[id].x = enemys[id].x + enemys[id].ww;
      enemys[id].y += 3;
      break;
    case 3:
      if (!enemys[id].ww && enemys[id].y > yRocket + enemys[id].hp) {
        enemys[id].ww = enemys[id].x > xRocket ? -2 : 2;
      }
      enemys[id].x = enemys[id].x + enemys[id].ww;
      if (!enemys[id].ww)
        enemys[id].y += 2
      else enemys[id].y++;
      break;
    case 5:
      if (!randomInt(20)) {
        if (yRocket > enemys[id].y)
          enemys[id].hp = 2
        else if (yRocket < enemys[id].y)
          enemys[id].hp = -2
        else enemys[id].hp = 0;
        if (enemys[id].hp == 2)
          enemys[id].ww = 0
        else if (xRocket > enemys[id].x)
          enemys[id].ww = 2
        else if (xRocket < enemys[id].x)
          enemys[id].ww = -2
        else enemys[id].ww = 0;
        if (enemys[id].ww && enemys[id].hp == -2) enemys[id].hp = -1;
      }
      enemys[id].x += enemys[id].ww;
      enemys[id].y += enemys[id].hp;
      break;
    default:
      enemys[id].x += enemys[id].ww;
      enemys[id].y += enemys[id].hp;
    }
    return false;
  }
  return true;
}
function putEnemySprite(i) {
  if (enemys[i].id > 0) {
    if (enemys[i].id < 11)
      putSprite(enemys[i].x, enemys[i].y, enemys[i].image)
    else
    switch (enemys[i].id) {
    case 11: case 12: case 13:
      if ((enemys[i].ww & 3) == 1)
        putMono(enemys[i].x, enemys[i].y, enemys[i].image, '#FFFFFF')
      else putSprite(enemys[i].x, enemys[i].y, enemys[i].image);
      break;
    case 14:
      if (enemys[i].ww > 30)
        putSprite(enemys[i].x, enemys[i].y, enemyBitmaps[13])
      else if (enemys[i].ww > 10)
        putSprite(enemys[i].x, enemys[i].y, enemyBitmaps[14])
      else putSprite(enemys[i].x, enemys[i].y, enemyBitmaps[15]);
      break;
    }
  } else if (enemys[i].id < 0) {
  	if (enemys[i].id < -4) {
      putSprite(enemys[i].x, enemys[i].y, enemyBitmaps[13]);
  	} else if (enemys[i].id < -2)
      putSprite(enemys[i].x + 2, enemys[i].y, enemyBitmaps[14])
    else putSprite(enemys[i].x + 4, enemys[i].y, enemyBitmaps[15]);
  }
}
// return True when stage clear
function putEnemy() {
  for (let i = 0; i < 20; i++) {
    if (enemys[i].id) {
    	if (enemys[i].y < -50 || enemys[i].y > scene.height + 50 || enemys[i].x < -50 || enemys[i].x > scene.width + 50) {
  	    if (enemys[i].id < 11 || enemys[i].id > 13) {
          enemys[i].id = 0;
          continue;
        } else {
          let j = 1;
          while (j < 20 && !enemys[j].id) j++;
      		if (j == 20) {
	    	    score += enemyScores[enemys[i].id - 1] || 0;
            return life > 0;
          }
        }
      }
    }
    putEnemySprite(i);
    if (retrace) moveEnemy(i);
  }
  if (!retrace) return false;
  if (enemyDelay) {
    enemyDelay--;
  } else {
    for (i = 0; i < 20; i++) { 
      if (!enemys[i].id) {
        if (enemys[0].id >= 11)
          if (enemys[0].y < scene.height)
            if (enemys[0].hp)
              enemys[i].id = 8
            else enemys[i].id = 14
          else enemys[i].id = 0
        else {
          enemys[i].id = enemyMaps[enemyIndex];
          enemyIndex++;
        }
        if (stage == 2) switch (enemys[i].id) {
          case 1: enemys[i].id = 2; break;
          case 2: enemys[i].id = 3; break;
          case 3: enemys[i].id = 7; break;
          case 11: enemys[i].id = 12; break;
        } else if (stage == 3) switch (enemys[i].id) {
          case 1: enemys[i].id = 3; break;
          case 2: enemys[i].id = 7; break;
          case 3: enemys[i].id = 5; break;
          case 11: enemys[i].id = 13; break;
        }
        if (enemys[0].id >= 11)
          enemys[i].y = randomInt(50) + enemys[0].y
        else enemys[i].y = -scene.picY(enemys[i].image.h);
        newEnemy(i);
        break;
      }
    }
    if (i == 20)
      enemyDelay = 0
    else if (enemys[i].id == 7)
      enemyDelay = randomInt(70)
    else if (enemys[i].id == 6 || (enemys[0].id >= 11 && enemys[0].id <= 13))
      enemyDelay = randomInt(20)
    else enemyDelay = randomInt(50);
  }
  return false;
}
// state clear return True when ready
function passGame() {
  if (retrace) passDelay--;
  if (passDelay) {
    putText(scene.width / 2, 104, `เย้! ผ่านฉาก ${stage} แล้ว`, '#00CB30', '', 0, '', 'center');
    return false;
  }
  passDelay = 200;
  stage++;
  life++;
  enemys[0].id = 0;
  updateSong(song.stages[stage - 1]);
  return true;
}
function putSprite(px, py, spr, center, scale) {
  px = scene.calcX(px);
  py = scene.calcY(py);
  const w = scene.calc(spr.w) * (scale || 1.0);
  const h = scene.calc(spr.h) * (scale || 1.0);
  if (center || true) {
    px -= w / 2;
    py -= h / 2;
  }
  context.drawImage(spr, px, py, w, h);
}
function putMono(px, py, spr, color, center, scale) {
  px = scene.calcX(px);
  py = scene.calcY(py);
  const w = scene.calc(spr.w) * (scale || 1.0);
  const h = scene.calc(spr.h) * (scale || 1.0);
  if (center || true) {
    px -= w / 2;
    py -= h / 2;
  }
  context.drawImage(spr, px, py, w, h);
  context.globalCompositeOperation = 'xor';
  context.drawImage(spr, px, py, w, h);
  context.globalCompositeOperation = 'source-over';
}
function putPixel(px, py, color) {
  px = scene.calcX(px);
  py = scene.calcY(py);
  const w = scene.calc(1);
  const h = scene.calc(1);
  context.fillStyle = color;
  context.fillRect(px, py, w, h);
}
function putText(px, py, text, color, border, size, style, align) {
  if (!size) size = 13;
  style = style ? `${style} ` : '';
  size = scene.calc(size);
  context.font = `${style}${size}px Tahoma`;
  context.textAlign = align || 'left';
  context.textBaseline = 'alphabetic';
  px = scene.calcX(px);
  py = scene.calcY(py);
  if (border) {
    context.strokeStyle = border;
    context.strokeText(text, px, py);
  }
  context.fillStyle = color;
  context.fillText(text, px, py);
}
function putNumber(px, py, num, color, digit, border, size, style, align) {
  if (digit) num = String(num).padStart(digit, '0');
  putText(px, py, num, color, border, size, style, align);
}
function fillRect(x, y, w, h, color) {
  context.fillStyle = color;
  x = scene.calcX(x);
  y = scene.calcY(y);
  w = scene.calcX(w);
  h = scene.calcY(h);
  context.fillRect(x, y, w, h);
}
function randomInt(count) {
  return Math.floor(Math.random() * count);
}
function initState() {
  enemyIndex = 0;
  enemyDelay = 200;
  power = 10;
}
function updateSong(id) {
  id = id < 1 ? 1 : (id > song.count ? song.count : id);
  sound.theme.src = `audios/theme${String(id).padStart(2, '0')}.mp3`;
  sound.theme.play(true, true);
  song.last = id;
}
function updateGame() {
  drawScene();
  requestAnimFrame(updateGame);
}
function startGame() {
  if (customImage.loading)
    requestAnimFrame(startGame)
  else {
    adjustWindow();
    updateGame();
  }
}
function initData() {
  rocket.boom = 100;
  rocket.swap = rocket.move = 0;
  enemyIndex = 0;
  yStar = power = shoot = 0;
  stage = 0;
  xRocket = 0;
  yRocket = 300;
  xGun = yGun = xOld = yOld = xBoom = yBoom = 0;
  score = 0.0;
  bomb = 3;
  life = 3;
  kEnemy = 0;
  yStar = 0;
  damage = 200;
  enemyDelay = 200;
  passDelay = 200;
  titleDelay = 200;
  boom = false;
  started = true;
  showFPS = false;
  padDowned = false;
  lastPadX = lastPadY = 0;
  for (n = 0; n < 20; n++) enemys[n].id = 0;
  retrace = true;
  for (n = 0; n < scene.height; n++) putStar(); // dummy for random star
  retrace = false;
  mainTime.start();
  mainKey.clear();
}
function initGame() {
  mainFrameRate = new customFrameRate();
  mainKey = new customKey();
  mainTime = new customTime(14);
  mainSprites = new customImages(21);
  enemyBitmaps = new Array(16);
  cStars = new Array(20);
  enemys = new enemyDatas(20);
  rocket1 = mainSprites[0];
  rocket2 = mainSprites[1];
  myGun = mainSprites[2];
  touchPad = mainSprites[19];
  touchButton = mainSprites[20];
  for (n = 0; n < 16; n++) enemyBitmaps[n] = mainSprites[3 + n];
  for (let n = 0; n < mainSprites.length; n++) {
    mainSprites[n].src = 'images/sprite' + String(n).padStart(3, '0') + '.png';
    mainSprites[n].setScale(scene.picScale);
  }
  sound = {
    shot: new customAudio('audios/shot3.mp3', 0.2, 4),
    hit: new customAudio('audios/bomb4.mp3', 0.7, 4),
    kill: new customAudio('audios/bomb3.mp3', 0.5, 0),
    bomb: new customAudio('audios/bomb1.mp3', 0.5, 0),
    theme: new customAudio('audios/theme01.mp3', 0.5, 0),
  }
  initData();
}
function keyDown(e) {
  switch (e.keyCode) {
  case 112: // F1
    showFPS = !showFPS;
    break;
  case 113: // F2
    if (++song.last > song.count) song.last = 1;
    updateSong(song.last);
    break;
  case 27: // ESC
    sound.theme.stop();
    initData();
    break;
  default:
    mainKey.update(e.keyCode, true);
  }
  e.preventDefault();
}
function keyUp(e) {
  mainKey.update(e.keyCode, false);
  e.preventDefault();
}
function virtualPad(e, px, py, pressed, moved) {
  if (scene.wide) return;
  e.preventDefault();
  if (caught(px, py, touchPad, xTouchPad, yTouchPad)) {
    const tx = px - xTouchPad;
    const ty = py - yTouchPad;
    const kx = Math.abs(tx) > scene.picX(touchPad.w / 10);
    const ky = Math.abs(ty) > scene.picY(touchPad.h / 10);
    const lx = Math.abs(tx) > scene.picX(touchPad.w / 16);
    const ly = Math.abs(ty) > scene.picY(touchPad.h / 16);
    mainKey.update(37, tx < 0 && kx ? pressed : false);
    mainKey.update(39, tx > 0 && kx ? pressed : false);
    mainKey.update(38, ty < 0 && ky ? pressed : false);
    mainKey.update(40, ty > 0 && ky ? pressed : false);
    if (lx && ly) {
      if (tx < 0 && ty < 0) {
        mainKey.update(37, pressed);
        mainKey.update(38, pressed);
      } else if (tx > 0 && ty < 0) {
        mainKey.update(39, pressed);
        mainKey.update(38, pressed);
      } else if (tx < 0 && ty > 0) {
        mainKey.update(37, pressed);
        mainKey.update(40, pressed);
      } else if (tx > 0 && ty > 0) {
        mainKey.update(39, pressed);
        mainKey.update(40, pressed);
      }
    }
    padDowned = pressed;
    lastPadX = px;
    lastPadY = py;
  } else if (!pressed && caught(lastPadX, lastPadY, touchPad, xTouchPad, yTouchPad)) {
    mainKey.update(37, false);
    mainKey.update(38, false);
    mainKey.update(39, false);
    mainKey.update(40, false);
    padDowned = false;
  }
  if (!moved) {
    if (caught(px, py, touchButton, xTouchShoot, yTouchShoot)) mainKey.update(17, pressed);
    if (caught(px, py, touchButton, xTouchBomb, yTouchBomb)) mainKey.update(18, pressed);
  }
}
function pressMe(e, pressed, moved) {
  if (moved && !padDowned) return;
  const px = scene.clientX(e.clientX);
  const py = scene.clientY(e.clientY);
  virtualPad(e, px, py, pressed, moved);
}
function touchMe(e, pressed, moved) {
  for (let k in e.changedTouches) {
    const px = scene.clientX(e.changedTouches[k].clientX);
    const py = scene.clientY(e.changedTouches[k].clientY);
    virtualPad(e, px, py, pressed, moved);
  }
}
function adjustWindow() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  scene.xScale = canvas.width / scene.wScreen;
  scene.yScale = canvas.height / scene.hScreen;
  scene.scale = Math.min(scene.xScale, scene.yScale);
  scene.width = scene.wScreen - ((scene.wide = canvas.width > canvas.height) ? 100 : 0);
  scene.picScale = 0.2 * scene.yScale / scene.scale;
  for (let n = 0; n < mainSprites.length; n++) {
    mainSprites[n].setScale(scene.picScale);
  }
}
function resizeWindow() {
  adjustWindow();
  drawScene();
}
function startApp() {
  canvas = document.getElementById('main_canvas');
  context = canvas.getContext('2d');
  context.fillStyle = "#FFFF00";
  context.strokeStyle = "#000000";
  context.lineWidth = 5;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.textAlign = 'left';
  window.addEventListener('resize', resizeWindow);
  window.addEventListener('orientationchange', resizeWindow);
  canvas.addEventListener('touchstart', ()=>{ touchMe(event, true) });
  canvas.addEventListener('touchmove', ()=>{ touchMe(event, true, true) });
  canvas.addEventListener('touchend', ()=>{ touchMe(event, false) });
  canvas.addEventListener('mousedown', ()=>{ pressMe(event, true) });
  canvas.addEventListener('mousemove', ()=>{ pressMe(event, true, true) });
  canvas.addEventListener('mouseup', ()=>{ pressMe(event, false) });
  window.addEventListener('keydown', keyDown);
  window.addEventListener('keyup', keyUp);
  window.focus();
  initGame();
  startGame();
}