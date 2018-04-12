/* eslint-disable */

var Enemy = function (type) {
  var textures = [];
  this.dieTextures = [];
  this.damageTextures = [];

  this._type = type;
  this.isDead = false;
  this.hp = 1;
  this.damageHp = 1;
  this.score = 1;

  if (type != 3) {
    textures.push(Tiny.Texture.fromImage(RESOURCES[ 's_enemy' + type + '_png' ]));

    if (type == 2) {
      this.hp = 8;
      this.damageHp = 3;
      this.score = 8;
      this.damageTextures.push(Tiny.Texture.fromImage(RESOURCES[ 's_enemy' + type + '_hit_png' ]));
      this.damageTextures.push(Tiny.Texture.fromImage(RESOURCES[ 's_enemy' + type + '_png' ]));
    }
  } else {
    this.hp = 18;
    this.damageHp = 6;
    this.score = 18;
    for (var i = 1; i <= 2; i++) {
      textures.push(Tiny.Texture.fromImage(RESOURCES[ 's_enemy' + type + '_n' + i + '_png' ]));
    }
    this.damageTextures.push(Tiny.Texture.fromImage(RESOURCES[ 's_enemy' + type + '_hit_png' ]));
    this.damageTextures.push(Tiny.Texture.fromImage(RESOURCES[ 's_enemy' + type + '_n2_png' ]));
  }
  for (var i = 1; i <= (type == 3 ? 6 : 4); i++) {
    this.dieTextures.push(Tiny.Texture.fromImage(RESOURCES[ 's_enemy' + type + '_down' + i + '_png' ]));
  }

  Tiny.AnimatedSprite.call(this, textures);

  //帧帧动画速度
  this.animationSpeed = 0.12;

  this.setAnchor(0, 1);

  this.setPositionX(Tiny.random(this.width, Tiny.WIN_SIZE.width - this.width));
};

Enemy.prototype = Object.create(Tiny.AnimatedSprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.damage = function () {
  this.textures = this.damageTextures;
};

Enemy.prototype.die = function () {
  this.textures = this.dieTextures;
  this.loop = false;
  this.gotoAndPlay(0);
  this.onComplete = function () {
    this.isDead = true;
  };
  Sound.playEnemyDieSound(this._type);
  if (this._sound) {
    Sound.stopSpaceshipSound(this._sound);
    this._sound = null;
  }
  return true;
};

Enemy.prototype.update = function () {
  this.collision();
  this.position.y += this.speed;
};

Enemy.prototype.beAttacked = function () {
  this.hp--;
  if (this.hp <= 0) {
    return this.die();
  }

  if (this.hp <= this.damageHp) {
    this.damage();
  }
};

Enemy.prototype.collision = function () {
  var hero = this.parent.parent._hero;
  var heroBounds = hero.getBounds();
  heroBounds.x += 5;
  heroBounds.y += 5;
  heroBounds.height -= 5;
  heroBounds.width -= 5;
  if (Tiny.rectIntersectsRect(heroBounds, this.getBounds()) && !hero.isDead) {
    this.die();
    hero.die();
  }
};

/**
 * EnemyManager
 * @constructor
 */
var EnemyManager = function (parent) {
  this._parent = parent;
  this._enemies = [];
  this._num = 0;
};

EnemyManager.prototype.update = function () {
  this.add();

  for (var i = this._enemies.length; i--;) {
    var enemy = this._enemies[ i ];
    enemy.update();
    if (enemy.isDead) {
      this._parent._score._goal += enemy.score;
    }
    if (enemy.getPositionY() > Tiny.WIN_SIZE.height + enemy.height || enemy.isDead) {
      this._enemies.splice(i, 1);
      this._parent._container.removeChild(enemy);
    }
  }
};

EnemyManager.prototype.add = function () {
  if (this._parent._background.scrollTime % 30 != 0)
    return;

  var type = 1, maxSpeed = 1, sound = null;

  if (this._num == 26) this._num = 0;
  this._num++;

  if (this._num % 13 == 0) {
    type = 3;
    sound = Sound.playSpaceshipSound();
  } else if (this._num % 6 == 0) {
    type = 2;
    maxSpeed = 2;
  } else {
    maxSpeed = 5;
  }
  var enemy = new Enemy(type);
  enemy._sound = sound;

  var delta = this._parent.deltaTime / 1000;
  var speed = Math.random() * ((delta > 10 ? 10 : delta) - 1) + 1;
  enemy.speed = speed < 0.5 ? Math.random() * 0.5 + 0.5 : speed;
  enemy.speed = speed > maxSpeed ? maxSpeed : speed;

  this._parent._container.addChild(enemy);
  this._enemies.push(enemy);

  enemy.play();
};

EnemyManager.prototype.destroyAll = function () {
  for (var i = 0; i < this._enemies.length; i++) {
    var enemy = this._enemies[ i ];
    this._parent._container.removeChild(enemy);
  }

  this._enemies = [];
};
