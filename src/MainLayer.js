/* eslint-disable */

var MainLayer = function () {
  this.container = new Tiny.Container();

  Tiny.Container.call(this);

  this.container.setPosition(Tiny.WIN_SIZE.width / 2, Tiny.WIN_SIZE.height / 2);
  this.init();
};

MainLayer.prototype = Object.create(Tiny.Container.prototype);
MainLayer.prototype.constructor = MainLayer;

MainLayer.prototype.init = function () {
  this.addChild(this.container);
  this.createBackground();
  this.createLogo();
  this.createHero();
  this.createButton();
  this.createExitButton();
};

MainLayer.prototype.createBackground = function () {
  var bg = Tiny.Sprite.fromImage(RESOURCES['s_background_png']);
  bg.setAnchor(0.5);
  this.container.addChild(bg);
};

MainLayer.prototype.createLogo = function () {
  var logo = Tiny.Sprite.fromImage(RESOURCES['s_shoot_copyright_png']);
  logo.setAnchor(0.5);
  logo.setPositionY(-200);

  this.container.addChild(logo);
};

MainLayer.prototype.createHero = function () {
  var textures = [];
  for (var i = 1; i <= 3; i++) {
    textures.push(Tiny.Texture.fromImage(RESOURCES['s_game_loading' + i + '_png']));
  }
  this._hero = new Tiny.AnimatedSprite(textures);
  this._hero.animationSpeed = 0.06;
  this._hero.loop = false;
  this._hero.setAnchor(0.5);
  this._hero.setOpacity(0);

  this.container.addChild(this._hero);
};

MainLayer.prototype.heroAction = function () {
  var self = this;
  var fadeInAction = Tiny.FadeIn(300);
  fadeInAction.onComplete = function () {
    self._hero.play();
  };
  self._hero.runAction(fadeInAction);

  self._hero.onComplete = function () {
    Sound.playGameMusicSound();
    var fadeOutAction = Tiny.FadeOut(300);
    fadeOutAction.onComplete = function () {
      Tiny.app.replaceScene(new StartLayer(), 'SlideInR');
    };
    self._hero.runAction(fadeOutAction);
  };
};

MainLayer.prototype.createButton = function () {
  var style = {
    bgColor: 0xC2C7CA,
    borderColor: 0x5E6261,
    fill: 0x5E6261
  };
  var self = this;
  var button = Tiny.NormalButton('开始', style, function () {
    Sound.playButtonSound();
    self.heroAction();
  });
  button.setPosition(-button.width / 2, 100);

  this.container.addChild(button);
};

MainLayer.prototype.createExitButton = function () {
  var style = {
    bgColor: 0xC2C7CA,
    borderColor: 0x5E6261,
    fill: 0x5E6261
  };
  var button = Tiny.NormalButton('返回', style, function () {
    Sound.playButtonSound();
    window.AlipayJSBridge && AlipayJSBridge.call('closeWebview');
  });
  button.setPosition(-button.width / 2, 180);

  this.container.addChild(button);
};
