/* eslint-disable */

var GameOver = function () {
  Tiny.Sprite.call(this);

  this.container = new Tiny.Container();
  this.container.setOpacity(0);
  this.container.setPosition(Tiny.WIN_SIZE.width / 2, Tiny.WIN_SIZE.height + this.container.height);
  this.addChild(this.container);

  this.createPanel();
  this.createTitle();
  this.createScore();
  this.createHero();
  this.createButton('返回', true);
  this.createButton('重新游戏');


  var moveUpAction = Tiny.MoveTo(1000, { y: Tiny.WIN_SIZE.height / 2 });
  var fadeInAction = Tiny.FadeIn(600);
  moveUpAction.setEasing(Tiny.TWEEN.Easing.Quintic.Out);
  this.container.runAction(moveUpAction, fadeInAction);
};

GameOver.prototype = Object.create(Tiny.Sprite.prototype);
GameOver.prototype.constructor = GameOver;

GameOver.prototype.createPanel = function () {
  var g = new Tiny.Graphics();
  g.beginFill(0xD8DDE0);
  g.lineStyle(3, 0x5E6261, 1);
  g.drawRoundedRect(0, 0, 420, 380, 10);
  g.endFill();
  g.setPosition(-g.width / 2, -g.height / 2);

  this.container.addChild(g);
};

GameOver.prototype.createTitle = function () {
  var title = new Tiny.Text('得分', {
    fontSize: 20,
    fontFamily: 'Arial',
    fill: 0x5E6261
  });
  title.setAnchor(0.5, 1);
  title.setPositionY(10);

  this.container.addChild(title);
};

GameOver.prototype.createScore = function () {
  var score = Util.storage.get('AIRPLANE_SCORE');
  var title = new Tiny.BitmapText(score, {
    font: '36px Deeko-Comic-Regular',
    tint: 0x5E6261
  });
  title.setPivot(0.5, 0);
  title.setPosition(-title.width / 2, 40);

  this.container.addChild(title);
};

GameOver.prototype.createHero = function () {
  var textures = [];
  for (var i = 1; i <= 2; i++) {
    textures.push(Tiny.Texture.fromImage(RESOURCES[ 's_hero' + i + '_png' ]));
  }
  var hero = new Tiny.AnimatedSprite(textures);
  hero.animationSpeed = 0.12;
  hero.setAnchor(0.5, 1);
  hero.setPositionY(-30);

  this.container.addChild(hero);
  hero.play();
};

GameOver.prototype.createButton = function (value, left) {
  var c = new Tiny.Container();

  var g = new Tiny.Graphics();
  g.beginFill(0xC2C7CA);
  g.lineStyle(3, 0x5E6261, 1);
  g.drawRoundedRect(0, 0, 180, 48, 23.9);
  g.endFill();

  var label = new Tiny.Text(value, {
    fontSize: 24,
    fontFamily: 'Arial',
    fill: 0x5E6261
  });
  label.setPosition((g.width - label.width - 6) / 2, (g.height - label.height - 6) / 2);

  c.addChild(g);
  c.addChild(label);

  c.setPivot(left ? 1 : 0, 0);
  c.setPosition(left ? -188 : 0, 120);

  c.setEventEnabled(true);
  c.mouseup = c.tap = function () {
    Sound.playButtonSound();
    if (left) {
      window.AlipayJSBridge && window.AlipayJSBridge.call('closeWebview');
    } else {
      Sound.playGameMusicSound();
      Tiny.app.replaceScene(new StartLayer(), 'Fade');
    }
  };

  this.container.addChild(c);
};
