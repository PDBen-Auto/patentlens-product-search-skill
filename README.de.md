# PatentLens für die Patentrecherche ab Produktlink

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Português](README.pt.md)

## Einsatz
Von einer öffentlichen Produktseite aus ermittelt PatentLens mögliche Patent- und Designschutzrechte. Zeichnungen, Anspruchsmerkmale, Quellen und offene Fragen kommen in einen Vergleichsbericht für Produktplanung und technische Prüfung. Trefferlisten helfen bei der Auswahl der Kandidaten. Die eigentliche Bewertung stützt sich auf Originalunterlagen und sichtbare Produktmerkmale.

## Installation und Start
```sh
git clone https://github.com/PDBen-Auto/patentlens-product-search-skill.git
cd patentlens-product-search-skill
node app/server.mjs
```

Starte mit Node.js 22 oder neuer und öffne `http://127.0.0.1:48972`. Für Codex den vollständigen Ordner nach `~/.codex/skills/patentlens-product-search` kopieren und `$patentlens-product-search` aufrufen. Die Darstellung offizieller US-PDFs benötigt Python 3.10 oder neuer sowie `pypdf` und `pypdfium2`.

## Eingaben, Ausgaben und Prüfung
Gib den Produktlink, das Schutzgebiet und den Stichtag an. Bilder und bekannte Publikationsnummern sind optional. Vergleiche Zeichnungen oder Merkmale eines unabhängigen Anspruchs mit dem Produkt. Bis zu drei Dokumente lassen sich nebeneinander prüfen und als HTML, JSON oder CSV exportieren. Prüfe Inhaber und Rechtsstand in amtlichen Registern und kennzeichne fehlende Fakten als `unknown`. Die automatische Suche verwendet Stichwörter und öffentliche Indizes. Bildähnlichkeit, vollständige Abdeckung und Rechtsgutachten erfordern eine gesonderte Prüfung.

## Fiktiver Fall
Für einen Kabelhalter führen 36 simulierte Treffer zu 19 eindeutigen Dokumenten. Sieben Originale sind lesbar, drei werden verglichen. Ein Design zeigt geringe sichtbare Überschneidung. Ein Patent erfordert die Prüfung des inneren Aufbaus. Ein weiteres Design hat visuelle Übereinstimmungen, die genauer geprüft werden müssen. [Illustriertes Beispiel öffnen (Englisch)](https://pdben-auto.github.io/patentlens-product-search-skill/synthetic-cable-clip-en.html).

[Full Skill workflow](SKILL.md) · [License](LICENSE)
