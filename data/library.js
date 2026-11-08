/*
 * REISECHRONIK – zentrale Kapitelverwaltung.
 * Fotos liegen im GLEICHEN Ordner wie die MP3s:
 *   0-cover.jpg                 → Vorschaubild der gesamten Reise
 *   1-ankunft.mp3 + 1-ankunft.jpg → gemeinsames Kapitelmotiv
 * Bilder werden über den Dateistamm automatisch zugeordnet.
 * Unterstützt werden JPG, JPEG, PNG und WEBP; bevorzugt JPG.
 * audio: null  → noch nicht veröffentlicht
 * audio: true  → fertige MP3 liegt unter audioFolder/file.mp3
 * markers     → exakte Zeiten (Sekunden) aus der fertigen MP3
 * Alle Titel sind vorläufige ARBEITSTITEL.
 */
window.REISECHRONIK_DATA = {
  version: 2,
  trips: [
    {
      id: 'tansania-2026',
      title: 'Tansania & Sansibar',
      year: '2026',
      region: 'Ostafrika · 2026',
      period: '16. September – 2. Oktober 2026',
      subtitle: 'Safari, unvergessliche Begegnungen und Inselgeschichten',
      audioFolder: 'audio/tansania-2026',
      coverBase: '00-Cover',
      fallbackCover: 'assets/tansania.svg',
      chapters: [
        { id: 'tz-01', file: '01-Banana Farm Tag 1-2', title: 'Banana Farm – Tag 1–2', subtitle: 'Ankunft in Tansania und die ersten Tage in Arusha', audio: true, markers: [] },
        { id: 'tz-02', file: '02-Tarangire_Tag_3', title: 'Tarangire – Tag 3', subtitle: 'Safari im Tarangire-Nationalpark', audio: true, markers: [] },
        { id: 'tz-03', file: '03-Serengeti_Tag_4', title: 'Serengeti – Tag 4', subtitle: 'Unser erster Tag in der Serengeti', audio: true, markers: [] },
        { id: 'tz-04', file: '04-Serengeti_Tag_5', title: 'Serengeti – Tag 5', subtitle: 'Gepardenfamilie und Safari-Abenteuer', audio: true, markers: [] },
        { id: 'tz-05', file: '5-menschen', title: 'Menschen und Landschaften', subtitle: 'Begegnungen auf dem Weg durch Tansania', audio: null, markers: [] },
        { id: 'tz-06', file: '6-sansibar', title: 'Inselgeschichten aus Sansibar', subtitle: 'Ein anderer Rhythmus am Indischen Ozean', audio: null, markers: [] }
      ]
    },
    {
      id: 'japan-korea-2025',
      title: 'Japan & Korea',
      year: '2025',
      region: 'Ostasien · 2025',
      period: 'August – Oktober 2025',
      subtitle: 'Tempel, Großstadtlichter und überraschende Begegnungen',
      audioFolder: 'audio/japan-korea-2025',
      coverBase: '0-cover',
      fallbackCover: 'assets/japan.svg',
      chapters: []
    }
  ]
};
