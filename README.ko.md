# PatentLens 제품 링크 기반 특허 조사

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Português](README.pt.md)

## 해결하는 문제
공개 제품 페이지에서 관련 특허와 디자인권 후보를 찾고 원문 링크, 도면, 청구항 및 확인되지 않은 정보를 비교 보고서에 정리합니다. 상품 기획, 설계 검토, 전문가에게 자료를 전달할 때 사용할 수 있습니다. 검색 순위는 후보를 고르는 데 사용하며, 판단 근거는 원문과 확인된 제품 특징에서 가져옵니다.

## 설치 및 실행
```sh
git clone https://github.com/PDBen-Auto/patentlens-product-search-skill.git
cd patentlens-product-search-skill
node app/server.mjs
```

Node.js 22 이상에서 실행한 뒤 브라우저에서 `http://127.0.0.1:48972`을 엽니다. Codex에서 전체 폴더를 `~/.codex/skills/patentlens-product-search`에 복사하고 `$patentlens-product-search`를 호출합니다. 미국 공식 PDF를 렌더링하려면 Python 3.10 이상과 `pypdf`, `pypdfium2`가 필요합니다.

## 입력, 출력 및 확인 절차
공개 제품 URL, 관할 지역, 조사 기준일을 입력합니다. 제품 사진과 이미 알고 있는 문헌 번호를 추가할 수 있습니다. 도면이나 독립 청구항의 요소를 제품 특징과 비교하고, 최대 3건을 나란히 검토하며 HTML, JSON, CSV를 내보냅니다. 공식 등록부에서 권리자와 법적 상태를 확인하고 확인하지 못한 값은 `unknown`으로 남깁니다. 자동화는 키워드와 공개 색인을 이용한 예비 조사입니다. 이미지 유사도 검색, 전수 조사 및 법률 의견은 별도로 진행합니다.

## 가상 사례
책상용 케이블 클립의 가상 조사에서 36개 단서를 19건으로 정리했습니다. 원문을 읽을 수 있는 7건 중 3건을 비교한 결과는 외관 유사성이 낮은 1건, 내부 구조 확인이 필요한 1건, 외관을 집중 검토할 1건입니다. [그림이 있는 사례 열기(영어)](https://pdben-auto.github.io/patentlens-product-search-skill/synthetic-cable-clip-en.html).

[Full Skill workflow](SKILL.md) · [License](LICENSE)
