# Quiz Systeem - Documentatie

## Overzicht

Het quiz systeem is volledig geïntegreerd in het Roeland Vrolijk Muziekonderwijs Platform. Gebruikers kunnen hun kennis testen met multiple choice vragen en open tekst vragen.

---

## 📚 Functies

### Quiz Types
1. **Multiple Choice** - Kies het juiste antwoord uit meerdere opties
2. **Text Input** - Typ het correcte antwoord (meerdere acceptabele antwoorden mogelijk)

### Features
- ✅ Real-time feedback met uitleg
- ✅ Visuele indicatoren (groen = correct, rood = fout)
- ✅ Progressie tracking
- ✅ Scores en behaalde percentages
- ✅ Punten verdienen bij slagen
- ✅ Herkansen indien niet gehaald
- ✅ Flexibel unlock systeem (specifieke video OF alle video's)
- ✅ Altijd zichtbare quiz knoppen
- ✅ Opgeslagen in localStorage

---

## 🎯 Quiz Data Structuur

### Locatie: `data/quizzes.json`

```json
{
  "quizzes": [
    {
      "id": "quiz-1-1",
      "courseId": "course-1",
      "chapterId": "chapter-1-1",
      "title": "Quiz: Introductie Muziekonderwijs",
      "description": "Test je kennis over de basis van muziekonderwijs",
      "unlockRequirement": {
        "type": "all-videos"
      },
      "points": 20,
      "passingScore": 70,
      "questions": [...]
    }
  ]
}
```

### Quiz Velden:
- `id` - Unieke identifier voor de quiz
- `courseId` - Welke cursus
- `chapterId` - Welk hoofdstuk
- `title` - Titel van de quiz
- `description` - Korte beschrijving
- `unlockRequirement` - Object dat bepaalt wanneer quiz ontgrendelt (zie hieronder)
- `points` - Punten bij slagen
- `passingScore` - Minimaal percentage om te slagen (bijv. 70)
- `questions` - Array van vraag objecten

### Unlock Requirements:

**Optie 1: Alle video's vereist**
```json
"unlockRequirement": {
  "type": "all-videos"
}
```
Quiz ontgrendelt pas als ALLE video's in het hoofdstuk voltooid zijn.

**Optie 2: Specifieke video vereist**
```json
"unlockRequirement": {
  "type": "specific-video",
  "videoId": "video-1-2-2"
}
```
Quiz ontgrendelt zodra de opgegeven video voltooid is.

---

## ❓ Vraag Types

### Multiple Choice

```json
{
  "id": "q1-1-1",
  "type": "multiple-choice",
  "question": "Welke van de volgende gebieden wordt NIET beïnvloed door muziekonderwijs?",
  "options": [
    "Cognitieve ontwikkeling",
    "Emotionele ontwikkeling",
    "Sociale ontwikkeling",
    "Financiële ontwikkeling"
  ],
  "correctAnswer": 3,
  "explanation": "Muziekonderwijs heeft vooral impact op cognitieve, emotionele en sociale ontwikkeling."
}
```

**Velden:**
- `type`: `"multiple-choice"`
- `question`: De vraag
- `options`: Array van antwoord opties
- `correctAnswer`: Index van correcte optie (0-based)
- `explanation`: Uitleg die getoond wordt na beantwoorden

### Text Input

```json
{
  "id": "q1-1-3",
  "type": "text-input",
  "question": "Noem één manier waarop muziek de sociale ontwikkeling bevordert.",
  "correctAnswers": [
    "samenwerken",
    "samenwerking",
    "samen spelen",
    "communicatie"
  ],
  "caseSensitive": false,
  "explanation": "Muziek maken in groepen leert kinderen samenwerken en communiceren."
}
```

**Velden:**
- `type`: `"text-input"`
- `question`: De vraag
- `correctAnswers`: Array van acceptabele antwoorden
- `caseSensitive`: Boolean - hoofdlettergevoelig? (meestal `false`)
- `explanation`: Uitleg na beantwoorden

---

## 🎮 Gebruikersflow

### 1. Quiz Ontgrendelen
- Quiz knoppen zijn ALTIJD zichtbaar en klikbaar
- Vergrendelde quiz toont 🔒 icoon
- Lock message toont wat vereist is:
  - "🔒 Voltooi eerst alle video's in dit hoofdstuk" (all-videos)
  - "🔒 Voltooi eerst de vereiste video" (specific-video)
- Bij klikken op vergrendelde quiz: zie lijst van vereiste video's

### 2. Quiz Starten
- Klik op quiz knop (📝 icoon)
- Navigeert naar `/quiz/:quizId`
- Toont vraag 1 van X

### 3. Vragen Beantwoorden
**Multiple Choice:**
- Klik op een optie (A, B, C, D)
- Klik "Controleer Antwoord"
- Zie feedback (groen = goed, rood = fout)
- Lees uitleg
- Klik "Volgende"

**Text Input:**
- Typ antwoord in tekstveld
- Klik "Controleer Antwoord"
- Zie of antwoord geaccepteerd wordt
- Lees uitleg
- Klik "Volgende"

### 4. Resultaten
- Score wordt berekend (percentage correct)
- Grote cirkel met score
- ✅ "Gehaald!" of ❌ "Nog Niet Gehaald"
- Punten toegekend als gehaald (≥70%)
- Opties: "Doorgaan" of "Opnieuw Proberen"

### 5. Progress Update
- Voltooid quiz wordt opgeslagen
- Punten toegevoegd aan totaal
- Level mogelijk omhoog
- Achievements kunnen ontgrendelen
- Quiz knop toont ✅ en score

---

## 💾 Data Opslag

### User Progress Structuur

```json
{
  "completedQuizzes": [
    {
      "quizKey": "course-1-chapter-1-1-quiz-1-1",
      "score": 85,
      "completedAt": "2024-12-29T14:30:00.000Z"
    }
  ],
  "stats": {
    "totalQuizzesPassed": 1
  }
}
```

### LocalStorage
- Automatisch opgeslagen via progressStore
- Sleutel: `roeland-user-progress`
- Updates direct na quiz voltooien

---

## 🎨 UI Componenten

### 1. Quiz Knop (in CourseList)
**States:**
- 🔒 Vergrendeld (grijs, disabled)
- 📝 Beschikbaar (oranje gradient)
- ✅ Voltooid (groen, toont score)

**Styling:**
- Oranje accent kleur voor actieve quizzes
- Groen voor voltooide quizzes
- Hover effect met transform
- Duidelijke metadata (punten, vereiste score)

### 2. Quiz Component
**Onderdelen:**
- Header met titel en progress bar
- Vraag container
- Antwoord opties/input veld
- Uitleg box (na beantwoorden)
- Navigatie knoppen (Vorige/Volgende)
- Results screen

**Kleuren:**
- Primair: Blauw (#2c5f7c)
- Accent: Oranje (#e8974e)
- Correct: Groen (#6b9e78)
- Fout: Rood (#c85a54)

---

## 🔧 Technische Implementatie

### DataService Methods

```javascript
// Quiz voltooien
await dataService.markQuizComplete(courseId, chapterId, quizId, score);

// Check of quiz voltooid is
const isCompleted = await dataService.isQuizComplete(courseId, chapterId, quizId);
```

### Componenten
- `src/components/Quiz.svelte` - Hoofd quiz component
- `src/routes/QuizPage.svelte` - Quiz route wrapper
- `src/components/CourseList.svelte` - Toont quiz knoppen

### Routes
- `/quiz/:quizId` - Quiz pagina

---

## 📊 Scoring Systeem

### Berekening
```javascript
correctAnswers / totalQuestions * 100 = score%
```

### Slagen
- Score ≥ `passingScore` (meestal 70%)
- Bij slagen: punten toegekend
- Bij niet slagen: kan opnieuw proberen (geen punten aftrek)

### Punten Toekenning
- Alleen bij eerste keer slagen
- Vaste punten per quiz (bijv. 20, 25, 30)
- Niet gebaseerd op score percentage

---

## ✨ Features om Toe te Voegen

### Toekomst v1.1
- [ ] Timer per vraag (optioneel)
- [ ] Bonus punten voor snelle antwoorden
- [ ] Quiz overzicht pagina (alle scores)
- [ ] Leaderboard per quiz
- [ ] Quiz herhalen om score te verbeteren

### Toekomst v1.2
- [ ] Audio vragen (luister en beantwoord)
- [ ] Afbeelding vragen (herken instrument)
- [ ] Drag-and-drop vragen
- [ ] Muzieknotatie vragen (met VexFlow)

### Toekomst v2.0
- [ ] Interactieve audio quizzes (Tone.js)
- [ ] Pitch detection vragen (zing de noot)
- [ ] Ritme tap vragen (klap het ritme)
- [ ] MIDI keyboard vragen (speel de noot)

---

## 🎓 Didactische Tips

### Goede Quiz Vragen Maken

**DO:**
- ✅ Focus op één concept per vraag
- ✅ Gebruik duidelijke taal
- ✅ Geef nuttige uitleg bij feedback
- ✅ Mix makkelijke en moeilijke vragen
- ✅ Test praktische kennis, niet alleen theorie

**DON'T:**
- ❌ Trick vragen (verwarrend)
- ❌ Dubbele negatieven
- ❌ "Alle bovenstaande" als makkelijke uitweg
- ❌ Te lange vragen/antwoorden
- ❌ Vragen die niet in video behandeld zijn

### Text Input Tips
- Meerdere spellingen accepteren
- Synoniemen toevoegen
- Case-insensitive maken
- Lidwoorden optioneel ("de beat" / "beat")

---

## 🐛 Troubleshooting

### Quiz Verschijnt Niet
**Check:**
1. Is quiz toegevoegd aan `data/quizzes.json`?
2. Klopt `courseId` en `chapterId`?
3. Refresh de pagina (quiz data wordt bij onMount geladen)

### Quiz Niet Ontgrendeld
**Check:**
1. Is `unlockRequirement` correct ingesteld?
2. Voor `type: "all-videos"`: zijn ALLE video's voltooid?
3. Voor `type: "specific-video"`: is de specifieke `videoId` correct?
4. Video key format: `courseId-chapterId-videoId`
5. Check `userProgress.completedVideos` array in browser console

### Antwoord Niet Geaccepteerd
**Check:**
1. Staat antwoord in `correctAnswers` array?
2. Is `caseSensitive` correct ingesteld?
3. Spaties of leestekens?

### Punten Niet Toegekend
**Check:**
1. Score ≥ `passingScore`?
2. Quiz al eerder voltooid? (punten alleen eerste keer)
3. Check browser console voor errors

---

## 📝 Quiz Toevoegen - Stap voor Stap

### Stap 1: Data Toevoegen
Open `data/quizzes.json` en voeg toe:

```json
{
  "id": "quiz-1-3",
  "courseId": "course-1",
  "chapterId": "chapter-1-3",
  "title": "Quiz: Jouw Onderwerp",
  "description": "Test je kennis over...",
  "unlockRequirement": {
    "type": "all-videos"
  },
  "points": 25,
  "passingScore": 70,
  "questions": [
    {
      "id": "q1-3-1",
      "type": "multiple-choice",
      "question": "Jouw vraag?",
      "options": ["Optie 1", "Optie 2", "Optie 3", "Optie 4"],
      "correctAnswer": 0,
      "explanation": "Uitleg waarom dit het antwoord is."
    }
  ]
}
```

**Voor quiz na specifieke video:**
```json
"unlockRequirement": {
  "type": "specific-video",
  "videoId": "video-1-3-2"
}
```

### Stap 2: Testen
1. Refresh de pagina
2. Voltooi de vereiste video
3. Quiz knop verschijnt automatisch
4. Klik en test!

### Stap 3: Verfijnen
- Test met verschillende gebruikers
- Pas moeilijkheidsgraad aan
- Verbeter feedback teksten
- Voeg meer vragen toe

---

## 🎯 Best Practices

### Aantal Vragen
- **Kort** (3-4 vragen): Na elk hoofdstuk
- **Medium** (5-7 vragen): Einde module
- **Lang** (10+ vragen): Eindtoets cursus

### Passing Score
- **Makkelijk materiaal**: 80-90%
- **Standaard**: 70-80%
- **Moeilijk materiaal**: 60-70%

### Punten Toekenning
- Korte quiz (3-4 vragen): 15-20 punten
- Medium quiz (5-7 vragen): 20-30 punten
- Lange quiz (10+ vragen): 30-50 punten

---

## 📈 Analytics (Toekomstig)

Wanneer backend wordt toegevoegd:
- Gemiddelde scores per quiz
- Meest gemiste vragen
- Tijd per vraag
- Aantal pogingen
- Pass rate percentage

---

## ✅ Checklist voor Nieuwe Quiz

- [ ] Unieke `id` gekozen
- [ ] Correct `courseId` en `chapterId`
- [ ] `unlockRequirement` correct ingesteld:
  - [ ] `type: "all-videos"` voor hoofdstuk-eindquiz
  - [ ] `type: "specific-video"` met `videoId` voor tussentijdse quiz
- [ ] Passende `points` waarde
- [ ] `passingScore` ingesteld (70% standaard)
- [ ] Minimaal 3 vragen
- [ ] Mix van vraag types
- [ ] Alle vragen hebben `explanation`
- [ ] Text input heeft meerdere `correctAnswers`
- [ ] Quiz getest door voltooien
- [ ] Quiz getest in vergrendelde staat
- [ ] Feedback teksten gelezen en goedgekeurd

---

**Succes met het maken van quizzes!** 🎓📝✨