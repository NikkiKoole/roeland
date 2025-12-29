# Audio & MIDI Integration voor Muziekonderwijs Platform

## Overzicht

Voor een muziekonderwijs platform zijn er verschillende JavaScript libraries die audio en MIDI functionaliteit kunnen toevoegen. Hier is een overzicht van de beste opties voor deze use case.

---

## 🎵 Audio Libraries

### 1. **Tone.js** (STERK AANBEVOLEN)
**Website:** https://tonejs.github.io/

**Wat het doet:**
- Muzikale timing en scheduling
- Synthesizers en samples
- Audio effects
- Sequencing en patterns
- Gebaseerd op Web Audio API

**Perfect voor:**
- ✅ Ritme-oefeningen met metronoom
- ✅ Melodie-herkenning oefeningen
- ✅ Interactieve muziekspellen
- ✅ Toonhoogte training

**Voorbeeld gebruik:**
```javascript
import * as Tone from 'tone';

// Metronoom voor ritme-oefeningen
const synth = new Tone.Synth().toDestination();
const loop = new Tone.Loop((time) => {
  synth.triggerAttackRelease("C5", "8n", time);
}, "4n");

// Start metronoom
Tone.Transport.start();
loop.start(0);
```

**Installatie:**
```bash
npm install tone
```

---

### 2. **Pizzicato.js**
**Website:** https://alemangui.github.io/pizzicato/

**Wat het doet:**
- Eenvoudiger dan Tone.js
- Audio effecten
- Sound synthesis
- Geluid laden en afspelen

**Perfect voor:**
- ✅ Simpele audio feedback (klik geluiden, beloningen)
- ✅ Basis synthesizer functies
- ✅ Quick wins zonder veel complexiteit

---

## 🎹 MIDI Libraries

### 1. **WebMidi.js** (AANBEVOLEN)
**Website:** https://webmidijs.org/

**Wat het doet:**
- Wrapper voor Web MIDI API
- Detecteer MIDI keyboards
- Lees noten, velocity, pedaal
- Stuur MIDI commando's

**Perfect voor:**
- ✅ MIDI keyboard input voor piano-oefeningen
- ✅ Noot-herkenning games
- ✅ Speel-langs lessen
- ✅ Ritme timing oefeningen

**Voorbeeld gebruik:**
```javascript
import { WebMidi } from 'webmidi';

WebMidi.enable((err) => {
  if (err) {
    console.log("WebMidi kon niet worden ingeschakeld:", err);
    return;
  }

  // Eerste MIDI input
  const input = WebMidi.inputs[0];

  // Luister naar noten
  input.addListener('noteon', (e) => {
    console.log(`Noot gespeeld: ${e.note.name}${e.note.octave}`);
    console.log(`Velocity: ${e.velocity}`);
    // Check of juiste noot voor oefening
  });
});
```

**Installatie:**
```bash
npm install webmidi
```

---

## 🎤 Microfoon / Pitch Detection

### 1. **Pitchy** (SIMPEL & LICHT)
**GitHub:** https://github.com/ianprime0509/pitchy

**Wat het doet:**
- Toonhoogte detectie van microfoon
- Real-time pitch tracking
- Lightweight (4KB)

**Perfect voor:**
- ✅ Zang-oefeningen (ben je op de juiste toon?)
- ✅ Stem training
- ✅ Eenvoudige pitch games

**Voorbeeld:**
```javascript
import { PitchDetector } from 'pitchy';

const audioContext = new AudioContext();
const analyserNode = audioContext.createAnalyser();
const detector = PitchDetector.forFloat32Array(analyserNode.fftSize);

navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const sourceNode = audioContext.createMediaStreamSource(stream);
    sourceNode.connect(analyserNode);

    const buffer = new Float32Array(detector.inputLength);

    function updatePitch() {
      analyserNode.getFloatTimeDomainData(buffer);
      const [pitch, clarity] = detector.findPitch(buffer, audioContext.sampleRate);

      if (clarity > 0.95) {
        console.log(`Toonhoogte: ${pitch.toFixed(2)} Hz`);
        // Vergelijk met verwachte noot
      }

      requestAnimationFrame(updatePitch);
    }

    updatePitch();
  });
```

---

### 2. **ml5.js PitchDetection**
**Website:** https://ml5js.org/

