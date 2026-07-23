import {
  create_rectangle,
  create_circle,
  create_sprite,
  create_text,
  update_position,
  update_color,
  update_text,
  update_scale,
  query_position,
  input_key_down,
  update_loop,
  build_game,
  set_fps,
  set_scale,
  get_loop_count
} from 'arcade_2d';

import {
  play,
  play_in_tab,
  stop,
  consecutively,
  simultaneously,
  silence_sound,
  sine_sound,
  square_sound,
  triangle_sound,
  noise_sound,
  piano,
  make_sound,
  get_wave,
  get_duration,
  adsr,
  midi_note_to_frequency
} from 'sound';


// ===== 背景音乐代码 =====
const BPM = 260;
const BEAT = 60 / BPM;
const THEME_REST = 0;
const NOTE_RATIO = 0.82;

// 每两个数字依次表示 MIDI 音高和原始的十二分音符时值。
const part1 = [
  76, 12, 76, 12, THEME_REST, 12, 76, 12, THEME_REST, 12, 72, 12,
  76, 12, THEME_REST, 12, 79, 12, THEME_REST, 36, 67, 12, THEME_REST, 36
];

const part2 = [
  72, 12, THEME_REST, 24, 67, 12, THEME_REST, 24, 64, 12, THEME_REST, 24,
  69, 12, THEME_REST, 12, 71, 12, THEME_REST, 12, 70, 12, 69, 12,
  THEME_REST, 12, 67, 16, 76, 16, 79, 16, 81, 12, THEME_REST, 12,
  77, 12, 79, 12, THEME_REST, 12, 76, 12, THEME_REST, 12, 72, 12,
  74, 12, 71, 12, THEME_REST, 24
];

const part3 = [
  48, 12, THEME_REST, 12, 79, 12, 78, 12, 77, 12, 75, 12,
  60, 12, 76, 12, 53, 12, 68, 12, 69, 12, 72, 12,
  60, 12, 69, 12, 72, 12, 74, 12, 48, 12, THEME_REST, 12,
  79, 12, 78, 12, 77, 12, 75, 12, 55, 12, 76, 12,
  THEME_REST, 12, 84, 12, THEME_REST, 12, 84, 12, 84, 12
];

const part4 = [
  55, 12, THEME_REST, 12, 48, 12, THEME_REST, 12, 79, 12, 78, 12,
  77, 12, 75, 12, 60, 12, 76, 12, 53, 12, 68, 12,
  69, 12, 72, 12, 60, 12, 69, 12, 72, 12, 74, 12,
  48, 12, THEME_REST, 12, 75, 24, THEME_REST, 12, 74, 24, THEME_REST, 12,
  72, 24, THEME_REST, 12, 55, 12, 55, 12, THEME_REST, 12, 48, 12
];

const part5 = [
  72, 12, 72, 12, THEME_REST, 12, 72, 12, THEME_REST, 12, 72, 12,
  74, 12, THEME_REST, 12, 76, 12, 72, 12, THEME_REST, 12, 69, 12,
  67, 12, THEME_REST, 12, 43, 12, THEME_REST, 12, 72, 12, 72, 12,
  THEME_REST, 12, 72, 12, THEME_REST, 12, 72, 12, 74, 12, 76, 12,
  55, 12, THEME_REST, 24, 48, 12, THEME_REST, 24, 43, 12, THEME_REST, 12,
  72, 12, 72, 12, THEME_REST, 12, 72, 12, THEME_REST, 12, 72, 12,
  74, 12, THEME_REST, 12, 76, 12, 72, 12, THEME_REST, 12, 69, 12,
  67, 12, THEME_REST, 12, 43, 12, THEME_REST, 12, 76, 12, 76, 12,
  THEME_REST, 12, 76, 12, THEME_REST, 12, 72, 12, 76, 12, THEME_REST, 12,
  79, 12, THEME_REST, 36, 67, 12, THEME_REST, 36
];

const part6 = [
  76, 12, 72, 12, THEME_REST, 12, 67, 12, 55, 12, THEME_REST, 12,
  68, 12, THEME_REST, 12, 69, 12, 77, 12, 53, 12, 77, 12,
  69, 12, 60, 12, 53, 12, THEME_REST, 12, 71, 16, 81, 16,
  81, 16, 81, 16, 79, 16, 77, 16, 76, 12, 72, 12,
  55, 12, 69, 12, 67, 12, 60, 12, 55, 12, THEME_REST, 12,
  76, 12, 72, 12, THEME_REST, 12, 67, 12, 55, 12, THEME_REST, 12,
  68, 12, THEME_REST, 12, 69, 12, 77, 12, 53, 12, 77, 12,
  69, 12, 60, 12, 53, 12, THEME_REST, 12, 71, 12, 77, 12,
  THEME_REST, 12, 77, 12, 77, 16, 76, 16, 74, 16, 72, 12,
  64, 12, 55, 12, 64, 12, 60, 12, THEME_REST, 36
];

const part7 = [
  72, 12, THEME_REST, 24, 67, 12, THEME_REST, 24, 64, 24, 69, 16,
  71, 16, 69, 16, 68, 24, 70, 24, 68, 24, 67, 12,
  65, 12, 67, 48
];

/**
 * 功能：按增益缩放 Sound 的波形。
 * 入参：sound 为输入声音，gain 为振幅倍率。
 * 返回值：持续时间不变、振幅缩放后的 Sound。
 * 边界情况：gain 为 0 时得到静音，负数会反相波形。
 */
function themeScaleSound(sound, gain) {
  const wave = get_wave(sound);
  const duration = get_duration(sound);
  return make_sound(t => gain * wave(t), duration);
}

/**
 * 功能：把一个 MIDI 音符生成 NES 风格的短音符。
 * 入参：midi 为 MIDI 音高，duration 为秒数。
 * 返回值：带方波主音、三角波泛音和 ADSR 包络的 Sound。
 * 边界情况：midi 为 THEME_REST 时返回同样长度的静音。
 */
function noteSound(midi, duration, gain) {
  if (midi === THEME_REST) {
    return silence_sound(duration);
  }

  const frequency = midi_note_to_frequency(midi);
  const playedDuration = duration * NOTE_RATIO;
  const mainWave = themeScaleSound(
    square_sound(frequency, playedDuration),
    0.42 * gain
  );
  const pianoWave = themeScaleSound(
    piano(midi, playedDuration),
    0.12 * gain
  );
  const overtone = themeScaleSound(
    triangle_sound(midi_note_to_frequency(midi + 12), playedDuration),
    0.04 * gain
  );

  const note = adsr(0.03, 0.08, 0.7, 0.16)(
    simultaneously(list(mainWave, pianoWave, overtone))
  );

  return consecutively(list(
    note,
    silence_sound(duration - playedDuration)
  ));
}

/**
 * 功能：把扁平的 MIDI 音符数组转换为连续 Sound。
 * 入参：data 为音高和时值交替数组，index 为当前读取下标。
 * 返回值：从 index 开始的完整连续声音。
 * 边界情况：下标越过数组末尾时返回零秒静音；不完整尾项会被忽略。
 */
function themeEventsToSound(data, index, gain) {
  if (index + 1 >= array_length(data)) {
    return silence_sound(0);
  }

  const midi = data[index];
  const ticks = data[index + 1];
  const duration = ticks / 12 * BEAT;

  return consecutively(list(
    noteSound(midi, duration, gain),
    themeEventsToSound(data, index + 2, gain)
  ));
}

/**
 * 功能：把一个 MIDI 段落转换成 Sound。
 * 入参：data 为一个完整乐段的扁平音符数组。
 * 返回值：该乐段对应的连续 Sound。
 * 边界情况：空数组返回零秒静音。
 */
function sectionSound(data, gain) {
  return themeEventsToSound(data, 0, gain);
}

/**
 * 功能：重复播放同一个 Sound。
 * 入参：sound 为待重复声音，count 为重复次数。
 * 返回值：重复连接后的 Sound。
 * 边界情况：count 小于等于 0 时返回零秒静音。
 */
function repeatSound(sound, count) {
  if (count <= 0) {
    return silence_sound(0);
  }

  return consecutively(list(
    sound,
    repeatSound(sound, count - 1)
  ));
}

/**
 * 功能：生成一组三和弦钢琴低音伴奏。
 * 入参：firstMidi、secondMidi、thirdMidi 为三个 MIDI 音高，
 * beats 为和弦持续拍数。
 * 返回值：带钢琴和三角波音色的和弦 Sound。
 * 边界情况：beats 小于等于 0 时返回零秒声音。
 */
function chordSound(firstMidi, secondMidi, thirdMidi, beats) {
  const duration = beats <= 0 ? 0 : beats * BEAT;
  const first = themeScaleSound(piano(firstMidi, duration), 0.2);
  const second = themeScaleSound(piano(secondMidi, duration), 0.14);
  const bass = themeScaleSound(
    triangle_sound(midi_note_to_frequency(thirdMidi), duration),
    0.25
  );

  return adsr(0.08, 0.12, 0.5, 0.2)(
    simultaneously(list(first, second, bass))
  );
}

/**
 * 功能：生成完整的和弦伴奏循环。
 * 入参：无。
 * 返回值：四个和弦组成的循环 Sound。
 * 边界情况：每个和弦固定为两拍，不会产生无限循环。
 */
function harmonyLoop() {
  return consecutively(list(
    chordSound(48, 52, 55, 2),
    chordSound(43, 47, 50, 2),
    chordSound(45, 48, 52, 2),
    chordSound(40, 43, 47, 2)
  ));
}

/**
 * 功能：按照公开曲谱标注的段落顺序拼接完整主题。
 * 入参：无。
 * 返回值：完整的 Super Mario Bros 主世界主题 Sound。
 * 边界情况：第三、第四乐段长度不同步时，以同时播放结果的最长时长为准。
 */
function mainTheme() {
  const first = sectionSound(part1, 1.0);
  const second = sectionSound(part2, 1.0);
  const third = sectionSound(part3, 0.55);
  const fourth = sectionSound(part4, 0.55);
  const fifth = sectionSound(part5, 1.0);
  const sixth = sectionSound(part6, 0.65);
  const seventh = sectionSound(part7, 1.0);
  const thirdAndFourth = simultaneously(list(third, fourth));

  return consecutively(list(
    first,
    repeatSound(second, 2),
    repeatSound(thirdAndFourth, 2),
    fifth,
    repeatSound(second, 2),
    repeatSound(sixth, 2),
    fifth,
    sixth,
    seventh
  ));
}

/**
 * 功能：把完整旋律和循环伴奏混合后播放。
 * 入参：无。
 * 返回值：最终播放的 Sound。
 * 边界情况：伴奏比旋律短时自动结束，旋律不会被截断。
 */
function fullSong() {
  return simultaneously(list(
    mainTheme(),
    repeatSound(harmonyLoop(), 18)
  ));
}

// ===== 游戏音效代码 =====
const SFX_REST = 0;

/**
 * 功能：缩放声音振幅。
 * 入参：sound 为输入声音，gain 为增益倍率。
 * 返回值：持续时间不变、振幅缩放后的 Sound。
 * 边界情况：gain 为 0 时返回静音，负数会反相波形。
 */
function sfxScaleSound(sound, gain) {
  const wave = get_wave(sound);
  const duration = get_duration(sound);
  return make_sound(t => gain * wave(t), duration);
}

/**
 * 功能：生成一个短促的 MIDI 音符。
 * 入参：midi 为 MIDI 音高，duration 为秒数，gain 为振幅倍率，kind 为音色类型。
 * 返回值：带 ADSR 包络的短音符 Sound。
 * 边界情况：midi 为 SFX_REST 时返回对应时长的静音。
 */
