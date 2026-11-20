"""Extract searchable PDF text and render original pages. No network or model calls."""
import json
import pathlib
import sys

from pypdf import PdfReader
import pypdfium2 as pdfium

source = pathlib.Path(sys.argv[1]).resolve()
destination = pathlib.Path(sys.argv[2]).resolve()
destination.mkdir(parents=True, exist_ok=True)
reader = PdfReader(source)
count = len(reader.pages)
texts = [(p.extract_text() or "") for p in reader.pages]
indices = list(range(count)) if count <= 20 else list(range(14)) + list(range(count - 6, count))
document = pdfium.PdfDocument(str(source))
pages = []
for index in indices:
    page = document[index]
    bitmap = page.render(scale=1.8)
    image = bitmap.to_pil()
    filename = "page-%03d.png" % (index + 1)
    image.save(destination / filename)
    pages.append({"page": index + 1, "file": filename, "width": image.width, "height": image.height})
    image.close()
    bitmap.close()
    page.close()
document.close()
result = {"pageCount": count, "rendered": pages, "texts": texts, "scanned": sum(map(len, texts)) < 100,
          "renderingTruncated": len(indices) < count}
(destination / "pdf-pages.json").write_text(json.dumps(result, ensure_ascii=False), encoding="utf-8")
print(json.dumps({"pageCount": count, "rendered": len(pages), "scanned": result["scanned"]}))
