import {
  play_in_tab,
  consecutively,
  simultaneously,
  sine_sound,
  triangle_sound,
  silence_sound,
  make_sound,
  get_wave,
  get_duration,
  adsr,
  midi_note_to_frequency
} from 'sound';

import {
  animate_curve,
  draw_connected_full_view,
  make_color_point
} from 'curve';

// 精修版：前奏和主旋律分轨处理，主旋律使用 MIDI 第 1 轨升八度，避免误把和弦/副旋律当主旋律。
// 运行环境：Source §3 或 §4，启用 sound 模块。

const SONG_DURATION = 50;
const BPM = 113.33;
const BEAT = 60 / BPM;

/**
 * 根据音乐当前时间生成一帧曲线画面。
 * 入参：time 为音乐播放后的秒数，t 为曲线采样位置。
 * 返回值：带颜色的 Curve。
 * 边界情况：time 超过歌曲长度时仍可生成稳定的循环画面。
 */
function syncedCurveAtTime(time) {
  return function (t) {
    const beatNumber = time / BEAT;
    const x = 2 * t - 1;
    const mainWave = 0.16 * math_sin(2 * math_PI * (4 * t + beatNumber / 8));
    const rhythmWave = 0.07 * math_sin(2 * math_PI * (16 * t - beatNumber));
    const y = mainWave + rhythmWave;
    const red = 210 + 45 * math_sin(2 * math_PI * (t + beatNumber / 16));
    const green = 90 + 100 * math_sin(2 * math_PI * (t + beatNumber / 20));
    const blue = 40 + 100 * math_sin(2 * math_PI * (t + beatNumber / 24));
    return make_color_point(x, y, red, green, blue);
  };
}

/**
 * 同时启动曲线动画和完整音乐。
 * 入参：无。
 * 返回值：undefined。
 * 边界情况：动画时长与 SONG_DURATION 保持一致，避免画面提前结束。
 */
function playCurveWithSong() {
  play_in_tab(fullSong());
  animate_curve(
    SONG_DURATION,
    30,
    draw_connected_full_view(320),
    syncedCurveAtTime
  );
  return undefined;
}

const introEvents = [
  [1.324, 73, 0.794], [2.118, 75, 0.794], [2.912, 68, 0.529], [3.441, 75, 0.794],
  [4.235, 77, 0.794], [5.029, 80, 0.132], [5.162, 78, 0.132], [5.294, 77, 0.132],
  [5.426, 73, 0.132], [5.559, 73, 0.794], [6.353, 75, 0.794], [7.147, 68, 1.588],
  [9.265, 80, 0.132], [9.397, 78, 0.132], [9.529, 77, 0.132], [9.662, 73, 0.132],
  [9.794, 73, 0.794], [10.588, 75, 0.794], [11.382, 68, 0.529], [11.912, 75, 0.794],
  [12.706, 77, 0.794], [13.500, 80, 0.132], [13.632, 78, 0.132], [13.765, 77, 0.132],
  [13.897, 73, 0.132], [14.029, 73, 0.794], [14.824, 75, 0.794], [15.618, 68, 1.588]
];

const mainEvents = [
  [18.794, 70, 0.265], [19.059, 72, 0.132], [19.324, 73, 0.265], [19.588, 73, 0.132],
  [19.853, 75, 0.265], [20.118, 70, 1.853], [22.765, 70, 0.265], [23.029, 70, 0.265],
  [23.294, 72, 0.265], [23.559, 73, 0.265], [23.823, 70, 0.265], [24.353, 68, 0.265],
  [24.618, 80, 0.265], [25.147, 80, 0.265], [25.412, 75, 1.324], [27.000, 70, 0.132],
  [27.265, 70, 0.265], [27.529, 72, 0.265], [27.794, 73, 0.132], [28.059, 70, 0.132],
  [28.323, 73, 0.265], [28.588, 75, 0.265], [29.118, 72, 0.265], [29.382, 70, 0.265],
  [29.647, 68, 1.191], [31.235, 70, 0.265], [31.500, 70, 0.265], [31.765, 72, 0.265],
  [32.029, 73, 0.132], [32.294, 70, 0.265], [32.559, 68, 0.265], [33.088, 75, 0.265],
  [33.353, 75, 0.265], [33.618, 75, 0.265], [33.882, 77, 0.265], [34.147, 75, 0.529],
  [35.206, 73, 1.324], [36.529, 75, 0.132], [36.794, 77, 0.265], [37.059, 73, 0.132],
  [37.323, 75, 0.265], [37.588, 75, 0.265], [37.853, 75, 0.265], [38.118, 77, 0.265],
  [38.382, 75, 0.529], [38.912, 68, 0.662], [40.500, 70, 0.265], [40.765, 72, 0.265],
  [41.029, 73, 0.265], [41.294, 70, 0.265], [41.823, 75, 0.265], [42.088, 77, 0.132],
  [42.353, 75, 0.397], [43.147, 68, 0.132], [43.279, 70, 0.132], [43.412, 73, 0.132],
  [43.544, 70, 0.132], [43.676, 77, 0.265], [44.073, 77, 0.397], [44.471, 75, 0.529],
  [45.265, 68, 0.132], [45.397, 70, 0.132], [45.529, 72, 0.132], [45.662, 70, 0.132],
  [45.794, 75, 0.265], [46.191, 75, 0.397], [46.588, 73, 0.529], [47.382, 68, 0.132],
  [47.515, 70, 0.132], [47.647, 73, 0.132], [47.779, 70, 0.132], [47.912, 73, 0.529],
  [48.441, 75, 0.265], [48.706, 70, 0.529], [49.235, 68, 0.265], [49.765, 68, 0.235]
];

