---
name: patentlens-product-search
description: Start from a public product URL to discover patent candidates, verify metadata and original drawings or claims, and produce an illustrated human comparison with separate evidence gaps and risk judgments. Use for product-link patent pre-screening and PatentLens tool operation; not for a formal legal opinion, patent drafting, or design-around generation.
---

# PatentLens Product Search

Turn one public product link into an auditable patent candidate set and a comparison that a product manager can inspect. The bundled local app accelerates extraction, keyword routes, original-document collection, side-by-side viewing, notes, and export. The agent must finish the source verification and reasoning described below; the app's text rank is only discovery order.

## Implementation Basis and Dependencies

| Dependency | Purpose and validation | Required | If unavailable |
| --- | --- | --- | --- |
| Node.js 22+ and local loopback port | Run `app/server.mjs`; check `node --version` and `/api/health` | For bundled app | Do manual public-source research and mark app unavailable |
| Public product page and network | Extract product identity and images; open the exact URL | For URL-led run | Ask for a public alternate URL or supplied photos; do not guess identity |
| Patent records in target jurisdiction | Confirm publication, drawings/claims, ownership, dates, and current status | For a substantive comparison | Return leads only with explicit `unverified` fields |
| Python 3.10+, `pypdf`, `pypdfium2` | Render and extract US official PDF pages; test imports | For app PDF preview | Keep source links and use a browser/manual PDF review |
| Windows English OCR | Read scanned PDF text; compare to page images | Optional | Read original images manually; mark OCR unavailable |

The app binds to `127.0.0.1`, defaults to port `48972`, and stores records in `~/PatentLens-records` (`PATENTLENS_PORT` and `PATENTLENS_DATA_DIR` override these). It fetches public pages without account login. Websites may block automation, change markup, or rate limit. Do not bypass CAPTCHA or treat a blocked query as zero results. No paid API or proprietary patent database is bundled. Current app automation is keyword and index based; it does not perform reverse image search, exhaustive family/assignment work, official legal status verification, or legal clearance.

## Inputs

| Item | Purpose; requirement; format and source | Validation, default, sensitivity |
| --- | --- | --- |
| Product URL | Required for app mode; one public HTTP(S) product page, e.g. a manufacturer listing | Open the exact page; reject login/CAPTCHA/404 and private URLs. Product data can be commercially sensitive; do not publish it without approval. |
| Jurisdiction and cutoff | Required for a meaningful risk statement; country/region and date | Default US and current research date only when the user has not specified them; disclose this choice. A language or marketplace does not prove jurisdiction. |
| Product evidence | Optional photos, views, model, function, supplier identity, known patent numbers | Use only authorized files or public records; label seller/brand as leads until ownership is verified. |
| Search hints | Optional terms, synonyms, classes, applicant/inventor/assignee and related entities | Validate against product evidence; never turn a suggested party into an established right holder. |
| Decision context | Optional launch date, market, affected design features and desired output format | If absent, provide a pre-screen and next evidence requests, not a launch clearance. |

## Outputs

| Item | Meaning, format and destination | Acceptance and partial behavior |
| --- | --- | --- |
| Search record | Local JSON from the app with product extraction, query routes, timestamps, source states and candidates; saved under `PatentLens-records/<job-id>/` | Every route shows success, blocked or skipped. Unknown values remain unknown. |
| Illustrated comparison | HTML report or requested format with product views, patent drawings/claim excerpts, source links, feature-by-feature comparison and human notes; saved beside the record | Images must have source/figure labels; missing images stay missing. Do not present a candidate list as a conclusion. |
| Decision summary | Human-readable table with each serious candidate's publication ID, type, applicant/assignee clue, filing/publication/grant dates, status evidence, possible term, overlap, differences, and action | Cite the original records used. Estimated expiry must be labeled as an estimate and separated from current legal status. Distinguish low, elevated, and unresolved evidence states. |
| Coverage and next checks | Search boundary, unresolved sources, unexamined jurisdictions, unpublished applications, ownership and claim limitations | A blocked source or missing document is not a clean result. State what must be checked by a patent professional before a consequential launch decision. |

The app writes only local files unless the user separately authorizes publishing or sharing. A failed or partial search still produces a status and source log, not invented candidates.

## Workflow

1. Check the target jurisdiction, product identity, page access and date. Keep the original product URL and capture product image views or note which views are missing.
2. Start the app with `node app/server.mjs` (Windows: `app/打开专利检索工具.cmd`), verify `/api/health`, enter the URL, and export the JSON after search. If the app is unavailable, perform the same evidence workflow manually.
3. Expand the initial routes. Search product name and synonyms; technical mechanism and classification; design appearance and image/visual features where a lawful search tool exists; brand, seller, manufacturer, designer, inventor, assignee and related entities; known patents, family and citations. Log each route, query, provider, cutoff, result count if reliable, and failure. The app's six first-page routes are a starting set, not completion.
4. For serious candidates open the publication and complete drawings or claims from original/official sources where available. Verify patent type, applicant, assignee or assignment chain, priority, filing, publication, grant, family, jurisdiction and current legal status. Do not infer current enforceability or expiry from a Google summary. Record the status-check source and date; explain any calculated term and exceptions.
5. Compare external appearance by all material views for design rights, including solid versus broken lines where relevant. For utility claims, build an element-to-product matrix for the specific independent claim; absence of one evidenced element differs from an unobserved internal structure. Use annotated figures or labeled callouts so a non-specialist can see the disputed feature. Never use a single common concept or word match as a risk score.
6. Rate each candidate separately: `low on observed features`, `elevated pending review`, `material overlap`, or `unresolved`. Give the facts for that label and a confidence/coverage note. Missing ownership, expiry, hidden structure, or source access belongs in `unresolved`, not automatically in the middle risk band. Keep platform complaint exposure separate from substantive overlap.
7. Export HTML and JSON, check links/images and source dates, and summarize the specific next check for each candidate. For actual design-around concepts, route to `design-patent-search-and-design-around`; do not silently turn this pre-screen into a redesign claim.

For a concrete illustration, open [the fully synthetic comparison](examples/synthetic-cable-clip.html). Its company, patent IDs, drawings, dates, search counts and outcomes are invented demonstration data, never evidence of a real patent search.

## Stop Conditions

Stop automatic source requests on CAPTCHA, access denial or rate limiting. Preserve completed records, label affected routes blocked, and continue only with authorized public alternatives. Do not call `no candidates` when every relevant source failed. Do not state that a patent has expired until the applicable official register and term events are verified. Do not treat this Skill as legal advice or an infringement/non-infringement opinion.

## Completion Check

Confirm that the product and jurisdiction are identified, source routes are recorded, serious candidates have original source links and image/claim evidence, dates and ownership are attributed, each judgment names observed overlap and unknowns, the HTML opens with readable figures, and both exported files remain available. If any check fails, mark the deliverable partial with the exact missing evidence.
