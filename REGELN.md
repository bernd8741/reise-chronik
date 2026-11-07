# Unsere Regeln für das Reisehörbuch

## Inhalt
1. **Nur Audio auf der Website:** Keine vollständigen Tagebuchtexte veröffentlichen. Titel, Untertitel und Kapitel-Zeitmarken sind erlaubt.
2. **Thematische Kapitel, Ziel ca. 15 Minuten.** Bei natürlichen Erzählpausen darf die Länge abweichen (grob 10–20 Minuten). Kein künstliches Abschneiden.
3. **Chronologische Erzählung innerhalb der Reise.** Die Reihenfolge der Themen folgt dem tatsächlichen Reiseverlauf. Keine erfundenen Ereignisse oder Wiederholungen.
4. **Eine Hörbuch-Erzählerstimme, Ich-Perspektive.** Inhalt und Formulierungen werden im separaten Hörbuch-Chat finalisiert.
5. **Arbeitstitel sind keine fertigen Kapitel.** Die in `data/library.js` gezeigten Kapitel werden nach Fertigstellung des Hörbuchtextes angepasst.
6. **Zeitmarken** erst aus der fertigen MP3 ermitteln, sekundengenau als `markers` eintragen. Keine geschätzten Zeitmarken veröffentlichen.

## Technik
7. **Automatische Folge:** Nach Ende einer MP3 spielt die nächste verfügbare MP3 derselben Reise ab. Am Reiseende stoppt die Wiedergabe. Die Option ist standardmäßig aktiviert.
8. **Fortschritt:** Speichern auf dem aktuellen Gerät im Browser (`localStorage`). Keine geräteübergreifende Synchronisation und kein Nutzerkonto.
9. **GitHub bleibt zentral:** Ein Repository `reise-chronik`, Website über GitHub Pages (Branch `main` / Wurzelverzeichnis). Keine fremden Dienste für die erste Version.
10. **Öffentliche Inhalte:** GitHub Pages ist öffentlich. Keine Passwörter, Kontaktlisten, privaten Adressen oder personenbezogenen Rohnotizen hochladen. Ein reines JavaScript-Passwort wäre kein echter Schutz.
11. **MP3s:** Bevorzugt mono 96–128 kbit/s MP3 für Sprache. Für einfachen Browser-Upload möglichst unter 25 MiB pro Datei bleiben. Beim Export Dateinamen klein, ohne Leerzeichen/Umlaute, z. B. `1-ankunft.mp3` und dazu `1-ankunft.jpg`. Das Reisebild heißt `0-cover.jpg`. Alle liegen gemeinsam in `audio/<reise>/`.
12. **Getrennte Quellen:** Die vollständigen, freigegebenen Tagebuchtexte und Roh-Audioaufnahmen werden separat und privat archiviert, **nicht** in diesem öffentlichen Repository.
13. **Nur freigegebene MP3s:** Erst nach Korrektur und Freigabe `audio: true` in `data/library.js` eintragen. Dateiname kommt aus dem Feld `file`; das Kapitelbild wird automatisch über denselben Dateistamm gefunden.
14. **Bilder:** Pro Reise `0-cover.jpg` als Reisevorschaubild; Kapitelbilder exakt nach dem MP3-Stamm benennen (`1-ankunft.mp3` → `1-ankunft.jpg`). Unterstützte Bildformate: JPG, JPEG, PNG, WEBP. Sind Bilder noch nicht hochgeladen, bleibt ein Platzhalter sichtbar.
15. **Freigabe für GitHub erteilt:** Die Website darf im öffentlichen GitHub-Repository bereitgestellt werden. MP3-Dateien und persönliche Materialien werden weiterhin nur nach Freigabe hochgeladen.

## Kapitel eintragen
`data/library.js` enthält alle Reisen und Kapitel. Beispiel:

```js
{
  id: 'tz-01',
  title: 'Zwischen Gewitter und Bananenplantage',
  subtitle: 'Unsere ersten Tage in Afrika',
  file: '1-ankunft',
  audio: true,
  markers: [
    { time: 0, label: 'Anreise' },
    { time: 245, label: 'Ankunft am Flughafen' }
  ]
}
```

Die Markenzeiten in diesem Beispiel dienen **nur zur Erklärung des Formats** und sind keine echten Zeitmarken.
