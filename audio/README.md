# Audio Assets

请将真实的 `.mp3`、`.wav` 或 `.ogg` 文件放在此目录，例如：

- `super-mario-theme.mp3`
- `jump.wav`
- `stomp.wav`
- `coin.wav`
- `power-up.wav`
- `hurt.wav`
- `death.wav`

上传后，Source Academy 中可以使用对应 Raw URL：

```javascript
const audioBaseUrl = 'https://raw.githubusercontent.com/shu0819-sjy/super-mario-audio/master/audio/';
const backgroundMusic = loop_audio(create_audio(audioBaseUrl + 'super-mario-theme.mp3', 0.35));
```