function effectNote(midi, duration, gain, kind) {
  if (midi === SFX_REST) {
    return silence_sound(duration);
  }

  const frequency = midi_note_to_frequency(midi);
  let rawSound = silence_sound(0);

  if (kind === 'square') {
    rawSound = square_sound(frequency, duration);
  } else if (kind === 'triangle') {
    rawSound = triangle_sound(frequency, duration);
  } else {
    rawSound = sine_sound(frequency, duration);
  }

  return adsr(0.03, 0.08, 0.6, 0.18)(
    sfxScaleSound(rawSound, gain)
  );
}

/**
 * 功能：把 [MIDI音高, 秒数] 数组转换为连续音效。
 * 入参：events 为扁平音符数组，index 为当前下标，gain 为增益，kind 为音色。
 * 返回值：按顺序连接后的 Sound。
 * 边界情况：空数组或尾部缺少时值时返回零秒静音。
 */
function sfxEventsToSound(events, index, gain, kind) {
  if (index + 1 >= array_length(events)) {
    return silence_sound(0);
  }

  const midi = events[index];
  const duration = events[index + 1];

  return consecutively(list(
    effectNote(midi, duration, gain, kind),
    sfxEventsToSound(events, index + 2, gain, kind)
  ));
}

/**
 * 功能：生成短促的噪声冲击声。
 * 入参：duration 为持续时间，gain 为增益倍率。
 * 返回值：带快速衰减包络的噪声 Sound。
 * 边界情况：duration 小于等于 0 时返回零秒静音。
 */
function noiseImpact(duration, gain) {
  if (duration <= 0) {
    return silence_sound(0);
  }

  return adsr(0.01, 0.1, 0.08, 0.25)(
    sfxScaleSound(noise_sound(duration), gain)
  );
}

/**
 * 功能：生成踩死普通怪物的音效。
 * 入参：无。
 * 返回值：短促下降的踩踏音效 Sound。
 * 边界情况：无外部资源依赖，可在每次碰撞时重复调用。
 */
function stompEnemySound() {
  const thump = noiseImpact(0.09, 0.32);
  const fall = sfxEventsToSound([79, 0.05, 67, 0.07, 55, 0.1], 0, 0.52, 'triangle');
  return simultaneously(list(thump, fall));
}

/**
 * 功能：生成顶到普通砖块的音效。
 * 入参：无。
 * 返回值：低频撞击加高频弹响的 Sound。
 * 边界情况：无外部资源依赖，可连续触发。
 */
function bumpBlockSound() {
  const impact = noiseImpact(0.07, 0.26);
  const click = sfxEventsToSound([60, 0.055, 48, 0.08], 0, 0.42, 'square');
  return simultaneously(list(impact, click));
}

/**
 * 功能：生成顶到隐藏方块或砖块破碎的音效。
 * 入参：无。
 * 返回值：快速上扬再碎裂的 Sound。
 * 边界情况：无外部资源依赖，可在方块状态改变时触发一次。
 */
function breakBlockSound() {
  const crack = noiseImpact(0.12, 0.38);
  const burst = sfxEventsToSound([
    72, 0.04, 79, 0.04, 84, 0.05, SFX_REST, 0.03
  ], 0, 0.42, 'square');
  return simultaneously(list(crack, burst));
}

/**
 * 功能：生成收集金币的经典上行双音。
 * 入参：无。
 * 返回值：明亮的金币音效 Sound。
 * 边界情况：无外部资源依赖，可在短时间内连续播放。
 */
function collectCoinSound() {
  const coin = sfxEventsToSound([88, 0.07, 96, 0.13], 0, 0.48, 'square');
  const sparkle = sfxEventsToSound([100, 0.05, 108, 0.1], 0, 0.12, 'sine');
  return simultaneously(list(coin, sparkle));
}

/**
 * 功能：生成 Mario 跳跃音效。
 * 入参：无。
 * 返回值：短促上行的跳跃 Sound。
 * 边界情况：无外部资源依赖，可在每次起跳时触发。
 */
function jumpSound() {
  return sfxEventsToSound([
    64, 0.045, 69, 0.045, 74, 0.06, 79, 0.1
  ], 0, 0.4, 'square');
}

/**
 * 功能：生成踩到敌人后受伤或被击退的音效。
 * 入参：无。
 * 返回值：下降的双音受伤 Sound。
 * 边界情况：无外部资源依赖，可在受伤状态切换时触发。
 */
function hurtSound() {
  return sfxEventsToSound([
    76, 0.08, 70, 0.08, 64, 0.14
  ], 0, 0.4, 'square');
}

/**
 * 功能：生成发射火球的音效。
 * 入参：无。
 * 返回值：快速上行并带轻微噪声的 Sound。
 * 边界情况：无外部资源依赖，可随火球生成事件触发。
 */
function fireballSound() {
  const launch = sfxEventsToSound([60, 0.05, 67, 0.05, 74, 0.08], 0, 0.34, 'square');
  const air = noiseImpact(0.1, 0.12);
  return simultaneously(list(launch, air));
}

/**
 * 功能：生成 Mario 死亡音效。
 * 入参：无。
 * 返回值：逐步下降的死亡 Sound。
 * 边界情况：无外部资源依赖，可在死亡状态确定后触发一次。
 */
function marioDeathSound() {
  return sfxEventsToSound([
    79, 0.11, 74, 0.11, 69, 0.11, 64, 0.14,
    59, 0.16, 54, 0.22
  ], 0, 0.42, 'triangle');
}

/**
 * 功能：生成获得无敌星星的上行音效。
 * 入参：无。
 * 返回值：快速上行的奖励 Sound。
 * 边界情况：无外部资源依赖，可在获得道具时触发一次。
 */
function powerUpSound() {
  return sfxEventsToSound([
    72, 0.06, 76, 0.06, 79, 0.06, 84, 0.08,
    88, 0.08, 91, 0.12
  ], 0, 0.38, 'square');
}

/**
 * 功能：生成获得一条命的音效。
 * 入参：无。
 * 返回值：短小的经典奖励旋律 Sound。
 * 边界情况：无外部资源依赖，可在生命数增加后触发一次。
 */
function extraLifeSound() {
  const melody = sfxEventsToSound([
    76, 0.08, 84, 0.08, 91, 0.08, 100, 0.16
  ], 0, 0.4, 'square');
  const harmony = sfxEventsToSound([
    64, 0.08, 72, 0.08, 79, 0.08, 88, 0.16
  ], 0, 0.18, 'triangle');
  return simultaneously(list(melody, harmony));
}

/**
 * 功能：生成过关或进入旗杆区域的胜利音效。
 * 入参：无。
 * 返回值：明亮的上行胜利 Sound。
 * 边界情况：无外部资源依赖，可在关卡完成状态确定后触发一次。
 */
function levelClearSound() {
  return sfxEventsToSound([
    72, 0.07, 79, 0.07, 84, 0.07, 91, 0.07,
    96, 0.16, SFX_REST, 0.04, 96, 0.16
  ], 0, 0.4, 'square');
}

/**
 * 功能：试听指定音效。
 * 入参：sound 为任意 Sound。
 * 返回值：Source Academy 播放接口返回的 Sound。
 * 边界情况：sound 必须是 sound 模块生成的有效 Sound。
 */
function testSound(sound) {
  return play(sound);
}

// 测试示例：取消下面任意一行注释即可单独试听一个音效。
// testSound(stompEnemySound());
// testSound(bumpBlockSound());
// testSound(collectCoinSound());
// testSound(jumpSound());
// testSound(breakBlockSound());
// testSound(powerUpSound());


// ===== 音频运行时：游戏第一帧再构造 Sound，避免阻塞 build_game =====
let jumpAudio = silence_sound(0);
let stompEnemyAudio = silence_sound(0);
let bumpBlockAudio = silence_sound(0);
let breakBlockAudio = silence_sound(0);
let collectCoinAudio = silence_sound(0);
let fireballAudio = silence_sound(0);
let hurtAudio = silence_sound(0);
let marioDeathAudio = silence_sound(0);
let powerUpAudio = silence_sound(0);
let extraLifeAudio = silence_sound(0);
let levelClearAudio = silence_sound(0);
let audioInitialized = false;
let backgroundMusicStarted = false;

/** 功能：在游戏画布建立后生成全部自定义音效。入参：无。返回值：undefined。边界：重复调用不会重复生成。 */
function initializeAudio() {
  if (!audioInitialized) {
    jumpAudio = jumpSound();
    stompEnemyAudio = stompEnemySound();
    bumpBlockAudio = bumpBlockSound();
    breakBlockAudio = breakBlockSound();
    collectCoinAudio = collectCoinSound();
    fireballAudio = fireballSound();
    hurtAudio = hurtSound();
    marioDeathAudio = marioDeathSound();
    powerUpAudio = powerUpSound();
    extraLifeAudio = extraLifeSound();
    levelClearAudio = levelClearSound();
    audioInitialized = true;
  }
  return undefined;
}

/** 功能：开始背景音乐，整个程序生命周期只加入播放队列一次。入参：无。返回值：undefined。边界：重复调用不会重复播放。 */
function startBackgroundMusic() {
  if (!backgroundMusicStarted) {
    initializeAudio();
    play_in_tab(fullSong());
    backgroundMusicStarted = true;
  }
  return undefined;
}

/** 功能：停止当前播放中的背景音乐。入参：无。返回值：undefined。边界：stop 会停止当前所有 Sound，这是 Source Academy 官方行为。 */
function stopBackgroundMusic() {
  stop();
  return undefined;
}

/** 功能：保留开始配音接口。入参：无。返回值：undefined。边界：没有合法配音文件时保持空实现。 */
function playStartVoice() {
  return undefined;
}

/** 功能：保留金币配音接口。入参：无。返回值：undefined。边界：没有合法配音文件时保持空实现。 */
function playCoinVoice() {
  return undefined;
}

/** 功能：保留强化配音接口。入参：无。返回值：undefined。边界：没有合法配音文件时保持空实现。 */
function playPowerUpVoice() {
  return undefined;
}

/** 功能：保留死亡配音接口。入参：无。返回值：undefined。边界：没有合法配音文件时保持空实现。 */
function playDeathVoice() {
  return undefined;
}

/** 功能：保留过关配音接口。入参：无。返回值：undefined。边界：没有合法配音文件时保持空实现。 */
function playClearVoice() {
  return undefined;
}


