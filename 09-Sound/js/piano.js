import * as Tone from 'tone';

export default class Piano {
constructor() {
  this.sampler =  new Tone.Sampler({
        urls: {
          A0: "a (1).wav",
          C1: "a (2).wav",
          "D#1": "a (1).wav",
          "F#1": "a (2).wav",
          A1: "a (3).wav",
          C2: "a (4).wav",
          "D#2": "a (3).wav",
          "F#2": "a (4).wav",
          A2: "a (5).wav",
          C3: "a (6).wav",
          "D#3": "a (5).wav",
          "F#3": "a (6).wav",
          A3: "a (7).wav",
          C4: "a (8).wav",
          "D#4": "a (7).wav",
          "F#4": "a (8).wav",
          A4: "a (9).wav",
          C5: "a (10).wav",
          "D#5": "a (9).wav",
          "F#5": "a (10).wav",
          A5: "a (11).wav",
          C6: "a (12).wav",
          "D#6": "a (11).wav",
          "F#6": "a (12).wav",
          A6: "a (13).wav",
          "D#7": "a ().wav",
          "F#7": "a ().wav",
          A7: "a ()",
          C2: "a ().wav",
        },
   
        // Cela règle la durée de permanence des notes jouées
        release: 10,
   
        // Source locale des sons
        // baseUrl: "./wav/"
   
        //baseUrl: "https://tonejs.github.io/audio/salamander/",
        baseUrl: './soundFX/'

      }).toDestination();
    }
}
