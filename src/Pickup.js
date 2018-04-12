/* eslint-disable */

var Pickup = function (type) {
  this.type = type;

  Tiny.Sprite.call(this, Tiny.Texture.fromImage(RESOURCES[ 's_ufo' + type + '_png' ]));

  this.speed = 6;
  this.ratio = 0;

  this.setAnchor(1, 1);

  this.setPositionX(Tiny.random(this.width, Tiny.WIN_SIZE.width - this.width));
};

Pickup.prototype = Object.create(Tiny.Sprite.prototype);
Pickup.prototype.constructor = Pickup;

Pickup.prototype.collision = function () {
  var hero = this.parent.parent._hero;
  if (Tiny.rectIntersectsRect(this.getBounds(), hero.getBounds())) {
    this.setScale(1 - this.ratio);
    this.gainCalculate(hero);
    this.isPickedUp = true;
  }
};

Pickup.prototype.gainCalculate = function (hero) {
  if (this.isPickedUp) return;

  switch (this.type) {
    case 1:
      Sound.playGetBombSound();
      this.parent.parent._bomb.num++;
      break;
    case 2:
      Sound.playGetDoubleSound();
      hero.power = true;
      hero.powerClock = Tiny.getTime();
      break;
  }
};

Pickup.prototype.update = function () {
  this.collision();
  this.position.y += this.speed;
};

/**
 * PickupManager
 * @constructor
 */
var PickupManager = function (parent) {
  this._parent = parent;
  this._pickups = [];
};

PickupManager.prototype.update = function () {
  this.add();

  for (var i = 0; i < this._pickups.length; i++) {
    var pickup = this._pickups[ i ];
    pickup.update();

    if (pickup.isPickedUp) {
      pickup.ratio += (1 - pickup.ratio) * 0.3;
      if (pickup.ratio > 0.99) {
        this._pickups.splice(i, 1);

        this._parent._container.removeChild(pickup);
        i--;
      }
    } else {
      if (pickup.getPositionY() > Tiny.WIN_SIZE.height + pickup.height) {
        this._pickups.splice(i, 1);
        this._parent._container.removeChild(pickup);
        i--;
      }
    }
  }
};

PickupManager.prototype.add = function () {
  if (this._parent.deltaTime != 0 && this._parent.deltaTime % 2500 == 0) {
    var pickup = new Pickup(~~(Math.random() * 1.8 + 1.1));
    this._parent._container.addChild(pickup);
    this._pickups.push(pickup);
  }

};

PickupManager.prototype.destroyAll = function () {
  for (var i = 0; i < this._pickups.length; i++) {
    var pickup = this._pickups[ i ];
    this._parent._container.removeChild(pickup);
  }

  this._pickups = [];
};
