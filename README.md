# Super Mario Source Academy

这是 Source Academy Arcade2D 超级玛丽项目。

## 文件

- `SUPER_MARIO_FINAL_V3.js`：完整游戏代码，包含碰撞、金币、蘑菇、问号方块、敌人、食人花和音效逻辑。
- `SUPER_MARIO_EXTERNAL_AUDIO.js`：使用 GitHub Raw WAV 链接和 `arcade_2d` 音频 API 的完整游戏版本。
- `audio/README.md`：外部音频文件的目录和 Raw URL 说明。

## Source Academy 设置

使用 Source §3 或更高版本，并启用 `arcade_2d`。当前代码保留自定义 `sound` 音符实现；如果加入实际音频文件，可以使用 `arcade_2d.create_audio`、`loop_audio`、`play_audio` 和 `stop_audio`。

## GitHub Raw URL

仓库地址确定后，音频链接格式为：

`https://raw.githubusercontent.com/shu0819-sjy/super-mario-audio/master/audio/<文件名>`
