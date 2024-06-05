import * as Tone from 'tone';

export default class Piano {
  constructor() {
    this.lineSamplerLoaded = false;
    this.textSamplerLoaded = false;
    this.iconSamplerLoaded = false;

    this.lineSampler = new Tone.Sampler({
      urls: {
        'C1': "Line.mp3",
        'C2': "DottedLine.mp3"
      },
      baseUrl: './LineSound/',
      onload: () => {
        console.log("LineSampler loaded");
        this.lineSamplerLoaded = true;
      }
    }).toDestination();

    this.textSampler = new Tone.Sampler({
      urls: {
        'C1': "t (1).mp3",
        'C2': "t (2).mp3",
        'C3': "t (3).mp3",
        'C4': "t (4).mp3",
        'C5': "t (5).mp3",
        'C6': "t (6).mp3",
        'C7': "t (7).mp3"
      },
      baseUrl: './TextSound/',
      onload: () => {
        console.log("TextSampler loaded");
        this.textSamplerLoaded = true;
      }
    }).toDestination();

    this.iconSampler = new Tone.Sampler({
      urls: {
        'C1': "i (1).mp3",
        'C2': "i (2).mp3",
        'C3': "i (3).mp3",
        'C4': "i (4).mp3",
        'C5': "i (5).mp3",
        'C6': "i (6).mp3",
        'C7': "i (7).mp3",
        'C8': "i (8).mp3"
      },
      baseUrl: './IconSound/',
      onload: () => {
        console.log("IconSampler loaded");
        this.iconSamplerLoaded = true;
      }
    }).toDestination();
  }

  playLineSound(dotted = false) {
    if (this.lineSamplerLoaded) {
      const note = dotted ? 'C2' : 'C1';
      this.lineSampler.triggerAttackRelease(note, '1n', "+0.1");
    } else {
      console.error("LineSampler not loaded");
    }
  }

  playTextSound(index) {
    if (this.textSamplerLoaded) {
      const notes = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'];
      const note = notes[index % notes.length];
      this.textSampler.triggerAttackRelease(note, '1n', "+0.1");
    } else {
      console.error("TextSampler not loaded");
    }
  }

  playIconSound(index) {
    if (this.iconSamplerLoaded) {
      const notes = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'];
      const note = notes[index % notes.length];
      this.iconSampler.triggerAttackRelease(note, '1n', "+0.1");
    } else {
      console.error("IconSampler not loaded");
    }
  }
}