const GAME_WIDTH = 960;
const GAME_HEIGHT = 540;
const WORLD_WIDTH = 9600;
const PLAYER_WIDTH = 28;
const PLAYER_HEIGHT = 36;
const PLAYER_START_X = 180;
const PLAYER_START_Y = 420;
const PLAYER_SPEED = 5;
const PLAYER_RUN_SPEED = 7;
const GRAVITY = 0.72;
const JUMP_SPEED = 14;
const MAX_FALL_SPEED = 16;
const GROUND_Y = 500;
const GROUND_HEIGHT = 56;
const GROUND_TOP = GROUND_Y - GROUND_HEIGHT / 2;
const CAMERA_LEAD = 410;
const CAMERA_LEFT_LIMIT = 0;
const STATE_MODE = 0;
const STATE_SCORE = 1;
const STATE_LIVES = 2;
const STATE_COINS = 3;
const STATE_TIME = 4;
const STATE_RESPAWN = 5;
const STATE_POWERUP_TIMER = 6;
const STATE_NEXT_LIFE_COIN = 8;
const COINS_PER_LIFE = 100;
const RECORD_OBJECT = 0;
const RECORD_X = 1;
const RECORD_Y = 2;
const RECORD_WIDTH = 3;
const RECORD_HEIGHT = 4;
const RECORD_ACTIVE = 5;
const RECORD_VELOCITY_X = 6;
const RECORD_START_X = 7;
const RECORD_START_Y = 8;
const RECORD_TYPE = 9;
const RECORD_PARTS = 10;
const RECORD_USED = 11;
const RECORD_AGE = 12;
const RECORD_OLD_LEVEL = 13;
const RECORD_POOL = 14;
const RECORD_REWARD_OBJECT = 15;
const RECORD_BOUNCE = 16;
const COIN_SCORE = 100;
const POWERUP_SCORE = 1000;
const STOMP_SCORE = 100;
const FIREBALL_SPEED = 10;
const ENEMY_SPEED = 1.35;
const FRAME_RATE = 30;
const COLLISION_TOLERANCE = 6;
const COIN_PICKUP_RADIUS = 24;
const POWERUP_PICKUP_RADIUS = 30;
const POWERUP_DURATION = 15 * FRAME_RATE;
const POWERUP_SPEED_MULTIPLIER = 1.35;
const POWERUP_JUMP_MULTIPLIER = 1.25;
const CLOUD_SPEED = 0.35;
const PLANT_DELAY = 3 * FRAME_RATE;
const RESPAWN_DELAY = 50;
const REWARD_COIN_POOL_SIZE = 24;
const POWERUP_POOL_SIZE = 12;
const BLOCK_BOUNCE_FRAMES = 8;
const ASSET_BASE = 'https://raw.githubusercontent.com/pablogozalvez/Super-Mario-Phaser/main/assets/';
const CLOUD_1_URL = ASSET_BASE + 'scenery/overworld/cloud1.png';
const CLOUD_2_URL = ASSET_BASE + 'scenery/overworld/cloud2.png';
const MOUNTAIN_1_URL = ASSET_BASE + 'scenery/overworld/mountain1.png';
const MOUNTAIN_2_URL = ASSET_BASE + 'scenery/overworld/mountain2.png';
const BUSH_1_URL = ASSET_BASE + 'scenery/overworld/bush1.png';
const PIPE_URL = ASSET_BASE + 'scenery/vertical-medium-tube.png';
const FLOOR_URL = ASSET_BASE + 'scenery/overworld/floorbricks.png';
const BLOCK_URL = ASSET_BASE + 'blocks/overworld/block.png';
const MYSTERY_URL = ASSET_BASE + 'blocks/overworld/misteryBlock.png';
const EMPTY_BLOCK_URL = ASSET_BASE + 'blocks/overworld/emptyBlock.png';
const CASTLE_URL = ASSET_BASE + 'scenery/castle.png';
const FLAG_MAST_URL = ASSET_BASE + 'scenery/flag-mast.png';
const FINAL_FLAG_URL = ASSET_BASE + 'scenery/final-flag.png';
const SIGN_URL = ASSET_BASE + 'scenery/sign.png';
const AUDIO_ENABLED = false;
const MODE_PLAYING = 'playing';
const MODE_DEAD = 'dead';
const MODE_GAME_OVER = 'game_over';
const MODE_WIN = 'win';
const MODE_LEVEL_SELECT = 'level_select';

set_fps(FRAME_RATE);
set_scale(1);

const sky = update_color(
  update_position(create_rectangle(GAME_WIDTH, GAME_HEIGHT), [GAME_WIDTH / 2, GAME_HEIGHT / 2]),
  [133, 198, 255, 255]
);
const skyGlow = update_color(
  update_position(create_rectangle(GAME_WIDTH, 220), [GAME_WIDTH / 2, 390]),
  [176, 224, 255, 255]
);
const farGround = update_color(
  update_position(create_rectangle(GAME_WIDTH, 90), [GAME_WIDTH / 2, 495]),
  [112, 184, 82, 255]
);
const hudBar = update_color(
  update_position(create_rectangle(GAME_WIDTH, 58), [GAME_WIDTH / 2, 29]),
  [28, 45, 59, 235]
);
const titleText = update_position(create_text('SUPER MARIO BROS.'), [78, 20]);
const scoreText = update_position(create_text('MARIO 000000'), [78, 43]);
const coinText = update_position(create_text('COINS 00'), [270, 43]);
const worldText = update_position(create_text('WORLD 1-1'), [480, 20]);
const timeText = update_position(create_text('TIME 300'), [850, 43]);
const powerText = update_position(create_text(''), [700, 43]);
const stateText = update_position(create_text('A D MOVE   SPACE JUMP   S CROUCH   Q FIRE   P PAUSE'), [480, 525]);
const messageText = update_position(create_text(''), [480, 270]);
const overlayPanel = update_color(
  update_position(create_rectangle(650, 300), [480, 285]),
  [18, 27, 42, 245]
);
const overlayTitle = update_position(create_text(''), [480, 205]);
const overlayBody = update_position(create_text(''), [480, 260]);
const overlayChoice1 = update_position(create_text(''), [480, 325]);
const overlayChoice2 = update_position(create_text(''), [480, 365]);
const overlayChoice3 = update_position(create_text(''), [480, 405]);

const solidObjects = [];
const visualObjects = [];
const cloudObjects = [];
const coinObjects = [];
const powerupObjects = [];
const enemyObjects = [];
const plantObjects = [];
const fireballObjects = [];
const finishObjects = [];
const groundObjects = [];
const playerVisualParts = [];
const gameState = ['playing', 0, 3, 0, 300, 0, 0, false, COINS_PER_LIFE];
const playerPosition = [PLAYER_START_X, PLAYER_START_Y];
const previousPlayerPosition = [PLAYER_START_X, PLAYER_START_Y];
const playerVelocity = [0, 0];
let playerOnGround = false;
let playerState = 0;
let playerCrouching = false;
let cameraX = 0;
let pauseKeyWasDown = false;
let fireKeyWasDown = false;
let resetKeyWasDown = false;
let levelSelectKeyWasDown = false;
let playerVisualFrame = 0;
let currentLevel = 1;

/** 创建可缩放的参考项目图片对象。 */
function createReferenceSprite(url, x, y, scaleX, scaleY) {
  const sprite = update_scale(create_sprite(url), [scaleX, scaleY]);
  update_position(sprite, [x, y]);
  visualObjects[array_length(visualObjects)] = [sprite, x, y, true];
  return sprite;
}

/** 标记旧视觉对象不再参与相机同步；入参为待停用的 GameObject；返回 undefined；对象本身不会被销毁。 */
function disableVisualObject(gameObject) {
  for (let i = 0; i < array_length(visualObjects); i = i + 1) {
    if (visualObjects[i][0] === gameObject) {
      visualObjects[i][3] = false;
    }
  }
}

/** 创建统一的关卡对象记录。 */
function makeRecord(gameObject, x, y, width, height, objectType, parts) {
  return [gameObject, x, y, width, height, true, 0, x, y, objectType, parts, false, 0, false, false, undefined, 0];
}

/** 将世界坐标对象同步到当前屏幕坐标。 */
function syncRecord(record) {
  if (record[RECORD_ACTIVE] && record[RECORD_OBJECT] !== undefined) {
    let visualY = record[RECORD_Y];
    if (record[RECORD_BOUNCE] > 0) {
      const bounceFrame = BLOCK_BOUNCE_FRAMES - record[RECORD_BOUNCE];
      visualY = record[RECORD_Y] - (bounceFrame < BLOCK_BOUNCE_FRAMES / 2 ? 8 : 0);
      record[RECORD_BOUNCE] = record[RECORD_BOUNCE] - 1;
    }
    update_position(record[RECORD_OBJECT], [record[RECORD_X] - cameraX, visualY]);
  }
}

/** 将普通装饰物同步到相机视口。 */
function syncVisualObject(item) {
  if (item[3]) {
    update_position(item[0], [item[1] - cameraX, item[2]]);
  }
}

/** 创建矩形碰撞体并加入实体列表。 */
function registerSolid(x, y, width, height, objectType) {
  const body = update_color(
    update_position(create_rectangle(width, height), [x - cameraX, y]),
    [0, 0, 0, 0]
  );
  const record = makeRecord(body, x, y, width, height, objectType, []);
  solidObjects[array_length(solidObjects)] = record;
  return record;
}

/** 创建参考项目的地砖视觉并注册地面碰撞。 */
function registerGroundSegment(startX, width) {
  registerSolid(startX + width / 2, GROUND_Y, width, GROUND_HEIGHT, 'ground');
  for (let x = startX + 16; x < startX + width - 8; x = x + 32) {
    const floor = createReferenceSprite(FLOOR_URL, x, GROUND_Y + 3, 2, 2);
    groundObjects[array_length(groundObjects)] = floor;
  }
}

/** 绘制没有地面碰撞的深坑；入参为世界坐标起点和宽度；返回 undefined；视觉层与地面碰撞保持一致。 */
function registerPit(startX, width) {
  const pit = update_color(
    update_position(create_rectangle(width, GROUND_HEIGHT + 14), [startX + width / 2, GROUND_Y + 6]),
    [0, 0, 0, 255]
  );
  visualObjects[array_length(visualObjects)] = [pit, startX + width / 2, GROUND_Y + 6, true];
}

/** 创建装饰物，装饰物不参与碰撞。 */
function registerDecoration(url, x, y, scaleX, scaleY) {
  createReferenceSprite(url, x, y, scaleX, scaleY);
}

/** 创建会左右漂移的云；入参为素材、坐标、缩放和初始方向；返回动态视觉记录。 */
function registerMovingCloud(url, x, y, scaleX, scaleY, direction) {
  const sprite = createReferenceSprite(url, x, y, scaleX, scaleY);
  const visual = visualObjects[array_length(visualObjects) - 1];
  visual[4] = direction;
  cloudObjects[array_length(cloudObjects)] = visual;
  return sprite;
}

/** 创建砖块平台。 */
function registerBrick(x, y) {
  const block = createReferenceSprite(BLOCK_URL, x, y, 2, 2);
  const record = makeRecord(block, x, y, 32, 32, 'brick', []);
  solidObjects[array_length(solidObjects)] = record;
  return record;
}

/** 创建问号砖，并记录是否已经被顶过。 */
function registerMysteryBlock(x, y, rewardType) {
  const block = createReferenceSprite(MYSTERY_URL, x, y, 2, 2);
  const empty = createReferenceSprite(EMPTY_BLOCK_URL, -200, -200, 2, 2);
  disableVisualObject(empty);
  const record = makeRecord(block, x, y, 32, 32, rewardType, []);
  record[RECORD_REWARD_OBJECT] = empty;
  solidObjects[array_length(solidObjects)] = record;
  return record;
}

/** 创建金币像素视觉和金币记录。 */
function registerCoin(x, y, isReward) {
  const outer = update_color(update_scale(update_position(create_circle(14), [x - cameraX, y]), [0.72, 1]), [235, 156, 18, 255]);
  const inner = update_color(update_scale(update_position(create_circle(10), [x - cameraX, y]), [0.64, 1]), [255, 214, 55, 255]);
  const shine = update_color(update_scale(update_position(create_circle(3), [x - cameraX - 3, y - 4]), [0.75, 1.3]), [255, 250, 178, 255]);
  const record = makeRecord(outer, x, y, 28, 28, 'coin', [outer, inner, shine]);
  record[RECORD_USED] = isReward === true;
  record[RECORD_VELOCITY_X] = isReward === true ? -8 : 0;
  record[RECORD_AGE] = 0;
  coinObjects[array_length(coinObjects)] = record;
  return record;
}

