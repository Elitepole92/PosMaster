# SPS 2026 · Medientechnik – Web-App

Interaktiver Hallenplan zum Medientechnik-Booklet (Stand 17.11.2026).

- **Halle / Vertical:** Plan mit Zoom (zwei Finger, Doppeltipp), optimiert fürs iPad im Querformat. Tippen auf eine POS-Nummer öffnet die Details.
- **Liste:** alle POS nach Bereich, inkl. Positionen ohne Medientechnik.
- **To-dos:** In der Liste mit **+** Positionen auf die eigene To-do-Liste setzen (erscheint ganz oben), dann abhaken. Lokal gespeichert und per Sync-Code (Firebase Firestore) zwischen eigenen Geräten abgeglichen.
- **Pink markieren:** Mit der Flagge in der Liste oder in der Detailansicht Positionen pink markieren – unabhängig von den To-dos, sichtbar in Liste und Plan, wird mitsynchronisiert.
- **Suche:** nach POS-Nummer, Titel oder Gerät (z. B. „414“, „Vestel“, „HDMI 10 m“). Treffer werden im Plan hervorgehoben.
- **Direktlinks:** `index.html#pos=414` öffnet direkt POS 414.

## Hosting
Reine statische Seite ohne Build-Schritt und ohne externe Abhängigkeiten. Ordner ins Repo legen und z. B. über GitHub Pages ausliefern (Settings → Pages → Branch wählen). Läuft auch lokal per Doppelklick auf `index.html`.

## Inhalt
- `index.html` – App
- `data.js` – POS-Daten, Suchtext und Hotspot-Koordinaten
- `icons/`, `manifest.webmanifest` – App-Symbol für Home-Bildschirm/Dock
- `img/plan-*.jpg` – Pläne
- `img/pos/*.jpg` – Detailausschnitte je POS aus dem Booklet
- `img/docs/*.jpg` – Anhang-Seiten (Schemas, Detailzeichnungen, Bodenkabel) für den Reiter „Montage“

Bei einer neuen Booklet-Version müssen `data.js` und die Bilder neu erzeugt werden.

## Offline
`sw.js` (Service Worker) speichert beim ersten Öffnen alle App-Dateien auf dem Gerät, danach läuft die App auch ohne Netz. `index.html` und `data.js` werden zuerst aus dem Netz geholt (Updates), bei Funkloch nach 4 s aus dem Speicher.
**Nach jeder Änderung an App-Dateien `python3 tools/build-sw.py` ausführen**, damit die Geräte die neuen Dateien bekommen.

## Bonus: Backstage Brawl (`buehnen-brawl/`)
Kleines Plattform-Prügelspiel im Browser – die Prügelei hinter der Bühne. Einfach `buehnen-brawl/index.html` öffnen (der Ordnername bleibt, damit bestehende Links und Home-Bildschirm-Apps weiter funktionieren).

**Startmenü:** *1 Spieler* (gegen die CPU), *2 Spieler* (zu zweit an einer Tastatur), *Online-Duell* (zwei Geräte mit Raum-Code) und die *Highscores*. CPU-Stärke und Gadgets stellt man danach in der Kämpferwahl ein (Tasten C, X oder antippen). Gespielt wird immer mit 3 Leben. `M` schaltet den Ton an/aus.

| | P1 | P2 |
|---|---|---|
| Laufen / Springen | `A` `D` / `W` | `←` `→` / `↑` |
| Schild (in der Luft: Fastfall) | `S` | `↓` |
| Schlag | `F` | `K` (oder Numpad 1) |
| Finisher (Leiste voll) | `G` | `L` (oder Numpad 2) |

**iPhone / iPad:** Touch-Buttons, nur Einzelspieler und Online, Querformat. Über *Teilen → Zum Home-Bildschirm* läuft es als Vollbild-App.

**Online-Duell:** Ein Gerät erstellt einen Raum (4-stelliger Code + QR-Code), das andere tritt bei. Technik: WebRTC über PeerJS. Nur über die GitHub-Pages-Adresse.

**Bestenliste (global, 5 Plätze, direkt auf der Startseite):** Gewertet wird der schnellste Sieg im **Online-Duell** – die Kampfzeit vom „LOS!“ bis zum letzten K.O. Gespielt wird immer mit 3 Leben (nicht einstellbar). Der Gewinner sieht auf seinem Gerät sofort seine Siegzeit und ob sie für die Top 5 reicht; dann trägt er seinen Namen ein. In der Liste steht, mit welcher Figur gegen welche gewonnen wurde. Gespeichert in Firestore (gleiches Projekt und gleiche Ablageform wie der Sync der POS-App, Dokument `sync/brawlonline1`).

| Kämpfer | Typ | Finisher |
|---|---|---|
| **Medien Hamster** | lila Warnweste, schwarzer Helm | Rauch ins Gesicht |
| **Hallenmeister** | lange graue Haare, gebückt, blauer Pulli, Blaumann | 400V Phase Braun |
| **Cemil** | sehr klein, Dreitagebart, weißer Helm, gelbe Weste | Gabelstapler-Ramme |
| **Headrigger** | sehr dürr, riesige Gürteltaschen, kurze Strickmütze | D8+ Kettenschlag |
| **Gerch** | Tontechniker mit Espressotasse, Cargoshorts, oranger Helm | 180 dB Überschallknall |
| **Projektleiterin** | Senior PL, Mitte 30, Handy am Ohr, Laptop | Angebot abgelehnt – Riesenstempel |
| **Messebauer** | riesige Boombox, Akkuschrauber, Gummihammer | KURWA! – Gummihammer-Kombo |
| **Operator** | dürr, etwas arrogant, Designerschal, Stoffhose | Deplatzierter Strobo – im ruhigsten Moment |

Die Caterin ist im Code noch enthalten, aber gerade nicht auswählbar (`hidden: true` im Roster).

Finisher laufen in Zeitlupe; beim Siegerspruch nach einem KO zoomt die Kamera kurz heran.

**Gadgets** (in der Kämpferwahl abschaltbar): Ab und zu schwebt ein Symbol am Fallschirm herunter. Wer es einsammelt, bekommt für ca. 9 Sekunden einen Boost: **⏩ Tempo** (grün) = schneller, **🛡️ Schild** (blau) = weniger Schaden und Rückstoß, **⚡ Energy** (gelb) = stärkere Schläge und schnellere Finisher-Leiste.

Treffer laden die Finisher-Leiste (5 Treffer). Schaden in % erhöht, wie weit man fliegt – wer aus dem Bild fliegt, verliert ein Leben.
