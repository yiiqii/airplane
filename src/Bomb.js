/* eslint-disable */

var Bomb = function (parent) {
  Tiny.Sprite.call(this, Tiny.Texture.fromImage(RESOURCES[ 's_bomb_png' ]));

  this._parent = parent;
  this.num = 0;

  this.setAnchor(0, 1);
  this.setPosition(10, Tiny.WIN_SIZE.height - 60);
  this.setVisible(false);
  this.setEventEnabled(true);

  this.txt = new Tiny.BitmapText('', {
    font: '24px Deeko-Comic-Regular',
    tint: 0x666666
  });

  this.txt.setPosition(this.width + 10, this.height / 2 - 60);

  this.addChild(this.txt);
};

Bomb.prototype = Object.create(Tiny.Sprite.prototype);
Bomb.prototype.constructor = Bomb;

Bomb.prototype.update = function () {
  if (this.num > 0) {
    this.setVisible(true);
    this.txt.text = 'X ' + this.num;
  } else {
    this.setVisible(false);
  }
};

Bomb.prototype.use = function () {
  if (this.num <= 0 || !this._parent.getStart()) return;
  this.num--;

  Sound.playUseBombSound();
  var enemies = this._parent._enemyManager._enemies;
  for (var i = enemies.length; i--;) {
    enemies[ i ].die();
  }
};

Bomb.prototype.tap = Bomb.prototype.mouseup = function () {
  this.use();
};
