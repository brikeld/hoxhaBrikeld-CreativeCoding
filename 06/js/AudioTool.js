class AudioTool {
  constructor(audioFile) {
    this.audioFile = audioFile;
    this.audio = new Audio(this.audioFile);
    this.isPlaying = false;
    this.audioContext = null;
    this.analyser = null;
    this.bufferLength = null;
    this.dataFrequency = null;
    this.dataFloatFrequency = null;
    this.dataWave = null;
    this.initAudioContext();
  }

  initAudioContext() {
    // Initialize the AudioContext
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.setupAnalyser();
  }

  setupAnalyser() {
    // Set up the Analyser node
    this.analyser = this.audioContext.createAnalyser();
    this.source = this.audioContext.createMediaElementSource(this.audio);
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    this.analyser.fftSize = 2048;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataFrequency = new Uint8Array(this.bufferLength);
    this.dataFloatFrequency = new Float32Array(this.bufferLength);
    this.dataWave = new Uint8Array(this.bufferLength);
  }

  updateWaveForm() {
    // Update waveform data
    if (this.audioContext) {
      this.analyser.getByteTimeDomainData(this.dataWave);
    }
  }

  updateFrequency() {
    // Update frequency data
    if (this.audioContext) {
      this.analyser.getByteFrequencyData(this.dataFrequency);
    }
  }

  updatedFloatFrequency() {
    // Update float frequency data
    if (this.audioContext) {
      this.analyser.getFloatFrequencyData(this.dataFloatFrequency);
    }
  }

  play() {
    // Play the audio, and handle browser autoplay policy
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    if (!this.isPlaying) {
      this.audio.play();
      this.isPlaying = true;
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    } else {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      this.audio.play();
      this.isPlaying = true;
    }
  }
}
