/* eslint-disable */

/**
 * Hero
 * @constructor
 */
var Hero = function () {
  this.textures = [];
  this.dieTextures = [];
  for (var i = 1; i <= 2; i++) {
    this.textures.push(Tiny.Texture.fromImage(RESOURCES['s_hero' + i + '_png']));
  }

  for (var i = 1; i <= 4; i++) {
    this.dieTextures.push(Tiny.Texture.fromImage(RESOURCES['s_hero_blowup_n' + i + '_png']));
  }

  Tiny.AnimatedSprite.call(this, this.textures);

  //帧帧动画速度
  this.animationSpeed = 0.12;

  this.isDead = false;
  this.cartridges = [];
  this.power = false;
  this.powerClock = 0;
  this.attackTime = 0;

  this.setAnchor(0.5);
  this.setPosition(Tiny.WIN_SIZE.width / 2, Tiny.WIN_SIZE.height - this.height / 2);

  this.play();
  this.setEventEnabled(true);
  this.bindDrag();
};

Hero.prototype = Object.create(Tiny.AnimatedSprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.die = function () {
  this.isDead = true;
  this.textures = this.dieTextures;
  this.loop = false;
  this.onComplete = function () {
    this.parent.gameOver();
  };
};

Hero.prototype.bindDrag = function () {
  var heroHalfWidth = this.width / 2,
    heroHalfHeight = this.height / 2;
  this.mousedown = this.touchstart = function (data) {
    data.stopPropagation();
    this.data = data;
    this.dragging = true;
  };

  this.mouseup = this.mouseupoutside = this.touchend = this.touchendoutside = function (data) {
    this.dragging = false;
    this.data = null;
  };

  this.mousemove = this.touchmove = function (data) {
    if (this.isDead || !this.parent.getStart()) return;

    if (this.dragging && this.data) {
      var newPos = this.data.data.getLocalPosition(this.parent);

      newPos.x = newPos.x < heroHalfWidth ? heroHalfWidth : newPos.x;
      newPos.x = newPos.x > Tiny.WIN_SIZE.width - heroHalfWidth ? Tiny.WIN_SIZE.width - heroHalfWidth : newPos.x;
      newPos.y = newPos.y < heroHalfHeight ? heroHalfHeight : newPos.y;
      newPos.y = newPos.y > Tiny.WIN_SIZE.height - heroHalfHeight ? Tiny.WIN_SIZE.height - heroHalfHeight : newPos.y;
      this.setPosition(newPos.x, newPos.y);
    }
  }
};

Hero.prototype.createCartridge = function (x, y) {
  this.attackTime++;
  if (this.attackTime % 14 != 0) {
    return;
  }

  this.attackTime = 0;

  if (this.power) {
    for (var i = 0; i < 2; i++) {
      var c = Tiny.Sprite.fromImage(RESOURCES['s_bullet2_png']);
      var w = this.width / 4 + 6;
      i % 2 == 0 ? x += w : x -= 2 * w;
      c.setPosition(x, y + 20);
      c.setAnchor(0.5);
      this.cartridges.push(c);
      this.parent._container.addChild(c);
    }
    Sound.playDoubleBulletSound();
  } else {
    var c = Tiny.Sprite.fromImage(RESOURCES['s_bullet1_png']);
    c.setPosition(x, y - 20);
    this.cartridges.push(c);
    this.parent._container.addChild(c);
    Sound.playBulletSound();
  }
};

Hero.prototype.attacking = function (parent) {
  if (new Date().getTime() - this.powerClock >= 15000) {
    this.power = false;
  }
  this.createCartridge(this.x - 3, this.y - this.height / 2);

  var speed = 10;
  for (var i = this.cartridges.length; i--;) {
    var c = this.cartridges[i];

    if (c.getPositionY() <= 0) {
      this.cartridges.splice(i, 1);
      parent._container.removeChild(c);
      continue;
    }

    for (var j = parent._enemyManager._enemies.length; j--;) {
      var enemy = parent._enemyManager._enemies[j];
      if (i != this.cartridges.length - 1 && enemy.hp != 0 && Tiny.rectIntersectsRect(c.getBounds(), enemy.getBounds())) {
        this.cartridges.splice(i, 1);
        parent._container.removeChild(c);

        enemy.beAttacked();
      }
    }

    c.position.y -= speed;
  }
};

