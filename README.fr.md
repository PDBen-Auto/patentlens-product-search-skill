# PatentLens : recherche de brevets à partir d'un produit

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Português](README.pt.md)

## Utilité
PatentLens part d'une fiche produit publique pour repérer des brevets et des dessins ou modèles pertinents. Le rapport réunit les documents d'origine, les figures, les revendications et les points à vérifier. Il sert au cadrage produit, à la revue de conception et à la préparation d'un dossier pour un spécialiste. Le classement oriente la recherche et le rapport justifie les rapprochements avec les preuves disponibles.

## Installation et démarrage
```sh
git clone https://github.com/PDBen-Auto/patentlens-product-search-skill.git
cd patentlens-product-search-skill
node app/server.mjs
```

Lancez l'outil avec Node.js 22 ou version ultérieure, puis ouvrez `http://127.0.0.1:48972`. Pour Codex, placez le dossier complet dans `~/.codex/skills/patentlens-product-search` et invoquez `$patentlens-product-search`. L'affichage des PDF officiels américains requiert Python 3.10 ou version ultérieure, `pypdf` et `pypdfium2`.

## Entrées, livrables et vérification
Indiquez l'URL publique, le territoire et la date de référence. Ajoutez des vues du produit et des numéros de publication si disponibles. Examinez jusqu'à trois documents côte à côte, confrontez les figures ou les éléments d'une revendication indépendante au produit et exportez en HTML, JSON ou CSV. Vérifiez les titulaires et le statut dans les registres officiels. La valeur `unknown` signale les données manquantes. La recherche automatique par mots-clés et index publics sert au repérage préliminaire. La recherche d'images similaires, la couverture exhaustive et un avis juridique nécessitent un travail distinct.

## Cas fictif
Pour un guide-câble de bureau, 36 pistes simulées donnent 19 documents uniques. Sept originaux sont lisibles et trois dossiers sont comparés. Résultat : peu de similitudes visibles pour le premier, structure interne à vérifier pour le deuxième, proximité visuelle à approfondir pour le troisième. [Ouvrir le cas illustré (anglais)](https://pdben-auto.github.io/patentlens-product-search-skill/synthetic-cable-clip-en.html).

[Full Skill workflow](SKILL.md) · [License](LICENSE)
