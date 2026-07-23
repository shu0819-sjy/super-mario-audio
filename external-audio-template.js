import {
  create_audio,
  loop_audio,
  play_audio,
  stop_audio
} from 'arcade_2d';

const audioBaseUrl =
  'https://raw.githubusercontent.com/shu0819-sjy/super-mario-audio/master/audio/';

const backgroundMusic = loop_audio(
  create_audio(audioBaseUrl + 'super-mario-theme.mp3', 0.35)
);
const jumpAudio = create_audio(audioBaseUrl + 'jump.wav', 0.8);
const stompAudio = create_audio(audioBaseUrl + 'stomp.wav', 0.8);
const coinAudio = create_audio(audioBaseUrl + 'coin.wav', 0.8);
const powerUpAudio = create_audio(audioBaseUrl + 'power-up.wav', 0.8);
const hurtAudio = create_audio(audioBaseUrl + 'hurt.wav', 0.8);

let backgroundMusicPlaying = false;

/** 功能：开始循环背景音乐。入参：无。返回值：undefined。边界：重复调用不会重复播放。 */
function startExternalBackgroundMusic() {
  if (!backgroundMusicPlaying) {
    play_audio(backgroundMusic);
    backgroundMusicPlaying = true;
  }
  return undefined;
}

/** 功能：停止背景音乐。入参：无。返回值：undefined。边界：未播放时不执行停止操作。 */
function stopExternalBackgroundMusic() {
  if (backgroundMusicPlaying) {
    stop_audio(backgroundMusic);
    backgroundMusicPlaying = false;
  }
  return undefined;
}

// 事件发生时调用：play_audio(jumpAudio)、play_audio(stompAudio) 等。
