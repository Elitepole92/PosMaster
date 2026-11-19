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
Kleines Plattform-Prügelspiel im Browser: **Medien Hamster vs. VTler** – zu zweit an einer Laptop-Tastatur (oder gegen die CPU, Taste `C` im Titel). Einfach `buehnen-brawl/index.html` öffnen.

| | Medien Hamster (P1) | VTler (P2) |
|---|---|---|
| Laufen / Springen | `A` `D` / `W` | `←` `→` / `↑` |
| Schutz / Fastfall | `S` | `↓` |
| Kick 1 | `F` Backen-Jab-Kick | `J` Stahlkappen-Kick |
| Kick 2 | `G` HDMI-Drehkick | `K` Gaffa-Roundhouse |
| Kick 3 | `H` Laufrad-Dropkick | `L` Flightcase-Dropkick |
| Finisher (Leiste voll) | `T` Mega-Hamsterrad | `I` Funkspruch: Traverse ab! |

Treffer laden die Finisher-Leiste (ca. 4–7 Treffer). Schaden in % erhöht, wie weit man fliegt – wer aus dem Bild fliegt, verliert ein Leben.
