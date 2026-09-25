# super-mario-audio

[![CI](https://github.com/shu0819-sjy/super-mario-audio/actions/workflows/ci.yml/badge.svg)](https://github.com/shu0819-sjy/super-mario-audio/actions/workflows/ci.yml)

A Source Academy **Arcade2D** Super Mario learning project with optional external WAV playback.

This is a course-style demo, not a commercial engine rewrite. Most variants are single-file Source programs you paste into the Source Academy editor.

## Requirements

- [Source Academy](https://sourceacademy.org/) with **Source §3** (or newer)
- Enable the **`arcade_2d`** module
- For synthesized BGM variants, also enable the **`sound`** module
- For curve demos, enable the **`curve`** module

## Quick start (recommended)

1. Open Source Academy and create a Source §3 playground with `arcade_2d` enabled.
2. Copy the contents of [`SUPER_MARIO_EXTERNAL_AUDIO.js`](./SUPER_MARIO_EXTERNAL_AUDIO.js).
3. Run the program. Audio loads from this repo's Raw URLs under `main/audio/`.

Controls (shown in-game):

| Key | Action |
|---|---|
| `A` / `D` | Move |
| `Space` | Jump |
| `S` | Crouch |
| `Q` | Fire |
| `P` | Pause |

## Scoring (as implemented)

Starting state: **3 lives**, **300** time units, score/coins at zero.

| Event | Points |
|---|---|
| Collect coin | +100 score, +1 coin |
| Stomp enemy | +100 score |
| Collect power-up | +1000 score |

Every **100 coins** grants **+1 life** (`COINS_PER_LIFE = 100`). Reach the finish flag to enter the win overlay; run out of lives for game over.

## Repository layout

| Path | Role |
|---|---|
| `SUPER_MARIO_EXTERNAL_AUDIO.js` | Full game + GitHub Raw WAV audio (recommended) |
| `SUPER_MARIO_FINAL_V3.js` | Full game + Source `sound` synthesized BGM |
| `SUPER_MARIO_GAME_*.js` | Alternate win-screen / music experiments |
| `SUPER_MARIO_CURVE_SYNC.js` | Sound + curve visualization sync demo |
| `CURVE_VIDEO_WITH_EXTERNAL_AUDIO.js` | Short curve animation driven by a WAV |
| `external-audio-template.js` | Minimal Raw-URL audio helper snippet |
| `audio/` | WAV assets used by the external-audio build |
| `audio/README.md` | Notes on placing additional audio files |

Raw audio base URL used by the recommended build:

```text
https://raw.githubusercontent.com/shu0819-sjy/super-mario-audio/main/audio/
```

## License

No `LICENSE` file is published in this repository yet. Treat the code and assets as source-available for personal / academic study unless a license is added later. Do not assume MIT or public-domain rights.
