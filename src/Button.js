/* eslint-disable */

Tiny.Button = function (type, callback) {
  //Tiny.Sprite.call(this);

  /**
   * 0: normal
   * 1: textOnly
   * 2: image
   *
   * @type {*}
   * @private
   */
  this._type = type;
  this._callback = callback;

  this._style = {
    borderColor: 0x000000,
    border: 3,
    width: 180,
    height: 48,
    radius: 23.9,
    fontSize: 24,
    fontFamily: 'Arial',
    fill: 0x000000
  };
};

Tiny.Button.prototype.constructor = Tiny.Button;

Tiny.Button.prototype.create = function (value, style) {
  Object.assign(style, this._style);

  var container = new Tiny.Container();
  container.setEventEnabled(true);

  if (!this._type) {
    var g = new Tiny.Graphics();
    g.beginFill(style.bgColor);
    g.lineStyle(style.border, style.borderColor, 1);
    g.drawRoundedRect(0, 0, style.width, style.height, style.radius);
    g.endFill();

    container.addChild(g);
  }

  var label = new Tiny.Text(value, {
    font: style.font,
    fill: style.fill
  });
  label.setPosition((g.width - label.width - style.border * 2) / 2, (g.height - label.height - style.border * 2) / 2);

  container.addChild(label);
  container.mousedown = container.touchstart = function () {
    this.setOpacity(0.5);
  };

  container.mouseup = container.mouseupoutside = container.touchend = container.touchendoutside = function () {
    this.setOpacity(1);
  };
  var self = this;
  container.mouseup = container.tap = function () {
    if (Tiny.isFunction(self._callback))
      self._callback();
  };

  return container;
};

Tiny.Button.prototype.createImage = function (image, pressImage) {
  var button = Tiny.Sprite.fromImage(image);
  button.setEventEnabled(true);
  button.mousedown = button.touchstart = function () {
    this.texture = Tiny.Texture.fromImage(pressImage);
  };

  button.mouseup = button.mouseupoutside = button.touchend = button.touchendoutside = function () {
    this.texture = Tiny.Texture.fromImage(image);
  };
  var self = this;
  button.mouseup = button.tap = function () {
    if (Tiny.isFunction(self._callback))
      self._callback();
  };
  return button;
};

Tiny.NormalButton = function (value, style, callback) {
  return new Tiny.Button(0, callback).create(value, style);
};

Tiny.TextButton = function (value, style, callback) {
  return new Tiny.Button(1, callback).create(value, style);
};

Tiny.ImageButton = function (image, pressImage, callback) {
  return new Tiny.Button(2, callback).createImage(image, pressImage);
};
