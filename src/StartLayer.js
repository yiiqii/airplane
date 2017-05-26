/* eslint-disable */

var StartLayer = function () {
  this._start = false;
  this.deltaTime = 0;

  this._container = new Tiny.Container();

  //背景
  this._background = new Background();

  //Hero
  this._hero = new Hero();

  //炸弹
  this._bomb = new Bomb(this);

  //得分
  this._score = new Score();

  this._btn = new PauseButton();

  //敌机
  this._enemyManager = new EnemyManager(this);

  //空投
  this._pickupManager = new PickupManager(this);

  Tiny.Container.call(this);

  this.interactive = true;
  this.init();
};
StartLayer.prototype = Object.create(Tiny.Container.prototype);
StartLayer.prototype.constructor = StartLayer;

StartLayer.prototype.init = function () {
  this.addChild(this._background);
  this.addChild(this._hero);
  this.addChild(this._container);
  this.addChild(this._bomb);
  this.addChild(this._score);
  this.addChild(this._btn);

  this._start = true;
};

//OVERWRITE
StartLayer.prototype.updateTransform = function () {
  if (this._start) {
    this._background.update();
    this._pickupManager.update();

    this._hero.attacking(this);
    this._bomb.update();
    this._score.update();

    if (this.deltaTime > 200) {
      this._enemyManager.update();
    }

    this.deltaTime++;
  }

  this.containerUpdateTransform();
};

StartLayer.prototype.gameOver = function () {
  console.log('--- game over ---');
  Sound.stopAll();
  Sound.playGameOverSound();

  this._start = false;
  this._hero.setVisible(false);
  this._btn.setVisible(false);
  this._score.setVisible(false);

  Util.storage.set('AIRPLANE_SCORE', this._score._goal);
  this._gameOver = new GameOver();
  this.addChild(this._gameOver);
};

StartLayer.prototype.setStart = function (start) {
  this._start = start;
};

StartLayer.prototype.getStart = function () {
  return this._start;
};
