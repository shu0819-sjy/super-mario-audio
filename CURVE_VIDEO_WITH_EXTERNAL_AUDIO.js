import {
  create_audio,
  play_audio
} from 'arcade_2d';

import {
  animate_curve,
  draw_connected_full_view,
  make_color_point
} from 'curve';

const VIDEO_DURATION = 50;
const VIDEO_FPS = 30;
const AUDIO_URL = 'https://raw.githubusercontent.com/shu0819-sjy/super-mario-audio/main/audio/never-gonna-give-you-up-synth-50s.wav';
const audioTrack = create_audio(AUDIO_URL, 0.85);
let animationTime = 0;

/**
 * 生成视频中的同步曲线画面。
 * 入参：t 为曲线采样位置，范围为 0 到 1。
 * 返回值：带颜色的 Curve 点。
 * 边界情况：动画时间超出歌曲长度时仍保持循环运动。
 */
function videoCurve(t) {
  const pulse = 0.08 + 0.045 * (1 + math_sin(2 * math_PI * animationTime * 2));
  const waveA = 0.20 * math_sin(2 * math_PI * (3 * t + animationTime / 4));
  const waveB = pulse * math_sin(2 * math_PI * (18 * t - animationTime * 2));
  const x = 2 * t - 1;
  const y = waveA + waveB;
  const red = 210 + 45 * math_sin(2 * math_PI * (t + animationTime / 8));
  const green = 80 + 110 * math_sin(2 * math_PI * (t + animationTime / 10));
  const blue = 35 + 120 * math_sin(2 * math_PI * (t + animationTime / 12));
  return make_color_point(x, y, red, green, blue);
}

/**
 * 接收 animate_curve 的时间并返回命名曲线函数。
 * 入参：time 为动画当前时间，单位为秒。
 * 返回值：当前帧使用的 Curve 函数。
 * 边界情况：不创建匿名函数，兼容 Source §3。
 */
function videoFrameAtTime(time) {
  animationTime = time;
  return videoCurve;
}

/**
 * 同时启动外部 WAV 和 curve 视频动画。
 * 入参：无。
 * 返回值：undefined。
 * 边界情况：音频和动画使用相同的 50 秒时长。
 */
function playVideoWithAudio() {
  play_audio(audioTrack);
  animate_curve(
    VIDEO_DURATION,
    VIDEO_FPS,
    draw_connected_full_view(500),
    videoFrameAtTime
  );
  return undefined;
}

playVideoWithAudio();
