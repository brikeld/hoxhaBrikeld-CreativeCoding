import * as Tone from 'tone';

class BackgroundAudio {
  constructor(url) {
    this.player = new Tone.Player({
      url: url,
      loop: false, 
      autostart: true,
    }).toDestination();
  }

  setVolume(volume) {
    this.player.volume.value = volume;
  }
}

export default BackgroundAudio;
