# SPS 2026 · Medientechnik – Web-App

Interaktiver Hallenplan zum Medientechnik-Booklet (Stand 17.11.2026).

- **Halle / Vertical:** Plan mit Zoom (zwei Finger, Doppeltipp), optimiert fürs iPad im Querformat. Tippen auf eine POS-Nummer öffnet die Details.
- **Liste:** alle POS nach Bereich, inkl. Positionen ohne Medientechnik.
- **To-dos:** In der Liste mit **+** Positionen auf die eigene To-do-Liste setzen (erscheint ganz oben), dann abhaken. Lokal gespeichert und per Sync-Code (Firebase Firestore) zwischen eigenen Geräten abgeglichen.
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

## Bonus: Bühnen-Brawl (`buehnen-brawl/`)
Kleines Plattform-Prügelspiel im Browser. Einfach `buehnen-brawl/index.html` öffnen.

**Startmenü:** *1 Spieler* (gegen den Computer, CPU-Stärke leicht/mittel/schwer) oder *2 Spieler* (zu zweit an einer Tastatur), dazu die Anzahl der Leben. `M` schaltet den Ton an/aus.

**Mac / PC:** Tastatur.

| | P1 | P2 |
|---|---|---|
| Laufen / Springen | `A` `D` / `W` | `←` `→` / `↑` |
| Schild (in der Luft: Fastfall) | `S` | `↓` |
| Schlag | `F` | `K` (oder Numpad 1) |
| Finisher (Leiste voll) | `G` | `L` (oder Numpad 2) |

**iPhone / iPad:** Das Spiel erkennt Touch-Geräte automatisch und zeigt Touch-Buttons (◀ ▶, Sprung, Schlag, Schild, Finisher). Dort gibt es nur den Einzelspieler-Modus, gespielt wird im Querformat. In Safari über *Teilen → Zum Home-Bildschirm* läuft es als Vollbild-App (Manifest + Icons liegen im Ordner).

| Kämpfer | Typ | Finisher |
|---|---|---|
| **Medien Hamster** | lila Warnweste, schwarzer Helm | Rauch ins Gesicht – Zigarettenrauch, Gegner hustet |
| **Hallenmeister** | lange graue Haare, gebückt, blauer Pulli, Blaumann | 400V Phase Braun – Stromschlag |
| **Cemil** | sehr klein, Dreitagebart, weißer Helm, gelbe Weste | Gabelstapler-Ramme |
| **Crew Rigger** | sehr dürr, riesige Gürteltaschen, kurze Strickmütze | D8+ Kettenschlag |
| **Gerch** | Tontechniker, gelbe Weste, beige Cargoshorts, Lederstiefel, oranger Helm, grauer Dreitagebart, Brille | 180 dB Überschallknall – Druckwelle in alle Richtungen |
| **Caterin** | klein, pummelig, Hygienehaube, weiße Kochjacke mit Schürze | Jeder nur eins!!!!!!! – Käsebrötchen- und Teilchen-Hagel |

Treffer laden die Finisher-Leiste (5 Treffer). Schaden in % erhöht, wie weit man fliegt – wer aus dem Bild fliegt, verliert ein Leben.
