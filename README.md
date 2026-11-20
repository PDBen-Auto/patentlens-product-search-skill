# PatentLens Product Search Skill

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Português](README.pt.md)

Start with a public product URL and turn patent search leads into a comparison a product or engineering team can review. Use it during product discovery, design review, supplier evidence checks, or preparation for patent counsel.

## See a completed example

[Open the illustrated case in English](https://pdben-auto.github.io/patentlens-product-search-skill/synthetic-cable-clip-en.html) · [打开中文图示案例](https://pdben-auto.github.io/patentlens-product-search-skill/synthetic-cable-clip.html)

The fictional ArcClip case narrows 36 simulated search leads to 19 unique records. Seven originals are readable and three are compared. One design has low observed overlap, one utility candidate needs internal evidence, and a third design needs prioritized visual review.

## What you get

- A search register with query routes, source outcomes, original documents, and gaps.
- A side-by-side comparison of up to three records. Use drawings for design rights and a claim element matrix for utility patents.
- Editable human notes and HTML, JSON, or CSV export. Use the [full Skill workflow](SKILL.md) to verify holders, dates, term and status in official records and to document unresolved questions.

Keyword ranking helps prioritize records. The comparison shows the underlying evidence for different findings. If the next action is to develop a redesigned product, use [Design Patent Search and Design Around](https://github.com/PDBen-Auto/design-patent-design-around-skill).

## Install and run

For the local tool, use Node.js 22 or later:

```sh
git clone https://github.com/PDBen-Auto/patentlens-product-search-skill.git
cd patentlens-product-search-skill
node app/server.mjs
```

Open `http://127.0.0.1:48972`. For Codex, copy the complete folder to `~/.codex/skills/patentlens-product-search` and use `$patentlens-product-search`. Optional PDF rendering requires Python 3.10+, `pypdf`, and `pypdfium2`. On Windows run `app/setup-pdf.ps1` for isolated setup. Data defaults to `~/PatentLens-records`. The bundled tool may show Chinese interface text.

## Run a comparison

1. Provide the public product URL, target jurisdiction and research cutoff. Add other product views or known records when available.
2. Verify the product identity, review the completed, blocked and skipped routes, and open original documents for serious candidates.
3. Compare the actual features with the figures or independent claim elements. Mark unverified facts as `unknown` and export the result with next checks.

> Use $patentlens-product-search to pre-screen this public product link for US patent candidates. Show the original drawings and claim elements alongside product evidence, then list the unverified details and next checks for each candidate.

## Research boundaries

The automated phase uses keyword and public index routes, with up to six first-page routes, 40 deduplicated records and an attempt to read the first six US originals. A thorough search can also require visual similarity, classification, citation and family research. Site blocks leave coverage gaps. Use original records and official registers for legal status and take material decisions to a patent professional. See the [license](LICENSE).