/** 功能：返回较大值；入参：两个数字；返回值：较大数字；边界情况：相等返回第一个。 */
function maxValue(firstValue, secondValue) {
  return firstValue >= secondValue ? firstValue : secondValue;
}

/** 功能：缩放声音音量；入参：sound 声音、gain 倍率；返回值：新声音；边界情况：gain 太大可能削波。 */
function scaleSound(sound, gain) {
  const wave = get_wave(sound);
  const duration = get_duration(sound);
  return make_sound(t => gain * wave(t), duration);
}

/** 功能：生成秒级静音；入参：seconds 秒数；返回值：静音；边界情况：负数按 0 处理。 */
function restSeconds(seconds) {
  return silence_sound(maxValue(seconds, 0));
}

/** 功能：生成拍级静音；入参：beats 拍数；返回值：静音；边界情况：负数按 0 处理。 */
function rest(beats) {
  return restSeconds(beats * BEAT);
}

/** 功能：重复声音；入参：sound 声音、count 次数；返回值：串联声音；边界情况：count<=0 返回静音。 */
function repeatSound(sound, count) {
  return count <= 0 ? silence_sound(0) : consecutively(list(sound, repeatSound(sound, count - 1)));
}

/** 功能：生成前奏合成器音；入参：midi 音高、seconds 秒数；返回值：前奏音色；边界情况：短音至少 0.03 秒。 */
function introNoteSeconds(midi, seconds) {
  const duration = maxValue(seconds, 0.03);
  return adsr(0.055, 0.09, 0.54, 0.15)(simultaneously(list(
    scaleSound(triangle_sound(midi_note_to_frequency(midi), duration), 0.36),
    scaleSound(sine_sound(midi_note_to_frequency(midi + 12), duration), 0.070)
  )));
}

/** 功能：生成主旋律音；入参：midi 音高、seconds 秒数；返回值：更突出的主旋律音；边界情况：不再额外升高八度避免跑调。 */
function mainNoteSeconds(midi, seconds) {
  const duration = maxValue(seconds, 0.03);
  return adsr(0.040, 0.075, 0.62, 0.13)(simultaneously(list(
    scaleSound(triangle_sound(midi_note_to_frequency(midi), duration), 0.48),
    scaleSound(sine_sound(midi_note_to_frequency(midi), duration), 0.105)
  )));
}

/** 功能：生成柔和和弦；入参：三个 MIDI 音高和拍数；返回值：和声；边界情况：音量较低只做铺底。 */
function padChord(a, b, c, beats) {
  const duration = beats * BEAT;
  return adsr(0.20, 0.18, 0.38, 0.28)(simultaneously(list(
    scaleSound(triangle_sound(midi_note_to_frequency(a), duration), 0.090),
    scaleSound(triangle_sound(midi_note_to_frequency(b), duration), 0.072),
    scaleSound(triangle_sound(midi_note_to_frequency(c), duration), 0.060)
  )));
}

/** 功能：生成贝斯音；入参：midi 音高、beats 拍数；返回值：贝斯；边界情况：只用 sine 保持干净。 */
function bassNote(midi, beats) {
  const duration = beats * BEAT;
  return adsr(0.04, 0.10, 0.40, 0.16)(scaleSound(sine_sound(midi_note_to_frequency(midi), duration), 0.18));
}

/** 功能：生成 kick；入参：beats 拍数；返回值：鼓声；边界情况：不用噪声。 */
function kick(beats) {
  return adsr(0.02, 0.13, 0.08, 0.22)(scaleSound(sine_sound(72, beats * BEAT), 0.115));
}

