import * as Tone from "tone";
let effect, reverb;

function createEffects() {
  effect = new Tone.FeedbackDelay().toDestination(); // create a delay effect and connect it to the master output
  reverb = new Tone.Reverb({
    // connect a reverb effect and connect it to the master output
    decay: 4, // decay time of 2 seconds.
    wet: 1.0, // fully wet signal
    preDelay: 0.25 // pre-delay time of 0.25 seconds
  });
}

createEffects();

export class CrashSound {
  constructor() {
    this.synth = new Tone.PolySynth({
      volume: -10
    }).toDestination();
    this.synth.connect(effect);
    this.synth.connect(reverb);
    this.synth.set({
      volume: -30,
      envelope: {
        attack: 0.001,
        decay: 0.3,
        sustain: 0.01,
        release: 1.3
      }
    });
    this.synth.set({
      oscillator: {
        type: "square"
      }
    });

    this.pattern = new Tone.Pattern(
      function (time, note) {
        this.synth.triggerAttackRelease(note, "16n");
      }.bind(this),
      ["C4", "C5", "D4", "D5", "E5", "E5", "C6", "D6", "E6", "F6", "G6"],
      "up"
    );
    //https://tonejs.github.io/docs/r12/CtrlPattern

    this.pattern.loop = false;
    this.pattern.interval = "32n";
  }

  reset() {}

  play() {
    this.pattern.index = 0; // reset the index
    this.pattern.stop(); // stop pattern first
    if (this.pattern.state !== "started") {
      // check whether the pattern has already started, and if not, start it.
      this.pattern.start().stop("+0.2"); // start the pattern then stop it 0.2 seconds later
    }
  }
}