/** 创建蘑菇道具的像素视觉。 */
function registerPowerup(x, y, powerType) {
  const capColor = powerType === 'flower' ? [247, 137, 36, 255] : [222, 47, 48, 255];
  const cap = update_color(update_position(create_rectangle(26, 15), [x - cameraX, y - 8]), capColor);
  const stem = update_color(update_position(create_rectangle(18, 15), [x - cameraX, y + 8]), [255, 244, 190, 255]);
  const spot = update_color(update_position(create_rectangle(7, 7), [x - cameraX - 7, y - 8]), [255, 250, 220, 255]);
  const record = makeRecord(cap, x, y, 28, 30, powerType, [cap, stem, spot]);
  powerupObjects[array_length(powerupObjects)] = record;
  return record;
}

/** 创建预分配的奖励金币和道具对象；入参无；返回 undefined；运行时只复用对象，不创建新 GameObject。 */
function initializeRewardPools() {
  for (let i = 0; i < REWARD_COIN_POOL_SIZE; i = i + 1) {
    const coin = registerCoin(-200, -200, true);
    coin[RECORD_POOL] = true;
    coin[RECORD_ACTIVE] = false;
  }
  for (let i = 0; i < POWERUP_POOL_SIZE; i = i + 1) {
    const powerup = registerPowerup(-200, -200, 'mushroom');
    powerup[RECORD_POOL] = true;
    powerup[RECORD_ACTIVE] = false;
  }
}

/** 从预分配池激活一个道具；入参为坐标和道具类型；返回道具记录或 undefined；池耗尽时不创建对象。 */
function spawnPowerup(x, y, powerType) {
  for (let i = 0; i < array_length(powerupObjects); i = i + 1) {
    const powerup = powerupObjects[i];
    if (powerup[RECORD_POOL] && !powerup[RECORD_ACTIVE]) {
      powerup[RECORD_ACTIVE] = true;
      powerup[RECORD_TYPE] = powerType;
      powerup[RECORD_X] = x;
      powerup[RECORD_Y] = y;
      powerup[RECORD_START_X] = x;
      powerup[RECORD_START_Y] = y;
      const capColor = powerType === 'flower' ? [247, 137, 36, 255] : [222, 47, 48, 255];
      update_color(powerup[RECORD_PARTS][0], capColor);
      return powerup;
    }
  }
  return undefined;
}

/** 创建 Goomba 的像素视觉。 */
function createGoombaVisual(x, y) {
  const head = update_color(update_position(create_rectangle(30, 18), [x - cameraX, y - 8]), [151, 81, 43, 255]);
  const body = update_color(update_position(create_rectangle(25, 13), [x - cameraX, y + 9]), [126, 67, 38, 255]);
  const eyeLeft = update_color(update_position(create_rectangle(6, 8), [x - cameraX - 8, y - 8]), [255, 255, 230, 255]);
  const eyeRight = update_color(update_position(create_rectangle(6, 8), [x - cameraX + 8, y - 8]), [255, 255, 230, 255]);
  const feet = update_color(update_position(create_rectangle(35, 5), [x - cameraX, y + 18]), [72, 38, 27, 255]);
  return [head, body, eyeLeft, eyeRight, feet];
}

/** 创建会巡逻的 Goomba。 */
function registerEnemy(x, y) {
  const parts = createGoombaVisual(x, y);
  const record = makeRecord(parts[0], x, y, 32, 30, 'goomba', parts);
  record[RECORD_VELOCITY_X] = -ENEMY_SPEED;
  enemyObjects[array_length(enemyObjects)] = record;
  return record;
}

/** 创建食人花视觉部件；入参无；返回花朵的部件数组；初始位置放在屏幕外。 */
function createPiranhaVisual() {
  const stem = update_color(update_position(create_rectangle(10, 30), [-200, -200]), [47, 144, 60, 255]);
  const head = update_color(update_position(create_rectangle(30, 16), [-200, -200]), [205, 42, 48, 255]);
  const mouth = update_color(update_position(create_rectangle(20, 5), [-200, -200]), [48, 24, 24, 255]);
  const eyeLeft = update_color(update_position(create_rectangle(5, 6), [-200, -200]), [255, 255, 235, 255]);
  const eyeRight = update_color(update_position(create_rectangle(5, 6), [-200, -200]), [255, 255, 235, 255]);
  const pupilLeft = update_color(update_position(create_rectangle(2, 3), [-200, -200]), [20, 20, 20, 255]);
  const pupilRight = update_color(update_position(create_rectangle(2, 3), [-200, -200]), [20, 20, 20, 255]);
  return [stem, head, mouth, eyeLeft, eyeRight, pupilLeft, pupilRight];
}

/** 为水管注册食人花；入参为水管中心和管口高度；返回食人花记录；花朵初始隐藏。 */
function registerPiranhaPlant(pipeX, pipeTop) {
  const parts = createPiranhaVisual();
  const record = makeRecord(parts[0], pipeX, pipeTop - 25, 32, 50, 'plant', parts);
  record[RECORD_ACTIVE] = false;
  record[RECORD_VELOCITY_X] = 0;
  record[RECORD_START_X] = pipeX;
  record[RECORD_START_Y] = pipeTop;
  plantObjects[array_length(plantObjects)] = record;
  return record;
}

/** 创建管道碰撞体和参考项目管道图片。 */
function registerPipe(x, y, width, height) {
  const pipe = createReferenceSprite(PIPE_URL, x, y, 2.5, 2.5);
  const record = makeRecord(pipe, x, y, width, height, 'pipe', []);
  solidObjects[array_length(solidObjects)] = record;
  registerPiranhaPlant(x, y - height / 2);
  return record;
}

/** 创建终点旗杆、旗子和城堡场景。 */
function registerFinish(x, y) {
  const mast = createReferenceSprite(FLAG_MAST_URL, x, y, 2.2, 2.2);
  const flag = createReferenceSprite(FINAL_FLAG_URL, x + 25, y - 70, 2.2, 2.2);
  const record = makeRecord(mast, x, y, 24, 170, 'finish', [mast, flag]);
  finishObjects[array_length(finishObjects)] = record;
  return record;
}

/** 创建玩家像素角色。 */
function createPlayerVisual() {
  const hat = update_color(update_position(create_rectangle(34, 8), [0, 0]), [207, 42, 44, 255]);
  const hatBand = update_color(update_position(create_rectangle(31, 4), [0, 0]), [145, 28, 35, 255]);
  const face = update_color(update_position(create_rectangle(25, 17), [0, 0]), [255, 184, 126, 255]);
  const earLeft = update_color(update_position(create_rectangle(5, 8), [0, 0]), [224, 143, 94, 255]);
  const earRight = update_color(update_position(create_rectangle(5, 8), [0, 0]), [224, 143, 94, 255]);
  const eyeLeft = update_color(update_position(create_rectangle(5, 6), [0, 0]), [255, 255, 245, 255]);
  const eyeRight = update_color(update_position(create_rectangle(5, 6), [0, 0]), [255, 255, 245, 255]);
  const pupilLeft = update_color(update_position(create_rectangle(2, 4), [0, 0]), [22, 91, 145, 255]);
  const pupilRight = update_color(update_position(create_rectangle(2, 4), [0, 0]), [22, 91, 145, 255]);
  const nose = update_color(update_position(create_rectangle(8, 5), [0, 0]), [255, 197, 136, 255]);
  const moustacheLeft = update_color(update_position(create_rectangle(8, 3), [0, 0]), [38, 25, 24, 255]);
  const moustacheRight = update_color(update_position(create_rectangle(8, 3), [0, 0]), [38, 25, 24, 255]);
  const logoLeft = update_color(update_position(create_rectangle(2, 5), [0, 0]), [255, 255, 255, 255]);
  const logoMiddle = update_color(update_position(create_rectangle(2, 3), [0, 0]), [255, 255, 255, 255]);
  const logoRight = update_color(update_position(create_rectangle(2, 5), [0, 0]), [255, 255, 255, 255]);
  const shirt = update_color(update_position(create_rectangle(27, 13), [0, 0]), [207, 42, 44, 255]);
  const overalls = update_color(update_position(create_rectangle(22, 15), [0, 0]), [39, 91, 191, 255]);
  const shoeLeft = update_color(update_position(create_rectangle(14, 6), [0, 0]), [81, 46, 34, 255]);
  const shoeRight = update_color(update_position(create_rectangle(14, 6), [0, 0]), [81, 46, 34, 255]);
  playerVisualParts[0] = hat;
  playerVisualParts[1] = hatBand;
  playerVisualParts[2] = face;
  playerVisualParts[3] = earLeft;
  playerVisualParts[4] = earRight;
  playerVisualParts[5] = eyeLeft;
  playerVisualParts[6] = eyeRight;
  playerVisualParts[7] = pupilLeft;
  playerVisualParts[8] = pupilRight;
  playerVisualParts[9] = nose;
  playerVisualParts[10] = moustacheLeft;
  playerVisualParts[11] = moustacheRight;
  playerVisualParts[12] = logoLeft;
  playerVisualParts[13] = logoMiddle;
  playerVisualParts[14] = logoRight;
  playerVisualParts[15] = shirt;
  playerVisualParts[16] = overalls;
  playerVisualParts[17] = shoeLeft;
  playerVisualParts[18] = shoeRight;
}

/** 更新玩家像素角色的位置和成长形态颜色。 */
function updatePlayerVisual() {
  const x = playerPosition[0] - cameraX;
  const y = playerPosition[1];
  const crouchOffset = playerCrouching ? 8 : 0;
  update_position(playerVisualParts[0], [x, y - 25 + crouchOffset]);
  update_position(playerVisualParts[1], [x, y - 22 + crouchOffset]);
  update_position(playerVisualParts[2], [x, y - 13 + crouchOffset]);
  update_position(playerVisualParts[3], [x - 14, y - 13 + crouchOffset]);
  update_position(playerVisualParts[4], [x + 14, y - 13 + crouchOffset]);
  update_position(playerVisualParts[5], [x - 5, y - 17 + crouchOffset]);
  update_position(playerVisualParts[6], [x + 5, y - 17 + crouchOffset]);
  update_position(playerVisualParts[7], [x - 5, y - 17 + crouchOffset]);
  update_position(playerVisualParts[8], [x + 5, y - 17 + crouchOffset]);
  update_position(playerVisualParts[9], [x, y - 11 + crouchOffset]);
  update_position(playerVisualParts[10], [x - 4, y - 7 + crouchOffset]);
  update_position(playerVisualParts[11], [x + 4, y - 7 + crouchOffset]);
  update_position(playerVisualParts[12], [x - 4, y - 27 + crouchOffset]);
  update_position(playerVisualParts[13], [x, y - 26 + crouchOffset]);
  update_position(playerVisualParts[14], [x + 4, y - 27 + crouchOffset]);
  update_position(playerVisualParts[15], [x, y + 1 + crouchOffset]);
  update_position(playerVisualParts[16], [x, y + 11 + crouchOffset]);
  update_position(playerVisualParts[17], [x - 8, y + 21 + crouchOffset]);
  update_position(playerVisualParts[18], [x + 8, y + 21 + crouchOffset]);
  if (playerState === 2) {
    update_color(playerVisualParts[15], [255, 255, 255, 255]);
  } else {
    update_color(playerVisualParts[15], [207, 42, 44, 255]);
  }
  playerVisualFrame = playerVisualFrame + 1;
  if (playerVisualFrame % 20 < 10 && playerVelocity[0] !== 0) {
    update_position(playerVisualParts[17], [x - 10, y + 21 + crouchOffset]);
    update_position(playerVisualParts[18], [x + 6, y + 21 + crouchOffset]);
  }
}

