/* eslint-disable */

var Background = function () {
  Tiny.Container.call(this);

  this.bg = new Background.createSprite(Tiny.Texture.fromImage(RESOURCES[ 's_background_png' ]), this);
  this.preTime = Tiny.getTime();

  this.scrollTime = 0;

  this.bg.speed = 1 / 2;
};

Background.prototype = Object.create(Tiny.Container.prototype);
Background.prototype.constructor = Background;

Background.prototype.update = function () {
  if (this._pause) return;
  this.scrollTime += 0.5;
  if (this.scrollTime > Tiny.WIN_SIZE.height) this.scrollTime = 0;

  this.scrollPosition = (Tiny.getTime() - this.preTime) / 10 + 4000;

  this.bg.setPosition(this.scrollPosition);
};

Background.createSprite = function (texture, owner) {
  this.sprites = [];
  this.spriteHeight = texture.height;

  for (var i = 0; i < 3; i++) {
    var sprite = new Tiny.Sprite(texture);
    owner.addChild(sprite);
    this.sprites.push(sprite);
  }
};

Background.createSprite.prototype.setPosition = function (position) {
  var h = this.spriteHeight;

  for (var i = 0; i < this.sprites.length; i++) {
    var pos = -position * this.speed;
    pos += i * h;
    pos %= h * this.sprites.length;
    pos += h * 2;

    this.sprites[ i ].setPositionY(-Math.floor(pos));
  }
};
