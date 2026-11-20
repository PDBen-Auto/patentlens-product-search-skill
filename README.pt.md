# PatentLens: pesquisa de patentes a partir de um produto

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Português](README.pt.md)

## Utilidade
A partir de uma página pública, o PatentLens reúne candidatos de patente e desenho industrial, documentos originais, figuras, reivindicações e lacunas de informação. A comparação ajuda equipes de produto e engenharia a preparar uma revisão com especialistas. A busca indica candidatos e a comparação fundamenta as conclusões nas características observadas e nos documentos disponíveis.

## Instalação e execução
```sh
git clone https://github.com/PDBen-Auto/patentlens-product-search-skill.git
cd patentlens-product-search-skill
node app/server.mjs
```

Execute com Node.js 22 ou posterior e abra `http://127.0.0.1:48972`. Para Codex, copie a pasta inteira para `~/.codex/skills/patentlens-product-search` e invoque `$patentlens-product-search`. A exibição de PDFs oficiais dos EUA precisa de Python 3.10 ou posterior, `pypdf` e `pypdfium2`.

## Entradas, saídas e conferência
Informe a URL pública, a jurisdição e a data de referência. Imagens e números de publicação são opcionais. Compare até três documentos lado a lado, confronte os desenhos ou os elementos da reivindicação independente com o produto e exporte HTML, JSON ou CSV. Confirme o titular e a situação jurídica no registro oficial. Marque lacunas como `unknown`. A busca automática por palavras e índices públicos serve à triagem. Busca por semelhança de imagem, cobertura completa e parecer jurídico exigem trabalho específico.

## Caso fictício
Na simulação de um clipe para cabos, 36 pistas geram 19 documentos únicos, dos quais sete têm originais legíveis e três são comparados. Um desenho apresenta baixa sobreposição visível, uma patente depende da inspeção interna e outro desenho merece revisão visual detalhada. [Abrir o caso ilustrado (em inglês)](https://pdben-auto.github.io/patentlens-product-search-skill/synthetic-cable-clip-en.html).

[Full Skill workflow](SKILL.md) · [License](LICENSE)
