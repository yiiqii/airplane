/* eslint-disable */

/**
 * Score
 * @constructor
 */
var Score = function () {

  //得分
  this._goal = 0;

  Tiny.Sprite.call(this);

  this.txt = new Tiny.BitmapText('', {
    font: '36px Deeko-Comic-Regular',
    tint: 0x666666
  });

  this.txt.setPosition(100, 35);

  this.addChild(this.txt);
};

Score.prototype = Object.create(Tiny.Sprite.prototype);
Score.prototype.constructor = Score;

Score.prototype.update = function () {
  this.txt.text = this._goal;
};
