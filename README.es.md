# PatentLens: búsqueda de patentes desde un enlace de producto

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Português](README.pt.md)

## Para qué sirve
A partir de una ficha pública, PatentLens reúne posibles patentes y diseños, sus documentos originales, dibujos, reivindicaciones y datos pendientes. El informe ayuda a un equipo de producto a revisar candidatos y preparar material para un especialista. El orden de búsqueda sirve para descubrir documentos; la comparación se apoya en las figuras, las reivindicaciones y los rasgos observados.

## Instalación y ejecución
```sh
git clone https://github.com/PDBen-Auto/patentlens-product-search-skill.git
cd patentlens-product-search-skill
node app/server.mjs
```

Inicia la herramienta con Node.js 22 o posterior y abre `http://127.0.0.1:48972`. Para Codex copia la carpeta completa a `~/.codex/skills/patentlens-product-search` y ejecuta `$patentlens-product-search`. Para visualizar PDF oficiales de EE. UU. se necesitan Python 3.10 o posterior, `pypdf` y `pypdfium2`.

## Entradas, resultados y comprobación
Indica la URL pública, la jurisdicción y la fecha de corte. Añade imágenes y números de publicación si los tienes. Revisa hasta tres documentos en paralelo, compara los dibujos o los elementos de la reivindicación independiente y exporta HTML, JSON o CSV. Comprueba la titularidad y el estado en registros oficiales y marca los datos ausentes como `unknown`. La búsqueda automatizada usa palabras clave e índices públicos para una revisión preliminar. La similitud de imágenes, la búsqueda exhaustiva y la opinión jurídica requieren trabajo adicional.

## Caso ficticio
Para un clip de cables, 36 pistas simuladas se reducen a 19 documentos únicos. Se leen siete originales y se comparan tres. Uno tiene poca coincidencia visual, otro queda pendiente de verificar la estructura interna y el tercero exige revisar con detalle el parecido visual. [Abrir el caso ilustrado (inglés)](https://pdben-auto.github.io/patentlens-product-search-skill/synthetic-cable-clip-en.html).

[Full Skill workflow](SKILL.md) · [License](LICENSE)