/** 功能：生成 snare；入参：beats 拍数；返回值：军鼓替代音；边界情况：不用 noise。 */
function snare(beats) {
  return adsr(0.02, 0.08, 0.06, 0.25)(scaleSound(triangle_sound(190, beats * BEAT), 0.060));
}

/** 功能：生成 hi-hat；入参：beats 拍数；返回值：镲片替代音；边界情况：高频音量很低。 */
function hat(beats) {
  return adsr(0.01, 0.035, 0.03, 0.16)(scaleSound(triangle_sound(1200, beats * BEAT), 0.014));
}

/** 功能：把事件数组转为声音；入参：events、index、cursor、noteMaker；返回值：串联声音；边界情况：自动补静音到 50 秒。 */
function eventsToSound(events, index, cursor, noteMaker) {
  if (index >= array_length(events)) {
    return restSeconds(SONG_DURATION - cursor);
  } else {
    const eventData = events[index];
    const start = eventData[0];
    const midi = eventData[1];
    const duration = eventData[2];
    const gap = maxValue(start - cursor, 0);
    const nextCursor = maxValue(cursor, start + duration);
    return consecutively(list(
      restSeconds(gap),
      noteMaker(midi, duration),
      eventsToSound(events, index + 1, nextCursor, noteMaker)
    ));
  }
}

/** 功能：生成 8 拍和声循环；入参：无；返回值：和声；边界情况：只作背景。 */
function harmonyLoop() {
  return consecutively(list(
    padChord(54, 58, 61, 2), padChord(56, 60, 63, 2),
    padChord(51, 56, 60, 2), padChord(53, 58, 61, 2)
  ));
}

/** 功能：生成 4 拍贝斯循环；入参：无；返回值：贝斯；边界情况：不抢主旋律。 */
function bassLoop() {
  return consecutively(list(
    bassNote(27, 0.45), rest(0.05), bassNote(27, 0.20), rest(0.30),
    bassNote(36, 0.20), rest(0.30), bassNote(34, 0.20), rest(0.30),
    bassNote(32, 0.45), rest(0.05), bassNote(32, 0.20), rest(0.30),
    bassNote(29, 0.20), rest(0.30), bassNote(34, 0.20), rest(0.30)
  ));
}

/** 功能：生成 4 拍轻鼓循环；入参：无；返回值：鼓组；边界情况：轻音量避免杂音。 */
function drumLoop() {
  return consecutively(list(
    simultaneously(list(kick(0.35), hat(0.18))), rest(0.15), hat(0.18), rest(0.32),
    simultaneously(list(snare(0.30), hat(0.18))), rest(0.20), hat(0.18), rest(0.32),
    simultaneously(list(kick(0.35), hat(0.18))), rest(0.15), hat(0.18), rest(0.32),
    simultaneously(list(snare(0.30), hat(0.18))), rest(0.20), hat(0.18), rest(0.32)
  ));
}

/** 功能：生成前奏轨；入参：无；返回值：前奏声音；边界情况：仅覆盖前 18 秒附近。 */
function introTrack() {
  return eventsToSound(introEvents, 0, 0, introNoteSeconds);
}

/** 功能：生成主旋律轨；入参：无；返回值：主旋律；边界情况：使用 MIDI 第 1 轨升八度事件。 */
function mainTrack() {
  return eventsToSound(mainEvents, 0, 0, mainNoteSeconds);
}

/** 功能：生成和声轨；入参：无；返回值：约 50 秒和声；边界情况：循环略长不影响播放。 */
function harmonyTrack() {
  return repeatSound(harmonyLoop(), 12);
}

/** 功能：生成贝斯轨；入参：无；返回值：约 50 秒贝斯；边界情况：循环伴奏。 */
function bassTrack() {
  return repeatSound(bassLoop(), 24);
}

/** 功能：生成鼓轨；入参：无；返回值：约 50 秒鼓组；边界情况：轻音量。 */
function drumTrack() {
  return repeatSound(drumLoop(), 24);
}

/** 功能：生成完整混音；入参：无；返回值：可播放 Sound；边界情况：主旋律最大，伴奏压低。 */
function fullSong() {
  return simultaneously(list(
    scaleSound(introTrack(), 0.78),
    scaleSound(mainTrack(), 1.08),
    scaleSound(harmonyTrack(), 0.48),
    scaleSound(bassTrack(), 0.54),
    scaleSound(drumTrack(), 0.34)
  ));
}

display(array_length(mainEvents), '主旋律事件数');
playCurveWithSong();
