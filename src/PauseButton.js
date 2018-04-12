/* eslint-disable */

var PauseButton = function () {
  this.pauseTexture = Tiny.Texture.fromImage(RESOURCES[ 's_game_pause_nor_png' ]);
  this.pressPauseTexture = Tiny.Texture.fromImage(RESOURCES[ 's_game_pause_pressed_png' ]);
  this.resumeTexture = Tiny.Texture.fromImage(RESOURCES[ 's_game_resume_nor_png' ]);
  this.pressResumeTexture = Tiny.Texture.fromImage(RESOURCES[ 's_game_resume_pressed_png' ]);

  this._pause = false;

  Tiny.Sprite.call(this, this.pauseTexture);

  this.setPosition(20);
  this.setEventEnabled(true);
};

PauseButton.prototype = Object.create(Tiny.Sprite.prototype);
PauseButton.prototype.constructor = PauseButton;

PauseButton.prototype.mousedown = PauseButton.prototype.touchstart = function () {
  this.texture = this._pause ? this.pressResumeTexture : this.pressPauseTexture;
};

PauseButton.prototype.mouseup = PauseButton.prototype.mouseupoutside = PauseButton.prototype.touchend = PauseButton.prototype.touchendoutside = function () {
  this.texture = this._pause ? this.resumeTexture : this.pauseTexture;
};

PauseButton.prototype.tap = PauseButton.prototype.mouseup = function () {
  Sound.playButtonSound();
  this._pause = !this._pause;

  this.texture = this._pause ? this.resumeTexture : this.pauseTexture;

  this.parent.setStart(!this._pause);
};