/** 更新 Goomba 像素角色的部件位置。 */
function updateEnemyVisual(enemy) {
  const parts = enemy[RECORD_PARTS];
  if (!enemy[RECORD_ACTIVE]) {
    for (let i = 0; i < array_length(parts); i = i + 1) {
      update_position(parts[i], [-200, -200]);
    }
    return undefined;
  }
  const x = enemy[RECORD_X] - cameraX;
  const y = enemy[RECORD_Y];
  update_position(parts[0], [x, y - 8]);
  update_position(parts[1], [x, y + 9]);
  update_position(parts[2], [x - 8, y - 8]);
  update_position(parts[3], [x + 8, y - 8]);
  update_position(parts[4], [x, y + 18]);
}

/** 更新金币、道具和旗杆的部件位置。 */
function updateRecordParts(record) {
  const parts = record[RECORD_PARTS];
  if (!record[RECORD_ACTIVE]) {
    for (let i = 0; i < array_length(parts); i = i + 1) {
      update_position(parts[i], [-200, -200]);
    }
    return undefined;
  }
  const x = record[RECORD_X] - cameraX;
  const y = record[RECORD_Y];
  if (record[RECORD_TYPE] === 'coin') {
    const phase = get_loop_count() % 24;
    const widthScale = phase < 6 ? 0.72 : phase < 12 ? 0.5 : phase < 18 ? 0.3 : 0.5;
    update_position(parts[0], [x, y]);
    update_position(parts[1], [x, y]);
    update_position(parts[2], [x - 3, y - 4]);
    update_scale(parts[0], [widthScale, 1]);
    update_scale(parts[1], [widthScale * 0.9, 1]);
    update_scale(parts[2], [widthScale * 0.75, 1.3]);
  } else if (record[RECORD_TYPE] === 'mushroom' || record[RECORD_TYPE] === 'flower') {
    update_position(parts[0], [x, y - 8]);
    update_position(parts[1], [x, y + 8]);
    update_position(parts[2], [x - 7, y - 8]);
  } else if (record[RECORD_TYPE] === 'finish') {
    update_position(parts[0], [x, y]);
    update_position(parts[1], [x + 25, y - 70]);
  }
}

/** 判断玩家是否进入金币拾取范围；入参为金币记录；返回布尔值；允许边缘接近时收集。 */
function playerCollectsCoin(coin) {
  let horizontalDistance = playerPosition[0] - coin[RECORD_X];
  let verticalDistance = playerPosition[1] - coin[RECORD_Y];
  if (horizontalDistance < 0) {
    horizontalDistance = -horizontalDistance;
  }
  if (verticalDistance < 0) {
    verticalDistance = -verticalDistance;
  }
  return horizontalDistance <= PLAYER_WIDTH / 2 + COIN_PICKUP_RADIUS
    && verticalDistance <= PLAYER_HEIGHT / 2 + COIN_PICKUP_RADIUS;
}

/** 判断玩家是否进入蘑菇或花朵拾取范围；入参为道具记录；返回布尔值；允许跳跃擦边收集。 */
function playerCollectsPowerup(powerup) {
  let horizontalDistance = playerPosition[0] - powerup[RECORD_X];
  let verticalDistance = playerPosition[1] - powerup[RECORD_Y];
  if (horizontalDistance < 0) {
    horizontalDistance = -horizontalDistance;
  }
  if (verticalDistance < 0) {
    verticalDistance = -verticalDistance;
  }
  return horizontalDistance <= PLAYER_WIDTH / 2 + POWERUP_PICKUP_RADIUS
    && verticalDistance <= PLAYER_HEIGHT / 2 + POWERUP_PICKUP_RADIUS;
}

/** 创建火球并加入活动对象。 */
function registerFireball(x, y, velocityX) {
  const core = update_color(update_position(create_rectangle(12, 12), [x - cameraX, y]), [255, 145, 33, 255]);
  const record = makeRecord(core, x, y, 14, 14, 'fireball', [core]);
  record[RECORD_VELOCITY_X] = velocityX;
  fireballObjects[array_length(fireballObjects)] = record;
  return record;
}

/** 打开关卡选择界面；入参无；返回 undefined；游戏状态会暂停。 */
function openLevelSelection() {
  gameState[STATE_MODE] = MODE_LEVEL_SELECT;
  playerVelocity[0] = 0;
  playerVelocity[1] = 0;
  messageTextVisible('');
}

/** 选择关卡并重新开始；入参为 1 到 3 的关卡编号；返回 undefined；非法编号保持当前关卡。 */
function chooseLevel(levelNumber) {
  if (levelNumber < 1 || levelNumber > 3) {
    return undefined;
  }
  currentLevel = levelNumber;
  clearLevelObjects();
  initializeScenery();
  initializeLevel();
  restartGame();
}

/** 创建长地图中的天空装饰和场景层。 */
function initializeScenery() {
  const cloudPositions = [220, 760, 1440, 2100, 2920, 3700, 4580, 5480, 6410, 7350, 8280, 9120];
  for (let i = 0; i < array_length(cloudPositions); i = i + 1) {
    registerMovingCloud(i % 2 === 0 ? CLOUD_1_URL : CLOUD_2_URL, cloudPositions[i], 95 + (i % 3) * 35, 1.2, 1.2, i % 2 === 0 ? 1 : -1);
  }
  const mountainPositions = [400, 1250, 2260, 3320, 4550, 5700, 6960, 8200, 9230];
  for (let i = 0; i < array_length(mountainPositions); i = i + 1) {
    registerDecoration(i % 2 === 0 ? MOUNTAIN_1_URL : MOUNTAIN_2_URL, mountainPositions[i], 430, 2.2, 2.2);
  }
  const bushPositions = [690, 1760, 2660, 4140, 5180, 6420, 7790, 8660];
  for (let i = 0; i < array_length(bushPositions); i = i + 1) {
    registerDecoration(BUSH_1_URL, bushPositions[i], 465, 2, 2);
  }
  registerDecoration(SIGN_URL, 260, 425, 1.4, 1.4);
  registerDecoration(CASTLE_URL, 9280, 410, 2.8, 2.8);
}

/** 创建地面、平台、砖块、管道、金币、敌人和终点。 */
function initializeLevel() {
  registerGroundSegment(0, 1500);
  registerGroundSegment(1600, 1960);
  registerGroundSegment(3680, 1970);
  registerGroundSegment(5750, 1900);
  registerGroundSegment(7750, 1250);
  registerGroundSegment(9000, 600);
  registerPit(1500, 100);
  registerPit(3560, 120);
  registerPit(5650, 100);
  registerPit(7650, 100);

  registerBrick(460, 390);
  registerBrick(492, 390);
  registerMysteryBlock(524, 390, 'coinBlock');
  registerBrick(556, 390);
  registerBrick(588, 390);
  registerMysteryBlock(1040, 330, 'mushroom');
  registerBrick(1072, 330);
  registerBrick(1104, 330);
  registerBrick(1136, 330);
  registerMysteryBlock(1460, 270, 'coinBlock');
  registerBrick(1492, 270);
  registerBrick(1524, 270);

  registerBrick(2030, 380);
  registerBrick(2062, 380);
  registerBrick(2094, 380);
  registerMysteryBlock(2126, 380, 'flower');
  registerBrick(2158, 380);
  registerBrick(2190, 380);
  registerBrick(2490, 315);
  registerBrick(2522, 315);
  registerMysteryBlock(2554, 315, 'coinBlock');
  registerBrick(2586, 315);

  registerBrick(4020, 360);
  registerBrick(4052, 360);
  registerBrick(4084, 360);
  registerBrick(4116, 360);
  registerMysteryBlock(4148, 360, 'mushroom');
  registerBrick(4180, 360);
  registerBrick(4212, 360);
  registerBrick(4500, 290);
  registerBrick(4532, 290);
  registerBrick(4564, 290);
  registerBrick(4596, 290);
  registerBrick(4628, 290);
  registerMysteryBlock(4660, 290, 'coinBlock');

  registerBrick(5900, 370);
  registerBrick(5932, 370);
  registerMysteryBlock(5964, 370, 'flower');
  registerBrick(5996, 370);
  registerBrick(6028, 370);
  registerBrick(6300, 300);
  registerBrick(6332, 300);
  registerBrick(6364, 300);
  registerMysteryBlock(6396, 300, 'coinBlock');
  registerBrick(6428, 300);

  registerBrick(7900, 360);
  registerBrick(7932, 360);
  registerBrick(7964, 360);
  registerMysteryBlock(7996, 360, 'mushroom');
  registerBrick(8028, 360);
  registerBrick(8060, 360);
  registerBrick(8240, 270);
  registerBrick(8272, 270);
  registerMysteryBlock(8304, 270, 'coinBlock');
  registerBrick(8336, 270);

  registerPipe(820, 425, 64, 110);
  registerPipe(1290, 405, 64, 150);
  registerPipe(2340, 425, 64, 110);
  registerPipe(4910, 405, 64, 150);
  registerPipe(6820, 425, 64, 110);
  registerPipe(8120, 405, 64, 150);

  registerCoin(410, 430, false);
  registerCoin(650, 380, false);
  registerCoin(690, 380, false);
  registerCoin(730, 380, false);
  registerCoin(1040, 270, false);
  registerCoin(1180, 410, false);
  registerCoin(1215, 410, false);
  registerCoin(1450, 230, false);
  registerCoin(1510, 230, false);
  registerCoin(2180, 330, false);
  registerCoin(2270, 420, false);
  registerCoin(2560, 275, false);
  registerCoin(2890, 420, false);
  registerCoin(2925, 420, false);
  registerCoin(2960, 420, false);
  registerCoin(4040, 320, false);
  registerCoin(4360, 420, false);
  registerCoin(4520, 250, false);
  registerCoin(4590, 250, false);
  registerCoin(4660, 250, false);
  registerCoin(5920, 330, false);
  registerCoin(6080, 420, false);
  registerCoin(6360, 260, false);
  registerCoin(6500, 420, false);
  registerCoin(7940, 320, false);
  registerCoin(8020, 320, false);
  registerCoin(8290, 230, false);
  registerCoin(8360, 230, false);
  registerCoin(8700, 420, false);

  registerPowerup(1040, 260, 'mushroom');
  registerPowerup(4148, 330, 'mushroom');
  registerPowerup(5964, 340, 'flower');
  registerPowerup(7996, 330, 'mushroom');

  registerEnemy(760, 458);
  registerEnemy(1150, 458);
  registerEnemy(1970, 458);
  registerEnemy(2700, 458);
  registerEnemy(4150, 458);
  registerEnemy(4790, 458);
  registerEnemy(6100, 458);
  registerEnemy(7250, 458);
  registerEnemy(8040, 458);
  registerEnemy(8700, 458);

  registerFinish(9150, 410);
  initializeLevelVariant();
}

