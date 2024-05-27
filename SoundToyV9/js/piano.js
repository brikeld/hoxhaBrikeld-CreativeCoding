import * as Tone from 'tone';

export default class Piano {
  constructor() {
    this.sampler = new Tone.Sampler({
      urls: {
        A0: "a (1).mp3",
        C1: "a (2).mp3",
        "D#1": "a (3).mp3", 
        "F#1": "a (4).mp3",
        A1: "a (5).mp3",
        C2: "a (6).mp3",
        "D#2": "a (7).mp3",
        "F#2": "a (8).mp3",
        A2: "a (9).mp3",
        C3: "a (10).mp3",
        "D#3": "a (11).mp3",
        "F#3": "a (12).mp3",
        A3: "a (13).mp3",
        C4: "a (14).mp3",
        "D#4": "a (15).mp3",
        "F#4": "a (16).mp3",
        A4: "a (17).mp3",
        C5: "a (18).mp3",
        "D#5": "a (19).mp3",
        "F#5": "a (20).mp3",
        A5: "a (21).mp3",
        // Map remaining notes to existing sounds if needed
        A6: "a (21).mp3",
        C6: "a (21).mp3",
        "D#6": "a (21).mp3",
        "F#6": "a (21).mp3",
        "D#7": "a (21).mp3",
        "F#7": "a (21).mp3",
        A7: "a (21).mp3",
        C7: "a (21).mp3",
      },
      release: 10,
      baseUrl: './soundA/'
    }).toDestination();
  }
}
