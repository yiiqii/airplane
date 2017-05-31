/* eslint-disable */

function Sound() {
}

Sound._musics = [];

Sound.playSfx = function (sfx) {
  var audio = Tiny.audio.manager.getAudio(sfx);
  audio.play();
};

Sound.playMusic = function (m) {
  var music = Tiny.audio.manager.getAudio(m);
  ;
  music.loop = true;
  music.play();
  return music;
};

Sound.playButtonSound = function () {
  this.playSfx(RESOURCES['s_button_ogg']);
};

Sound.playEnemyDieSound = function (num) {
  this.playSfx(RESOURCES['s_enemy' + num + '_down_ogg']);
};

Sound.playBulletSound = function () {
  this.playSfx(RESOURCES['s_bullet_ogg']);
};

Sound.playDoubleBulletSound = function () {
  this.playSfx(RESOURCES['s_out_porp_ogg']);
};

Sound.playUseBombSound = function () {
  this.playSfx(RESOURCES['s_use_bomb_ogg']);
};

Sound.playGetBombSound = function () {
  this.playSfx(RESOURCES['s_get_bomb_ogg']);
};

Sound.playGetDoubleSound = function () {
  this.playSfx(RESOURCES['s_get_double_laser_ogg']);
};

Sound.playGameOverSound = function () {
  this.playSfx(RESOURCES['s_game_over_ogg']);
};

Sound.playGameMusicSound = function () {
  Sound._gameMusic = this.playMusic(RESOURCES['s_game_music_ogg']);
  return Sound._gameMusic;
};

Sound.stopGameMusicSound = function () {
  Sound._gameMusic.stop(RESOURCES['s_game_music_ogg']);
};

Sound.playSpaceshipSound = function () {
  var o = this.playMusic(RESOURCES['s_big_spaceship_flying_ogg']);
  Sound._musics.push(o);
  return o;
};

Sound.stopSpaceshipSound = function (object) {
  object.stop(RESOURCES['s_big_spaceship_flying_ogg']);
  Sound._musics.forEach(function (m, i) {
    if (m == object) Sound._musics.splice(i, 1);
  });
};

Sound.stopAll = function () {
  Sound.stopGameMusicSound();
  Sound._musics.forEach(function (m, i) {
    Sound._musics.splice(i, 1);
    Sound.stopSpaceshipSound(m);
  });
};