/** 根据当前关卡增加差异化布局；入参无；返回 undefined；1-1 保持基础地图，1-2 和 1-3 增加不同障碍。 */
function initializeLevelVariant() {
  if (currentLevel === 2) {
    registerGroundSegment(2460, 420);
    registerBrick(2800, 350);
    registerBrick(2832, 350);
    registerBrick(2864, 350);
    registerMysteryBlock(2896, 350, 'coinBlock');
    registerPipe(3180, 405, 64, 150);
    registerCoin(2800, 310, false);
    registerCoin(2832, 310, false);
    registerCoin(2864, 310, false);
    registerCoin(2896, 310, false);
    registerEnemy(2760, 458);
    registerEnemy(3050, 458);
  } else if (currentLevel === 3) {
    registerGroundSegment(1500, 210);
    registerGroundSegment(3560, 260);
    registerBrick(3300, 300);
    registerBrick(3332, 300);
    registerBrick(3364, 300);
    registerBrick(3396, 300);
    registerMysteryBlock(3428, 300, 'flower');
    registerPipe(3470, 390, 64, 180);
    registerCoin(3300, 260, false);
    registerCoin(3332, 260, false);
    registerCoin(3364, 260, false);
    registerCoin(3396, 260, false);
    registerEnemy(3220, 458);
    registerEnemy(3500, 458);
    registerEnemy(3650, 458);
  }
}

/** 停用旧关卡的全部对象；入参无；返回 undefined；旧对象保留在数组中但不会再参与碰撞或重置。 */
function clearLevelObjects() {
  for (let i = 0; i < array_length(visualObjects); i = i + 1) {
    visualObjects[i][3] = false;
  }
  for (let i = 0; i < array_length(groundObjects); i = i + 1) {
    disableVisualObject(groundObjects[i]);
  }
  for (let i = 0; i < array_length(solidObjects); i = i + 1) {
    solidObjects[i][RECORD_ACTIVE] = false;
    solidObjects[i][RECORD_OLD_LEVEL] = true;
  }
  const objectGroups = [coinObjects, powerupObjects, enemyObjects, plantObjects, fireballObjects, finishObjects];
  for (let groupIndex = 0; groupIndex < array_length(objectGroups); groupIndex = groupIndex + 1) {
    const group = objectGroups[groupIndex];
    for (let i = 0; i < array_length(group); i = i + 1) {
      if (group[i][RECORD_POOL]) {
        hideRecord(group[i]);
        continue;
      }
      group[i][RECORD_OLD_LEVEL] = true;
      hideRecord(group[i]);
    }
  }
}

/** 判断两个矩形记录是否重叠。 */
function playerOverlapsRecord(x, y, width, height, record) {
  const left = x - width / 2;
  const right = x + width / 2;
  const top = y - height / 2;
  const bottom = y + height / 2;
  const otherLeft = record[RECORD_X] - record[RECORD_WIDTH] / 2;
  const otherRight = record[RECORD_X] + record[RECORD_WIDTH] / 2;
  const otherTop = record[RECORD_Y] - record[RECORD_HEIGHT] / 2;
  const otherBottom = record[RECORD_Y] + record[RECORD_HEIGHT] / 2;
  return left < otherRight && right > otherLeft && top < otherBottom && bottom > otherTop;
}

/** 判断玩家是否碰到活动对象。 */
function playerTouchesRecord(record) {
  return record[RECORD_ACTIVE] && playerOverlapsRecord(
    playerPosition[0], playerPosition[1], PLAYER_WIDTH, PLAYER_HEIGHT, record
  );
}

/** 隐藏已经收集或击败的对象。 */
function hideRecord(record) {
  record[RECORD_ACTIVE] = false;
  if (record[RECORD_OBJECT] !== undefined) {
    update_position(record[RECORD_OBJECT], [-200, -200]);
  }
  const parts = record[RECORD_PARTS];
  for (let i = 0; i < array_length(parts); i = i + 1) {
    update_position(parts[i], [-200, -200]);
  }
}

/** 处理左右输入、蹲下、跳跃和暂停。 */
function handleInput() {
  const left = input_key_down('a') || input_key_down('ArrowLeft');
  const right = input_key_down('d') || input_key_down('ArrowRight');
  const down = input_key_down('s') || input_key_down('ArrowDown');
  const jump = input_key_down(' ') || input_key_down('Space') || input_key_down('w') || input_key_down('ArrowUp');
  const fire = input_key_down('q');
  const pause = input_key_down('p');
  const reset = input_key_down('r');
  const openLevelSelect = input_key_down('l');
  const level1 = input_key_down('1');
  const level2 = input_key_down('2');
  const level3 = input_key_down('3');
  if (openLevelSelect && !levelSelectKeyWasDown && gameState[STATE_MODE] !== MODE_LEVEL_SELECT) {
    openLevelSelection();
  }
  levelSelectKeyWasDown = openLevelSelect;
  if (gameState[STATE_MODE] === MODE_LEVEL_SELECT) {
    if (level1) {
      chooseLevel(1);
    } else if (level2) {
      chooseLevel(2);
    } else if (level3) {
      chooseLevel(3);
    }
    return undefined;
  }
  if (pause && !pauseKeyWasDown && gameState[STATE_MODE] === 'playing') {
    gameState[STATE_MODE] = 'paused';
    stopBackgroundMusic();
  } else if (pause && !pauseKeyWasDown && gameState[STATE_MODE] === 'paused') {
    gameState[STATE_MODE] = 'playing';
    startBackgroundMusic();
  }
  pauseKeyWasDown = pause;
  if ((gameState[STATE_MODE] === MODE_DEAD || gameState[STATE_MODE] === MODE_WIN || gameState[STATE_MODE] === MODE_GAME_OVER) && reset && !resetKeyWasDown) {
    restartGame();
  }
  resetKeyWasDown = reset;
  playerCrouching = down && playerOnGround && playerState > 0;
  const powerupActive = gameState[STATE_POWERUP_TIMER] > 0;
  const movementSpeed = powerupActive ? PLAYER_SPEED * POWERUP_SPEED_MULTIPLIER : PLAYER_SPEED;
  const jumpSpeed = powerupActive ? JUMP_SPEED * POWERUP_JUMP_MULTIPLIER : JUMP_SPEED;
  playerVelocity[0] = 0;
  if (left) {
    playerVelocity[0] = -movementSpeed;
  }
  if (right) {
    playerVelocity[0] = movementSpeed;
  }
  if (left && right) {
    playerVelocity[0] = 0;
  }
  if (input_key_down('shift')) {
    playerVelocity[0] = playerVelocity[0] * PLAYER_RUN_SPEED / PLAYER_SPEED;
  }
  if (jump && playerOnGround && !playerCrouching) {
    playerVelocity[1] = -jumpSpeed;
    playerOnGround = false;
    play(jumpAudio);
  }
  if (fire && !fireKeyWasDown && playerState === 2) {
    const fireball = registerFireball(playerPosition[0] + 24, playerPosition[1] - 5, playerVelocity[0] < 0 ? -FIREBALL_SPEED : FIREBALL_SPEED);
    if (fireball !== undefined) {
      play(fireballAudio);
    }
  }
  fireKeyWasDown = fire;
}

/** 更新玩家重力和世界坐标。 */
function updatePlayerPhysics() {
  playerVelocity[1] = playerVelocity[1] + GRAVITY;
  if (playerVelocity[1] > MAX_FALL_SPEED) {
    playerVelocity[1] = MAX_FALL_SPEED;
  }
  playerPosition[0] = playerPosition[0] + playerVelocity[0];
  playerPosition[1] = playerPosition[1] + playerVelocity[1];
  if (playerPosition[0] < PLAYER_WIDTH / 2) {
    playerPosition[0] = PLAYER_WIDTH / 2;
  }
  if (playerPosition[0] > WORLD_WIDTH - PLAYER_WIDTH / 2) {
    playerPosition[0] = WORLD_WIDTH - PLAYER_WIDTH / 2;
  }
}

/** 独立检测玩家从下方穿过奖励砖；入参无；返回 undefined；避免邻近普通砖吞掉问号砖事件。 */
function activateNearbyMysteryBlocks() {
  if (playerVelocity[1] >= 0) {
    return undefined;
  }
  const playerLeft = playerPosition[0] - PLAYER_WIDTH / 2;
  const playerRight = playerPosition[0] + PLAYER_WIDTH / 2;
  const currentTop = playerPosition[1] - PLAYER_HEIGHT / 2;
  const previousTop = previousPlayerPosition[1] - PLAYER_HEIGHT / 2;
  for (let i = 0; i < array_length(solidObjects); i = i + 1) {
    const block = solidObjects[i];
    const isRewardBlock = block[RECORD_TYPE] === 'coinBlock'
      || block[RECORD_TYPE] === 'mushroom'
      || block[RECORD_TYPE] === 'flower';
    if (!block[RECORD_ACTIVE] || block[RECORD_USED] || !isRewardBlock) {
      continue;
    }
    const blockLeft = block[RECORD_X] - block[RECORD_WIDTH] / 2;
    const blockRight = block[RECORD_X] + block[RECORD_WIDTH] / 2;
    const blockBottom = block[RECORD_Y] + block[RECORD_HEIGHT] / 2;
    const horizontalOverlap = playerRight > blockLeft - 12 && playerLeft < blockRight + 12;
    const crossedFromBelow = previousTop >= blockBottom - 24 && currentTop <= blockBottom + 12;
    if (horizontalOverlap && crossedFromBelow) {
      playerPosition[1] = blockBottom + PLAYER_HEIGHT / 2;
      playerVelocity[1] = 0;
      play(breakBlockAudio);
      activateBlockReward(block);
    }
  }
  return undefined;
}

/** 处理玩家和砖块、平台、管道、地面的碰撞。 */
function resolveSolidCollisions() {
  playerOnGround = false;
  for (let i = 0; i < array_length(solidObjects); i = i + 1) {
    const solid = solidObjects[i];
    if (!solid[RECORD_ACTIVE]) {
      continue;
    }
    const solidLeft = solid[RECORD_X] - solid[RECORD_WIDTH] / 2;
    const solidRight = solid[RECORD_X] + solid[RECORD_WIDTH] / 2;
    const solidTop = solid[RECORD_Y] - solid[RECORD_HEIGHT] / 2;
    const solidBottom = solid[RECORD_Y] + solid[RECORD_HEIGHT] / 2;
    const playerLeft = playerPosition[0] - PLAYER_WIDTH / 2;
    const playerRight = playerPosition[0] + PLAYER_WIDTH / 2;
    const currentTop = playerPosition[1] - PLAYER_HEIGHT / 2;
    const currentBottom = playerPosition[1] + PLAYER_HEIGHT / 2;
    const previousTop = previousPlayerPosition[1] - PLAYER_HEIGHT / 2;
    const previousBottom = previousPlayerPosition[1] + PLAYER_HEIGHT / 2;
    const isRewardBlock = solid[RECORD_TYPE] === 'coinBlock'
      || solid[RECORD_TYPE] === 'mushroom'
      || solid[RECORD_TYPE] === 'flower';
    const horizontalTolerance = isRewardBlock ? 12 : 0;
    if (playerRight <= solidLeft - horizontalTolerance || playerLeft >= solidRight + horizontalTolerance) {
      continue;
    }
    if (playerVelocity[1] >= 0 && previousBottom <= solidTop + COLLISION_TOLERANCE && currentBottom >= solidTop) {
      playerPosition[1] = solidTop - PLAYER_HEIGHT / 2;
      playerVelocity[1] = 0;
      playerOnGround = true;
    } else if (
      playerVelocity[1] < 0
      && previousPlayerPosition[1] - PLAYER_HEIGHT / 2 >= solidBottom - 20
      && currentTop <= solidBottom + 10
    ) {
      playerPosition[1] = solidBottom + PLAYER_HEIGHT / 2;
      playerVelocity[1] = 0;
      if (!solid[RECORD_USED] && isRewardBlock) {
        play(breakBlockAudio);
        activateBlockReward(solid);
      } else if (!isRewardBlock) {
        play(bumpBlockAudio);
      }
    } else if (currentBottom > solidTop && currentTop < solidBottom && previousPlayerPosition[0] <= solidLeft) {
      playerPosition[0] = solidLeft - PLAYER_WIDTH / 2;
    } else if (currentBottom > solidTop && currentTop < solidBottom && previousPlayerPosition[0] >= solidRight) {
      playerPosition[0] = solidRight + PLAYER_WIDTH / 2;
    }
  }
}