**Wat het doet:**
- Machine learning voor audio
- Pitch detection model (CREPE)
- Zeer nauwkeurig

**Perfect voor:**
- ✅ Professionele pitch detection
- ✅ Complexe zang-analyse
- ✅ Wanneer nauwkeurigheid belangrijk is

**Let op:** Groter (ML model = ~10MB)

---

## 🎼 Muzieknotatie

### 1. **VexFlow**
**Website:** https://www.vexflow.com/

**Wat het doet:**
- Render muzieknotatie (bladmuziek)
- Interactieve partituren
- Support voor alle muziek symbolen

**Perfect voor:**
- ✅ Toon bladmuziek in oefeningen
- ✅ Visualiseer noten tijdens spelen
- ✅ Noten leren lezen
- ✅ Interactieve partituren

**Voorbeeld:**
```javascript
import Vex from 'vexflow';

const { Factory } = Vex.Flow;
const vf = new Factory({ renderer: { elementId: 'notation' }});

const score = vf.EasyScore();
const system = vf.System();

system.addStave({
  voices: [
    score.voice(score.notes('C5/q, D5, E5, F5'))
  ]
}).addClef('treble');

vf.draw();
```

---

## 🎮 Praktische Use Cases voor dit Platform

### 1. **Ritme Oefening met Metronoom**
```javascript
// Tone.js
- Metronoom met instelbare tempo
- Visuele feedback (flashende cirkel op beat)
- Gebruiker klikt/tapt mee
- Score gebaseerd op timing nauwkeurigheid
```

### 2. **Toonhoogte Herkenning Spel**
```javascript
// Pitchy + Tone.js
- Speel een noot (Tone.js synthesizer)
- Gebruiker zingt de noot na
- Microfoon detecteert pitch (Pitchy)
- Feedback of het correct is
```

### 3. **MIDI Piano Oefeningen**
```javascript
// WebMidi.js + VexFlow
- Toon bladmuziek (VexFlow)
- Wacht op MIDI keyboard input
- Highlight gespeelde noten
- Score bij juiste noten
```

### 4. **Ritme Klap Game**
```javascript
// Tone.js
- Speel ritmisch patroon af
- Gebruiker klapt mee (microfoon detecteert volume pieken)
- Vergelijk timing
- Score gebaseerd op precisie
```

### 5. **Stem Warm-up Oefening**
```javascript
// Pitchy + Tone.js
- Speel oplopende tonen
- Gebruiker zingt mee
- Real-time pitch feedback
- Visuele indicator (groen = goed, rood = off-pitch)
```

---

## 📦 Aanbevolen Tech Stack

### Voor Beginners (Quick Start):
```
- Tone.js (voor metronoom, simpele synth)
- Pitchy (voor pitch detection)
```

### Voor Geavanceerd:
```
- Tone.js (complexe audio)
- WebMidi.js (MIDI keyboard support)
- VexFlow (muzieknotatie)
- Pitchy (pitch detection)
```

---

## 🚀 Implementatie Stappenplan

### Fase 1: Basis Audio (Week 1)
1. Installeer Tone.js
2. Maak simpele metronoom component
3. Voeg toe aan ritme-oefeningen

### Fase 2: Pitch Detection (Week 2)
1. Installeer Pitchy
2. Maak microfoon toegang component
3. Simpel pitch detection spel
4. Feedback systeem

### Fase 3: MIDI Support (Week 3)
1. Installeer WebMidi.js
2. MIDI device detection
3. Note-on/off events
4. Integreer met quizzes

### Fase 4: Muzieknotatie (Week 4)
1. Installeer VexFlow
2. Render simpele bladmuziek
3. Interactieve noten
4. Highlight gespeelde noten

---

## ⚠️ Browser Compatibility

### Web Audio API
✅ Chrome, Firefox, Safari, Edge (modern versions)
❌ IE11

### Web MIDI API
✅ Chrome, Edge
⚠️ Firefox (flag required)
❌ Safari (niet ondersteund)

### MediaDevices (Microphone)
✅ Alle moderne browsers
⚠️ Vereist HTTPS (behalve localhost)

---

## 🎯 Concrete Voorbeelden voor Roeland

