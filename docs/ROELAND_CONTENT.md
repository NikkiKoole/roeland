# Roeland Vrolijk - Content Integratie Instructies

## YouTube Videos Toevoegen

Beste Roeland,

Dit bestand helpt je om jouw eigen YouTube video's toe te voegen aan het platform.

## Stap 1: Vind je YouTube Video IDs

Als je je YouTube videos hebt:

1. Ga naar je YouTube kanaal
2. Open een video
3. Kijk naar de URL: `https://www.youtube.com/watch?v=VIDEO_ID_HIER`
4. Kopieer het VIDEO_ID gedeelte

**Voorbeeld:**
- URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- Video ID: `dQw4w9WgXcQ`

## Stap 2: Update data/courses.json

Open het bestand `data/courses.json` en vervang de placeholder video IDs met jouw eigen video IDs.

### Huidige Placeholder Videos

Het systeem bevat nu placeholder videos. Vervang deze met jouw eigen content:

```json
{
  "id": "video-1-1-1",
  "title": "Titel van jouw video",
  "youtubeId": "JOUW_VIDEO_ID_HIER",
  "duration": "10:30",
  "description": "Beschrijving van de video",
  "points": 10
}
```

## Cursusstructuur Suggesties

Gebaseerd op je expertise als muziek- en onderwijsprofessional, hier zijn enkele cursus ideeën:

### Cursus 1: Basis Muziekonderwijs voor Aanstaande Docenten
**Hoofdstukken:**
- Waarom muziekonderwijs belangrijk is
- Het opzetten van een muziekles
- Ritme en beweging in de klas

### Cursus 2: Zingen met Kinderen
**Hoofdstukken:**
- Vocale ontwikkeling bij kinderen
- Liedkeuze voor verschillende leeftijden
- Opwarmoefeningen en technieken

### Cursus 3: Instrumenten in de Klas
**Hoofdstukken:**
- Kennismaking met klasinstrumenten
- Orff-instrumentarium
- Ritme-instrumenten

### Cursus 4: Creatieve Muziekprojecten
**Hoofdstukken:**
- Improvisatie en muzikale creativiteit
- Liedjes componeren met kinderen
- Muziek en andere vakken verbinden

## SoundCloud Integratie

Je hebt tracks op SoundCloud die kunnen worden gebruikt:
- "Durf te spelen!" (58 minuten - perfect voor een lange workshop video)
- "Nos Amistad" (Piano)
- "Slaapliedje Voor Lieve" (Piano)

**Let op:** De huidige implementatie gebruikt YouTube. Om SoundCloud te integreren zou je een aangepaste player component nodig hebben.

## Styling Aanpassingen

De kleuren zijn aangepast naar een professionele, warme uitstraling geïnspireerd door je website:
- Hoofdkleur: Blauw-groen (#2c5f7c) 
- Accent: Warm oranje (#e8974e)
- Achtergrond: Zacht off-white (#f5f5f0)

Je kunt deze kleuren aanpassen in `src/app.css` bij de `:root` sectie.

## Nederlandse Vertalingen

De interface is gedeeltelijk vertaald naar het Nederlands:
- "Cursussen" in plaats van "Courses"
- "Mijn Voortgang" in plaats van "My Progress"
- "punten" in plaats van "points"

Wil je meer vertalingen? Update de teksten in:
- `src/App.svelte`
- `src/components/CourseList.svelte`
- `src/components/ProgressDashboard.svelte`
- `src/components/VideoPlayer.svelte`

## Aanbevelingen voor Content

Gebaseerd op je profiel ("creativiteit is voor mij een vanzelfsprekende eigenschap"):

1. **Maak korte, praktische videos** (5-15 minuten)
2. **Focus op doe-opdrachten** - dingen die docenten direct kunnen toepassen
3. **Gebruik voorbeelden** uit je 25+ jaar ervaring
4. **Mix theorie met praktijk** - "lef en toewijding" komt door doen
5. **Interactieve elementen** - laat docenten zelf experimenteren

## Video Opname Tips

- **Lengte:** 5-15 minuten voor theorie, tot 30 minuten voor praktische workshops
- **Structuur:** Intro (1 min) → Hoofdinhoud → Samenvatting (1 min)
- **Benoem aan het einde:** Wat kunnen docenten nu gaan doen?
- **Gebruik voorbeelden** uit de praktijk
- **Laat instrumenten/materialen zien** als relevant

## Punten Systeem

Stel per video een passend aantal punten in:
- Korte intro videos (5-10 min): 10-15 punten
- Standaard lessen (10-20 min): 15-25 punten
- Diepgaande workshops (20-40 min): 25-40 punten
- Complete projecten (40+ min): 40-60 punten

## Content Unlock Strategie

Gebruik `requiredPoints` in cursussen om een logische volgorde te creëren:

```json
{
  "id": "course-1",
  "title": "Basis Muziekonderwijs",
  "requiredPoints": 0
}

{
  "id": "course-2", 
  "title": "Gevorderde Technieken",
  "requiredPoints": 100
}
```

## Vragen?

Als je hulp nodig hebt met:
- Het uploaden van videos naar YouTube
- Het vinden van je video IDs
- Het structureren van je cursussen
- Technische aanpassingen

Neem contact op of raadpleeg de andere documentatie:
- `README.md` - Algemene projectdocumentatie
- `CONTENT_GUIDE.md` - Gedetailleerde content editing gids
- `GETTING_STARTED.md` - Eerste stappen

## Je Unieke Aanpak

Benut je sterke punten in het platform:
- ✅ Creativiteit → Experimentele opdrachten
- ✅ 25+ jaar ervaring → Praktijkvoorbeelden
- ✅ Bruggen bouwen → Interdisciplinaire content
- ✅ Lef en toewijding → Moedig docenten aan om te experimenteren

Succes met het opbouwen van je platform! 🎵

---

**Contact:** Je kunt deze notities verwijderen als je ze hebt gelezen en je content hebt toegevoegd.