/** 顶起问号砖，生成金币或道具。 */
function activateBlockReward(block) {
  block[RECORD_USED] = true;
  block[RECORD_BOUNCE] = BLOCK_BOUNCE_FRAMES;
  disableVisualObject(block[RECORD_OBJECT]);
  update_position(block[RECORD_OBJECT], [-200, -200]);
  const empty = block[RECORD_REWARD_OBJECT];
  block[RECORD_OBJECT] = empty;
  update_position(empty, [block[RECORD_X] - cameraX, block[RECORD_Y]]);
  if (block[RECORD_TYPE] === 'coinBlock') {
    spawnRewardCoin(block[RECORD_X], block[RECORD_Y] - 48);
  } else {
    spawnPowerup(block[RECORD_X], block[RECORD_Y] - 48, block[RECORD_TYPE]);
  }
}

/** 更新相机，让玩家在长地图中保持在屏幕中段。 */
function updateCamera() {
  const targetCamera = playerPosition[0] - CAMERA_LEAD;
  cameraX = targetCamera;
  if (cameraX < CAMERA_LEFT_LIMIT) {
    cameraX = CAMERA_LEFT_LIMIT;
  }
  if (cameraX > WORLD_WIDTH - GAME_WIDTH) {
    cameraX = WORLD_WIDTH - GAME_WIDTH;
  }
  for (let i = 0; i < array_length(visualObjects); i = i + 1) {
    syncVisualObject(visualObjects[i]);
  }
  for (let i = 0; i < array_length(solidObjects); i = i + 1) {
    syncRecord(solidObjects[i]);
  }
  for (let i = 0; i < array_length(coinObjects); i = i + 1) {
    updateRecordParts(coinObjects[i]);
  }
  for (let i = 0; i < array_length(powerupObjects); i = i + 1) {
    updateRecordParts(powerupObjects[i]);
  }
  for (let i = 0; i < array_length(enemyObjects); i = i + 1) {
    updateEnemyVisual(enemyObjects[i]);
  }
  for (let i = 0; i < array_length(fireballObjects); i = i + 1) {
    syncRecord(fireballObjects[i]);
  }
  for (let i = 0; i < array_length(finishObjects); i = i + 1) {
    updateRecordParts(finishObjects[i]);
  }
}

/** 更新云的世界坐标并在地图边缘反向；入参无；返回 undefined；云不会参与碰撞。 */
function updateClouds() {
  for (let i = 0; i < array_length(cloudObjects); i = i + 1) {
    const cloud = cloudObjects[i];
    cloud[1] = cloud[1] + cloud[4] * CLOUD_SPEED;
    if (cloud[1] < 40 || cloud[1] > WORLD_WIDTH - 40) {
      cloud[4] = -cloud[4];
    }
  }
}

/** 更新 Goomba 的巡逻移动。 */
/** 更新食人花的计时、伸出和攻击；入参无；返回 undefined；离开管口会立即收回。 */
function updatePiranhaPlants() {
  for (let i = 0; i < array_length(plantObjects); i = i + 1) {
    const plant = plantObjects[i];
    const pipeX = plant[RECORD_START_X];
    const pipeTop = plant[RECORD_START_Y];
    const playerBottom = playerPosition[1] + PLAYER_HEIGHT / 2;
    const standingOnPipe = playerOnGround
      && playerPosition[0] + PLAYER_WIDTH / 2 > pipeX - 32
      && playerPosition[0] - PLAYER_WIDTH / 2 < pipeX + 32
      && playerBottom >= pipeTop - COLLISION_TOLERANCE
      && playerBottom <= pipeTop + COLLISION_TOLERANCE;
    if (!standingOnPipe) {
      plant[RECORD_VELOCITY_X] = 0;
      if (plant[RECORD_ACTIVE]) {
        hideRecord(plant);
      }
      continue;
    }
    plant[RECORD_VELOCITY_X] = plant[RECORD_VELOCITY_X] + 1;
    if (plant[RECORD_VELOCITY_X] < PLANT_DELAY) {
      continue;
    }
    plant[RECORD_ACTIVE] = true;
    plant[RECORD_X] = pipeX;
    plant[RECORD_Y] = pipeTop - 25;
    const parts = plant[RECORD_PARTS];
    update_position(parts[0], [pipeX - cameraX, pipeTop - 15]);
    update_position(parts[1], [pipeX - cameraX, pipeTop - 43]);
    update_position(parts[2], [pipeX - cameraX, pipeTop - 38]);
    update_position(parts[3], [pipeX - cameraX - 7, pipeTop - 46]);
    update_position(parts[4], [pipeX - cameraX + 7, pipeTop - 46]);
    update_position(parts[5], [pipeX - cameraX - 7, pipeTop - 46]);
    update_position(parts[6], [pipeX - cameraX + 7, pipeTop - 46]);
    if (playerTouchesRecord(plant)) {
      beginDeath();
    }
  }
}

/** 更新踩敌后生成的奖励金币；入参无；返回 undefined；金币被收集或超时后隐藏。 */
function updateRewardCoins() {
  for (let i = 0; i < array_length(coinObjects); i = i + 1) {
    const coin = coinObjects[i];
    if (!coin[RECORD_ACTIVE] || !coin[RECORD_USED]) {
      continue;
    }
    coin[RECORD_Y] = coin[RECORD_Y] + coin[RECORD_VELOCITY_X];
    coin[RECORD_VELOCITY_X] = coin[RECORD_VELOCITY_X] + 0.45;
    coin[RECORD_AGE] = coin[RECORD_AGE] + 1;
    if (coin[RECORD_AGE] > 180) {
      hideRecord(coin);
    }
  }
}

/** 生成踩敌奖励金币；入参为敌人世界坐标；返回金币记录；金币由收集逻辑统一结算。 */
function spawnRewardCoin(x, y) {
  for (let i = 0; i < array_length(coinObjects); i = i + 1) {
    const coin = coinObjects[i];
    if (coin[RECORD_POOL] && !coin[RECORD_ACTIVE]) {
      coin[RECORD_ACTIVE] = true;
      coin[RECORD_X] = x;
      coin[RECORD_Y] = y - 28;
      coin[RECORD_START_X] = x;
      coin[RECORD_START_Y] = y - 28;
      coin[RECORD_VELOCITY_X] = -8;
      coin[RECORD_AGE] = 0;
      return coin;
    }
  }
  return undefined;
}

function updateEnemies() {
  for (let i = 0; i < array_length(enemyObjects); i = i + 1) {
    const enemy = enemyObjects[i];
    if (!enemy[RECORD_ACTIVE]) {
      continue;
    }
    enemy[RECORD_X] = enemy[RECORD_X] + enemy[RECORD_VELOCITY_X];
    if (enemy[RECORD_X] < enemy[RECORD_START_X] - 130 || enemy[RECORD_X] > enemy[RECORD_START_X] + 130) {
      enemy[RECORD_VELOCITY_X] = -enemy[RECORD_VELOCITY_X];
    }
    updateEnemyVisual(enemy);
  }
}

/** 收集金币和蘑菇，切换玩家成长状态。 */
function collectItems() {
  for (let i = 0; i < array_length(coinObjects); i = i + 1) {
    const coin = coinObjects[i];
    if (coin[RECORD_ACTIVE] && playerCollectsCoin(coin)) {
      hideRecord(coin);
      gameState[STATE_COINS] = gameState[STATE_COINS] + 1;
      gameState[STATE_SCORE] = gameState[STATE_SCORE] + COIN_SCORE;
      play(collectCoinAudio);
      playCoinVoice();
      if (gameState[STATE_COINS] >= gameState[STATE_NEXT_LIFE_COIN]) {
        gameState[STATE_LIVES] = gameState[STATE_LIVES] + 1;
        gameState[STATE_NEXT_LIFE_COIN] = gameState[STATE_NEXT_LIFE_COIN] + COINS_PER_LIFE;
        play(extraLifeAudio);
      }
    }
  }
  for (let i = 0; i < array_length(powerupObjects); i = i + 1) {
    const powerup = powerupObjects[i];
    if (powerup[RECORD_ACTIVE] && playerCollectsPowerup(powerup)) {
      hideRecord(powerup);
      gameState[STATE_SCORE] = gameState[STATE_SCORE] + POWERUP_SCORE;
      gameState[STATE_POWERUP_TIMER] = POWERUP_DURATION;
      play(powerUpAudio);
      playPowerUpVoice();
      if (powerup[RECORD_TYPE] === 'flower') {
        playerState = 2;
      } else if (playerState < 1) {
        playerState = 1;
      }
    }
  }
}

/** 更新临时能力计时；入参无；返回 undefined；计时结束后恢复普通速度和跳跃高度。 */
function updatePowerupState() {
  if (gameState[STATE_POWERUP_TIMER] <= 0) {
    return undefined;
  }
  gameState[STATE_POWERUP_TIMER] = gameState[STATE_POWERUP_TIMER] - 1;
  if (gameState[STATE_POWERUP_TIMER] <= 0) {
    gameState[STATE_POWERUP_TIMER] = 0;
    playerState = 0;
  }
}

/** 处理 Goomba 碰撞、踩踏和玩家死亡。 */
function resolveEnemyCollisions() {
  for (let i = 0; i < array_length(enemyObjects); i = i + 1) {
    const enemy = enemyObjects[i];
    if (!enemy[RECORD_ACTIVE] || !playerTouchesRecord(enemy)) {
      continue;
    }
    const enemyTop = enemy[RECORD_Y] - enemy[RECORD_HEIGHT] / 2;
    const previousBottom = previousPlayerPosition[1] + PLAYER_HEIGHT / 2;
    if (playerVelocity[1] >= 0 && previousBottom <= enemyTop) {
      hideRecord(enemy);
      play(stompEnemyAudio);
      const stompJump = gameState[STATE_POWERUP_TIMER] > 0 ? JUMP_SPEED * POWERUP_JUMP_MULTIPLIER : JUMP_SPEED;
      playerVelocity[1] = -stompJump / 2;
      gameState[STATE_SCORE] = gameState[STATE_SCORE] + STOMP_SCORE;
      spawnRewardCoin(enemy[RECORD_X], enemy[RECORD_Y]);
    } else {
      beginDeath();
    }
  }
}

/** 更新火球移动并处理火球击中 Goomba。 */
function updateFireballs() {
  for (let i = 0; i < array_length(fireballObjects); i = i + 1) {
    const fireball = fireballObjects[i];
    if (!fireball[RECORD_ACTIVE]) {
      continue;
    }
    fireball[RECORD_X] = fireball[RECORD_X] + fireball[RECORD_VELOCITY_X];
    fireball[RECORD_Y] = fireball[RECORD_Y] + 2;
    if (fireball[RECORD_X] < cameraX - 100 || fireball[RECORD_X] > cameraX + GAME_WIDTH + 100) {
      hideRecord(fireball);
      continue;
    }
    for (let j = 0; j < array_length(enemyObjects); j = j + 1) {
      const enemy = enemyObjects[j];
      if (enemy[RECORD_ACTIVE] && playerOverlapsRecord(fireball[RECORD_X], fireball[RECORD_Y], 14, 14, enemy)) {
        hideRecord(enemy);
        hideRecord(fireball);
        gameState[STATE_SCORE] = gameState[STATE_SCORE] + STOMP_SCORE;
      }
    }
    syncRecord(fireball);
  }
}

