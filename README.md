# Feilettis Reisetagebuch – GitHub-Pages-Website

Hörbuchbibliothek als **statische GitHub-Pages-Website**. Keine Tagebuchtexte, keine externen Dienste, kein Passwortschutz.

## So legst du MP3 und Fotos ab

Beide Dateien liegen im **selben Reiseordner**. Für die erste Version gelten diese Namen:

```text
audio/
  tansania-2026/
    0-cover.jpg         ← Vorschaubild für die GESAMTE Reise (beginnt mit 0)
    1-ankunft.mp3       ← Hörbuch-Kapitel 1
    1-ankunft.jpg       ← dazugehöriges Kapitelbild (genau gleicher Dateistamm)
    2-safari.mp3
    2-safari.jpg
```

Weitere Formate: `.jpeg`, `.png`, `.webp` statt `.jpg` werden automatisch ausprobiert. **Nicht** mehrere Bilder mit demselben Dateistamm gleichzeitig hochladen, damit die Auswahl eindeutig bleibt. Die Coverdatei heißt standardmäßig `0-cover` (plus Bildendung). Wenn du einen anderen 0-Startnamen möchtest, ändern wir `coverBase` in `data/library.js`.

**Wichtig:** Die Nummerierung der normalen Kapitel beginnt mit `1-`, `2-` usw., **nicht** mit `01-`, damit nur das Titelbild mit `0` beginnt. Welche Kapitel wirklich online verfügbar sind, verwaltet `data/library.js`. Einfach eine MP3 in den Ordner zu legen, trägt sie noch nicht automatisch in die Kapitelübersicht ein; GitHub Pages kann keine Ordner durchsuchen.

Wenn eine MP3 fertig hochgeladen wurde: In `data/library.js` beim entsprechenden Kapitel `audio: null` zu `audio: true` ändern. Der Pfad `audio/<reise>/<file>.mp3` wird automatisch gebildet. Das gleichnamige Bild wird ohne weiteren Eintrag angezeigt, sofern vorhanden. Fehlende Fotos zeigen eine unaufdringliche Platzhalterillustration.

## Was ist wo?
- `index.html`: Startseite, Reiseübersicht und Audioplayer.
- `assets/styles.css`: Design für Handy und Desktop.
- `assets/app.js`: Hörbuchsteuerung, Zeitmarken, Bildzuordnung und Browserfortschritt.
- `data/library.js`: Reisekapitel, Namen, Dateistämme und Freigabestatus.
- `audio/<reise>/`: MP3-Dateien **und** Bilder zusammen.
- `REGELN.md`: Arbeitsregeln.

## Veröffentlichung
Dieses Repository wird auf GitHub Pages veröffentlicht. Nach dem Upload der Website-Dateien unter **Settings → Pages → Build and deployment → Deploy from a branch**, Branch **main**, Folder **/(root)** wählen und speichern.

Die öffentliche Adresse lautet nach erfolgreicher Bereitstellung: https://bernd8741.github.io/reise-chronik/

Aktuell enthalten die Kapitel nur **Arbeitstitel**. Die Audiodateien werden erst nach Freigabe im Hörbuch-Chat hochgeladen und mit `audio: true` freigeschaltet.