### Voorbeeld 1: Ritme Quiz met Audio
```svelte
<script>
  import * as Tone from 'tone';
  
  let isPlaying = false;
  
  async function playRhythm() {
    await Tone.start();
    const synth = new Tone.Synth().toDestination();
    
    // Speel ritme: kwart, kwart, achtste, achtste, kwart
    const now = Tone.now();
    synth.triggerAttackRelease("C5", "8n", now);
    synth.triggerAttackRelease("C5", "8n", now + 0.5);
    synth.triggerAttackRelease("C5", "8n", now + 1);
    synth.triggerAttackRelease("C5", "8n", now + 1.25);
    synth.triggerAttackRelease("C5", "8n", now + 1.5);
  }
</script>

<button on:click={playRhythm}>
  🎵 Speel Ritme
</button>
```

### Voorbeeld 2: Pitch Detection Game
```svelte
<script>
  import { onMount } from 'svelte';
  import { PitchDetector } from 'pitchy';
  
  let currentPitch = 0;
  let targetNote = 'C4'; // 261.63 Hz
  let isCorrect = false;
  
  onMount(async () => {
    const audioContext = new AudioContext();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    
    const detector = PitchDetector.forFloat32Array(analyser.fftSize);
    const buffer = new Float32Array(detector.inputLength);
    
    function detect() {
      analyser.getFloatTimeDomainData(buffer);
      const [pitch, clarity] = detector.findPitch(buffer, audioContext.sampleRate);
      
      if (clarity > 0.9) {
        currentPitch = pitch.toFixed(2);
        // Check if within 10 Hz of target (261.63 for C4)
        isCorrect = Math.abs(pitch - 261.63) < 10;
      }
      
      requestAnimationFrame(detect);
    }
    
    detect();
  });
</script>

<div class="pitch-game">
  <h3>Zing een C (Do)</h3>
  <div class="pitch-display" class:correct={isCorrect}>
    {currentPitch} Hz
  </div>
  {#if isCorrect}
    <p>✅ Perfect!</p>
  {/if}
</div>

<style>
  .pitch-display {
    font-size: 2rem;
    padding: 2rem;
    background: #f0f0f0;
    border-radius: 1rem;
  }
  
  .pitch-display.correct {
    background: #d4edda;
    color: #155724;
  }
</style>
```

### Voorbeeld 3: MIDI Piano Oefening
```svelte
<script>
  import { onMount } from 'svelte';
  import { WebMidi } from 'webmidi';
  
  let midiEnabled = false;
  let targetNotes = ['C4', 'E4', 'G4']; // C majeur akkoord
  let playedNotes = [];
  
  onMount(() => {
    WebMidi.enable((err) => {
      if (err) {
        console.log('MIDI niet beschikbaar');
        return;
      }
      
      midiEnabled = true;
      const input = WebMidi.inputs[0];
      
      if (input) {
        input.addListener('noteon', (e) => {
          const noteName = `${e.note.name}${e.note.octave}`;
          playedNotes = [...playedNotes, noteName];
          
          // Check of akkoord compleet is
          if (targetNotes.every(note => playedNotes.includes(note))) {
            alert('🎉 Correct akkoord!');
          }
        });
        
        input.addListener('noteoff', (e) => {
          const noteName = `${e.note.name}${e.note.octave}`;
          playedNotes = playedNotes.filter(n => n !== noteName);
        });
      }
    });
  });
</script>

<div class="midi-exercise">
  {#if !midiEnabled}
    <p>⚠️ MIDI keyboard niet gedetecteerd</p>
  {:else}
    <h3>Speel een C majeur akkoord</h3>
    <div class="target-notes">
      {#each targetNotes as note}
        <span class="note" class:played={playedNotes.includes(note)}>
          {note}
        </span>
      {/each}
    </div>
  {/if}
</div>
```

---

## 💡 Conclusie

**Start met Tone.js** voor basis audio functionaliteit (metronoom, feedback geluiden).

**Voeg Pitchy toe** voor zang-oefeningen met pitch detection.

**Overweeg WebMidi.js** als je MIDI keyboard support wilt (vooral voor piano/toetsenboard lessen).

**Gebruik VexFlow** wanneer je muzieknotatie wilt tonen in de lessen.

Dit geeft een sterke basis voor interactieve muziekonderwijs oefeningen! 🎵🎹🎤