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
        { id: 'tz-01', file: '1-ankunft', title: 'Zwischen Gewitter und Bananenplantage', subtitle: 'Unsere ersten Tage in Afrika', audio: null, markers: [] },
        { id: 'tz-02', file: '2-safari', title: 'Die Safari beginnt', subtitle: 'Über Tarangire in die Wildnis', audio: null, markers: [] },
        { id: 'tz-03', file: '3-serengeti', title: 'Nächte in der Serengeti', subtitle: 'Wilde Tiere, Lagerfeuer und Sternenhimmel', audio: null, markers: [] },
        { id: 'tz-04', file: '4-jagdtag', title: 'Jagdtag in der Savanne', subtitle: 'Geparden, Löwen und einmalige Begegnungen', audio: null, markers: [] },
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