/** 检查玩家是否到达终点旗杆。 */
function checkFinish() {
  for (let i = 0; i < array_length(finishObjects); i = i + 1) {
    if (finishObjects[i][RECORD_ACTIVE] && playerTouchesRecord(finishObjects[i])) {
      gameState[STATE_MODE] = MODE_WIN;
      stopBackgroundMusic();
      play(levelClearAudio);
      playClearVoice();
      if (!gameState[7]) {
        gameState[STATE_SCORE] = gameState[STATE_SCORE] + gameState[STATE_COINS] * COIN_SCORE;
        gameState[7] = true;
      }
      messageTextVisible('YOU WIN! PRESS R');
    }
  }
}

/** 进入死亡状态并开始复活倒计时。 */
function beginDeath() {
  if (gameState[STATE_MODE] !== MODE_PLAYING) {
    return undefined;
  }
  gameState[STATE_LIVES] = gameState[STATE_LIVES] - 1;
  stopBackgroundMusic();
  if (gameState[STATE_LIVES] <= 0) {
    play(marioDeathAudio);
    playDeathVoice();
  } else {
    play(hurtAudio);
  }
  gameState[STATE_MODE] = gameState[STATE_LIVES] <= 0 ? MODE_GAME_OVER : MODE_DEAD;
  gameState[STATE_RESPAWN] = 0;
  playerVelocity[0] = 0;
  playerVelocity[1] = -JUMP_SPEED / 1.4;
  messageTextVisible('');
}

/** 重置当前生命的关卡对象。 */
function resetRound() {
  playerPosition[0] = PLAYER_START_X;
  playerPosition[1] = PLAYER_START_Y;
  previousPlayerPosition[0] = PLAYER_START_X;
  previousPlayerPosition[1] = PLAYER_START_Y;
  playerVelocity[0] = 0;
  playerVelocity[1] = 0;
  playerState = 0;
  gameState[STATE_POWERUP_TIMER] = 0;
  cameraX = 0;
  for (let i = 0; i < array_length(plantObjects); i = i + 1) {
    plantObjects[i][RECORD_VELOCITY_X] = 0;
    hideRecord(plantObjects[i]);  }
  for (let i = 0; i < array_length(coinObjects); i = i + 1) {
    if (coinObjects[i][RECORD_POOL] || coinObjects[i][RECORD_OLD_LEVEL] || coinObjects[i][RECORD_USED]) {
      hideRecord(coinObjects[i]);
      coinObjects[i][RECORD_AGE] = 0;
      coinObjects[i][RECORD_VELOCITY_X] = 0;
    } else {
      coinObjects[i][RECORD_ACTIVE] = true;
      coinObjects[i][RECORD_X] = coinObjects[i][RECORD_START_X];
      coinObjects[i][RECORD_Y] = coinObjects[i][RECORD_START_Y];
    }
  }
  for (let i = 0; i < array_length(powerupObjects); i = i + 1) {
    if (powerupObjects[i][RECORD_POOL] || powerupObjects[i][RECORD_OLD_LEVEL]) {
      hideRecord(powerupObjects[i]);
    } else {
      powerupObjects[i][RECORD_ACTIVE] = true;
      powerupObjects[i][RECORD_X] = powerupObjects[i][RECORD_START_X];
      powerupObjects[i][RECORD_Y] = powerupObjects[i][RECORD_START_Y];
    }
  }
  for (let i = 0; i < array_length(enemyObjects); i = i + 1) {
    if (enemyObjects[i][RECORD_OLD_LEVEL]) {
      hideRecord(enemyObjects[i]);
    } else {
      enemyObjects[i][RECORD_ACTIVE] = true;
      enemyObjects[i][RECORD_X] = enemyObjects[i][RECORD_START_X];
      enemyObjects[i][RECORD_Y] = enemyObjects[i][RECORD_START_Y];
      enemyObjects[i][RECORD_VELOCITY_X] = -ENEMY_SPEED;
    }
  }
}

/** 重新开始完整游戏。 */
function restartGame() {
  gameState[STATE_MODE] = MODE_PLAYING;
  gameState[STATE_SCORE] = 0;
  gameState[STATE_LIVES] = 3;
  gameState[STATE_COINS] = 0;
  gameState[STATE_TIME] = 300;
  gameState[STATE_RESPAWN] = 0;
  gameState[STATE_POWERUP_TIMER] = 0;
  gameState[STATE_NEXT_LIFE_COIN] = COINS_PER_LIFE;
  gameState[7] = false;
  resetRound();
  messageTextVisible('');
}

/** 处理死亡倒计时、暂停状态和游戏结束状态。 */
function updateRoundState() {
  if (gameState[STATE_MODE] === MODE_DEAD) {
    gameState[STATE_RESPAWN] = gameState[STATE_RESPAWN] + 1;
    if (gameState[STATE_RESPAWN] >= RESPAWN_DELAY) {
      gameState[STATE_MODE] = MODE_PLAYING;
      resetRound();
      messageTextVisible('');
    }
  }
  return undefined;
}

/** 更新计时器、分数和 HUD 文本。 */
function updateHud() {
  const paddedScore = gameState[STATE_SCORE] < 10 ? '00000' + stringify(gameState[STATE_SCORE]) : stringify(gameState[STATE_SCORE]);
  const paddedCoins = gameState[STATE_COINS] < 10 ? '0' + stringify(gameState[STATE_COINS]) : stringify(gameState[STATE_COINS]);
  update_text(scoreText, 'MARIO ' + paddedScore);
  update_text(coinText, 'COINS ' + paddedCoins + '  LIVES ' + stringify(gameState[STATE_LIVES]));
  update_text(timeText, 'TIME ' + stringify(gameState[STATE_TIME]));
  if (gameState[STATE_POWERUP_TIMER] > 0) {
    update_text(powerText, 'POWER ' + stringify(math_round(gameState[STATE_POWERUP_TIMER] / FRAME_RATE)) + 's');
  } else {
    update_text(powerText, '');
  }
  if (gameState[STATE_MODE] === 'playing') {
    update_text(stateText, 'A D MOVE   SPACE JUMP   S CROUCH   Q FIRE   P PAUSE');
  } else if (gameState[STATE_MODE] === 'paused') {
    update_text(stateText, 'PAUSED   PRESS P TO CONTINUE');
  } else if (gameState[STATE_MODE] === 'win') {
    update_text(stateText, 'YOU WIN   PRESS R TO RESTART');
  } else if (gameState[STATE_MODE] === 'game_over') {
    update_text(stateText, 'GAME OVER   PRESS R TO RESTART');
  } else if (gameState[STATE_MODE] === MODE_LEVEL_SELECT) {
    update_text(stateText, 'PRESS 1, 2 OR 3 TO SELECT A LEVEL');
  }
  update_text(worldText, 'WORLD 1-' + stringify(currentLevel) + '   X ' + stringify(math_round(playerPosition[0])));
}

/** 显示或隐藏中心提示文字。 */
function messageTextVisible(message) {
  update_text(messageText, message);
}

/** 更新死亡弹窗和三关选择弹窗；入参无；返回 undefined；普通游戏状态隐藏覆盖层。 */
function updateOverlay() {
  const mode = gameState[STATE_MODE];
  if (mode === MODE_LEVEL_SELECT) {
    update_position(overlayPanel, [480, 285]);
    update_text(overlayTitle, 'SELECT LEVEL');
    update_text(overlayBody, 'PRESS 1, 2 OR 3 TO START');
    update_text(overlayChoice1, '1  WORLD 1-1   GREEN HILLS');
    update_text(overlayChoice2, '2  WORLD 1-2   BRICK CANYON');
    update_text(overlayChoice3, '3  WORLD 1-3   CASTLE RUN');
    update_position(overlayTitle, [480, 205]);
    update_position(overlayBody, [480, 260]);
    update_position(overlayChoice1, [480, 325]);
    update_position(overlayChoice2, [480, 365]);
    update_position(overlayChoice3, [480, 405]);
  } else if (mode === MODE_DEAD || mode === MODE_GAME_OVER || mode === MODE_WIN) {
    update_position(overlayPanel, [480, 285]);
    update_text(overlayTitle, mode === MODE_WIN ? 'LEVEL CLEAR' : 'MARIO DIED');
    update_text(overlayBody, mode === MODE_WIN ? 'COINS COLLECTED: ' + stringify(gameState[STATE_COINS]) : mode === MODE_GAME_OVER ? 'GAME OVER' : 'YOU LOST A LIFE');
    update_text(overlayChoice1, mode === MODE_WIN ? 'BONUS: ' + stringify(gameState[STATE_COINS] * COIN_SCORE) : 'R  RESTART LEVEL');
    update_text(overlayChoice2, 'L  SELECT LEVEL');
    update_text(overlayChoice3, mode === MODE_DEAD ? 'LIVES LEFT  ' + stringify(gameState[STATE_LIVES]) : 'CHOOSE ANOTHER LEVEL');
    update_position(overlayTitle, [480, 205]);
    update_position(overlayBody, [480, 260]);
    update_position(overlayChoice1, [480, 325]);
    update_position(overlayChoice2, [480, 365]);
    update_position(overlayChoice3, [480, 405]);
  } else {
    update_position(overlayPanel, [-1000, -1000]);
    update_position(overlayTitle, [-1000, -1000]);
    update_position(overlayBody, [-1000, -1000]);
    update_position(overlayChoice1, [-1000, -1000]);
    update_position(overlayChoice2, [-1000, -1000]);
    update_position(overlayChoice3, [-1000, -1000]);
  }
}

/** 每帧更新完整游戏逻辑。 */
function updateGame(currentGameState) {
  // 游戏画布建立后再启动背景音乐，避免 fullSong() 阻塞 build_game()。
  if (!backgroundMusicStarted) {
    startBackgroundMusic();
  }
  previousPlayerPosition[0] = playerPosition[0];
  previousPlayerPosition[1] = playerPosition[1];
  handleInput();
  if (gameState[STATE_MODE] === 'playing') {
    updatePlayerPhysics();
    activateNearbyMysteryBlocks();
    resolveSolidCollisions();
    updateEnemies();
    collectItems();
    updatePowerupState();
    resolveEnemyCollisions();
    updateFireballs();
    updateRewardCoins();
    checkFinish();
    if (playerPosition[1] > GAME_HEIGHT + 80) {
      beginDeath();
    }
    if (get_loop_count() % FRAME_RATE === 0 && gameState[STATE_TIME] > 0) {
      gameState[STATE_TIME] = gameState[STATE_TIME] - 1;
    }
    if (gameState[STATE_TIME] <= 0) {
      beginDeath();
    }
  } else if (gameState[STATE_MODE] !== 'paused' && gameState[STATE_MODE] !== 'win' && gameState[STATE_MODE] !== 'game_over') {
    updateRoundState();
  } else if (gameState[STATE_MODE] === 'dead') {
    updateRoundState();
  }
  updatePiranhaPlants();
  updateClouds();
  updateCamera();
  updatePlayerVisual();
  updateHud();
  updateOverlay();
}

initializeScenery();
initializeLevel();
initializeRewardPools();
createPlayerVisual();
updateCamera();
updatePlayerVisual();
update_loop(updateGame);
build_game();
