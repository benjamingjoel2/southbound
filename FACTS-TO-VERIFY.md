# Facts to verify

Every fact on the site that an editor must check before launch, with its source and the date it was accessed. All sources were accessed on **2026-11-02**. Quotes from web pages were retrieved via an automated fetch; quotes from PDFs were extracted from the document text. Spot-check each against the live source.

Confidence: **primary** = government, treaty body, IAATO, research institute or peer-reviewed; **operator** = a commercial company's page (used only where nothing better was found); **computed** = calculated by us, method stated.

## Business and site setup

| # | Fact | Where on site | Source | Status |
|---|---|---|---|---|
| B1 | Business address: WeWork, Ing. Enrique Butty 275, C1001AFA Buenos Aires, Argentina | Footer, About, Privacy (`site.config.mjs` → `address`) | https://www.wework.com/buildings/ing-enrique-butty-275--buenos-aires (operator) | **PLACEHOLDER.** Founders must confirm the coworking space and that Tourground's Antarctica desk sits in Argentina. Then set `address.placeholder: false` |
| B2 | Corrections/removal URL `https://tourground.com/contact?topic=correction&site=southbound` | Every company page, Corrections | none | **PLACEHOLDER.** Replace in `site.config.mjs` → `publisher.correctionsUrl` |
| B3 | Seventh Continent's Tourground profile URL is set to `https://seventhcontinent.tourground.com` | Company page link | mock feed | Confirm the real profile URL in the directory export |
| B4 | Seventh Continent facts (agency, based in AR, delivers AQ/GS/FK, niches, rank 1) | Company page, rankings | https://seventhcontinent.tourground.com/about, /experiences (its own site, JSON-LD gives Buenos Aires, AR) | **Mock values.** Niche tags and `rank.AQ = 1` are placeholders until the directory export provides them |
| B5 | Legal wording (disclosure, privacy, terms, cookies) | Legal pages | `site.config.mjs` | Needs sign-off for US, UK, EU, Brazil |
| B6 | Vercel Web Analytics is cookieless; visitor hash discarded after 24 hours; data points collected | Privacy, Cookie Policy | https://vercel.com/docs/analytics/privacy-policy (page "last updated June 26, 2026") | primary (provider) |

## Rules and regulation

| # | Fact | Where on site | Source | Confidence |
|---|---|---|---|---|
| R1 | IAATO members: max 100 visitors ashore at one site at a time; ships with more than 500 passengers may not land; 1:20 guide ratio; one ship per site | Ship size guide, home | IAATO Bylaws Art. X Sec. C, https://iaato.org/about-us/bylaws | primary |
| R2 | Same limits in ATCM Measure 15 (2009), listed by the Treaty Secretariat as "Not yet effective" | Ship size guide | https://www.ats.aq/devAS/Meetings/Measure?lang=e&id=432 | primary. Re-check status each season |
| R3 | ATCM Resolution 7 (2009) content | Not used | not fetched | Not published |
| R4 | For an organised visit, the tour operator usually arranges the Antarctic permit | Regions guide | https://www.gov.uk/foreign-travel-advice/antarctica-british-antarctic-territory/entry-requirements | primary |
| R5 | South Georgia entry permit required for all from 1 August 2025; apply ≥ 8 days before arrival; operators can apply as a group | South Georgia Q&A, regions guide | https://gov.gs/entry-control-order-permit-application/ | primary. **Fee not quoted**: new schedule from 1 July 2026 not read |
| R6 | South Georgia visitor SOP: briefing film, no Velcro/mesh/webbing, daypacks vacuumed, boot wash every landing, 5 m from wildlife | South Georgia Q&A, packing | https://gov.gs/wp-content/uploads/2026/06/01_SOP_Visitors.pdf (June 2026) | primary |
| R7 | IAATO "Don't Pack a Pest!": clean gear before leaving home, Velcro discouraged, boot wash before and after landings | Packing | https://iaato.org/system/files/2025-01/IAATO-Dont-Pack-a-Pest-A3-Poster.EN_190210.pdf | primary |
| R8 | Falklands: passport valid for the stay; no visa for (UK) visitors | Regions guide | https://www.gov.uk/foreign-travel-advice/falkland-islands/entry-requirements | primary. Visa rules vary by nationality. Falkland Islands Government site could not be fetched |
| R9 | UK FCDO: insurance that specifies Antarctica, funds for medical evacuation, very limited medical facilities, rescue may take several days | Insurance Q&A, packing | https://www.gov.uk/foreign-travel-advice/antarctica-british-antarctic-territory/health | primary |
| R10 | IAATO: check adequate medical and travel insurance for the entire journey | Insurance Q&A | https://iaato.org/faqs | primary |
| R11 | No minimum insurance amount found that applies to all trips | Insurance Q&A | (absence of source) | A reported Falklands Government USD 2,000,000 evacuation requirement for land visitors could not be verified and is **not** published |

## Season, numbers, wildlife

| # | Fact | Where on site | Source | Confidence |
|---|---|---|---|---|
| S1 | IAATO: Peninsula season October to April; 98% of voyages in the Peninsula region, departing from Ushuaia or, to a lesser extent, other ports | Home, season, ports guide | IAATO ATCM 48 IP 200 rev.1, https://iaato.org/system/files?file=2026-05/ATCM48_ip200_rev1_e.pdf | primary |
| S2 | 2024-25 landings from 22 October to 1 April (about 162 days); heavy early-season ice blocked landing sites | Home, season chart, season guide | IAATO ATCM 47 IP 34, https://iaato.org/system/files?file=2025-07%2FATCM47_ip034_e.pdf | primary |
| S3 | 113,518 visitors with IAATO operators in 2025-26 (as of 10 April 2026); 85,195 landed; 27,217 cruise-only | Home, ship size guide | IAATO ATCM 48 IP 194 rev.1, https://iaato.org/system/files?file=2026-05/ATCM48_ip194_rev1_e.pdf | primary. IAATO says figures may change; IAATO operators only |
| S4 | 170 southbound flights into Teniente R. Marsh airstrip supporting 126 air-cruise voyages, 2025-26 | Ports guide, fly-the-Drake Q&A, route table | IAATO ATCM 48 IP 200 rev.1 | primary |
| S5 | Adélie eggs mid-Nov, hatch late Dec, crèche at ~3 weeks, at sea by mid-Feb; chinstrap eggs late Nov, hatch early Jan, fledged ~2 months later; gentoo not well synchronised, crèche ~1 month after hatching, fledging 62–82 days in the south | Season chart, season guide, penguins Q&A | BAS Antarctic Penguins leaflet (2017), https://www.bas.ac.uk/wp-content/uploads/2015/05/Public-information-leaflet_PENGUINS_2017.pdf | primary. Gentoo month dates not found |
| S6 | Humpback numbers rise rapidly through December, stable by mid-January; researchers assume high numbers mid-December to late April | Season chart, season guide | Johannessen et al. 2022, https://pmc.ncbi.nlm.nih.gov/articles/PMC8826076/ | primary. Study covered Nov–Jan only; no measured Feb–Mar peak and no minke figure published |
| S7 | Antarctic sea ice reaches its annual minimum in southern summer (20 February in 2024) | Season chart, Antarctic Circle guide | https://science.nasa.gov/earth/antarctic-sea-ice-hits-annual-minimum-second-lowest-on-record | primary. Continent-wide, not Peninsula-specific. The month-to-month ice levels (3/2/2/1/1) in the chart are our reading of S2 + S7, not a measured series |
| S8 | Mean monthly air temperatures 1996–2025, Nov–Mar: Vernadsky −1.7, 0.0, +1.1, +1.1, +0.1 °C; range across Vernadsky, Rothera, Esperanza, Bellingshausen | Season chart, season guide, packing | BAS READER tables, https://legacy.bas.ac.uk/met/READER/surface/Faraday.All.temperature.html (and Rothera, Esperanza, Bellingshausen) | computed from primary data. Vernadsky values re-computed and matched on 2026-11-02 |
| S9 | Snow Hill Island is the most northerly emperor breeding site; BAS team reached it by cruise-ship helicopter, November 2023 | Regions guide, emperor Q&A, season guide | https://www.bas.ac.uk/project/snow-hill-emperor-penguin-expedition/ | primary |
| S10 | St Andrews Bay is South Georgia's largest king penguin colony | Regions guide, route table | GSGSSI visitor management plan (2015), https://gov.gs/wp-content/uploads/2022/10/St-Andrews-Bay.pdf | primary, but a 2015 document |
| S11 | South Georgia is about 800 miles SE of the Falklands; most visitors come on ships carrying fewer than 400 passengers | Regions guide, route table, ship size | https://gov.gs/frequently-asked-questions/ | primary ("miles" not specified) |
| S12 | Ross Sea region MPA: 1.55 million km², established 1 December 2017 | Regions guide, route table | https://www.doc.govt.nz/about-us/international-agreements/antarctica-treaty-system/ross-sea-region-marine-protected-area/ | primary |

## Drake Passage, ports, flights, trip lengths

| # | Fact | Where on site | Source | Confidence |
|---|---|---|---|---|
| D1 | Drake Passage about 850 km wide | Home, Drake guide | BAS, https://www.bas.ac.uk/data/our-data/publication/morphological-and-geological-features-of-drake-passage-antarctica-from-a-new-digital-bathymetric-model/ | primary |
| D2 | Narrowest constriction (800 km) on the ACC's path; ACC driven by westerly winds | Drake guide, Drake Q&A | Nature Communications 2023, https://pmc.ncbi.nlm.nih.gov/articles/PMC10684652/ | primary |
| D3 | Roaring Forties and Furious Fifties | Drake guide, Drake Q&A | NOAA, https://oceanservice.noaa.gov/facts/roaring-forties.html | primary |
| D4 | Westerlies strong because no continents slow them | Drake guide, Drake Q&A | BAS, https://www.bas.ac.uk/news/southern-hemisphere-westerly-winds-likely-to-intensify-as-climate-warms/ | primary |
| D5 | Drake crossing about two days each way | Drake guide, Drake Q&A, route table | Oceanwide OTL21-27 itinerary, https://oceanwide-expeditions.com/antarctica/cruises/otl21-27-falkland-islands-south-georgia-antarctic-peninsula | **operator only**; no authoritative source found |
| D6 | Classic voyage: 11 days / 10 nights, days 4–8 in Antarctica | Route table | Same Oceanwide page | operator. Note the page URL names Falklands/South Georgia but the itinerary is Ushuaia–Ushuaia, 10 nights; re-check |
| D7 | Fly-cruise: 8 days / 7 nights from Punta Arenas; two-hour flight; cruising days 3–6; sold late November to early March | Route table, fly-the-Drake Q&A | Antarctica21, https://antarctica21.com/our-expeditions/classic-antarctica-air-cruise | operator |
| D8 | DAP has flown to King George Island since 1989; flight about 2.5 hours on King Air, weather dependent | Ports guide, fly-the-Drake Q&A, route table | https://dapairline.com/wp-content/uploads/2024/09/Descripcion-Programas-Antarticos.pdf | primary (airline). Dated 2024 |
| D9 | Falklands–South Georgia–Antarctica: 19 days / 18 nights; calls at Stanley day 4; South Georgia days 7–10; South Orkneys day 12; Weddell Sea days 15–16 if ice permits | Route table, regions guide | Oceanwide OTL26-27, https://oceanwide-expeditions.com/antarctica/cruises/otl26-27-falkland-islands-south-georgia-antarctica | operator |
| D10 | Ross Sea voyage: 28 days from Bluff, NZ | Ports guide, route table | Heritage Expeditions, https://heritage-expeditions.com/destinations/antarctica-travel/ross-sea-antarctica-cruise | operator. Hobart departures not found |
| D11 | Antarctic Circle voyages typically 12–14 days; route depends on ice | Antarctic Circle guide | Cool Antarctica (booking agent), https://www.coolantarctica.com/Travel/Trip_details/antarctica_cruise_10.php | operator (agent) |
| D12 | Snow Hill helicopter voyages: 10 nights, November 2027, helicopter use depends on ice, sea and weather | Emperor Q&A | Oceanwide OTL24-27, https://oceanwide-expeditions.com/antarctica/cruises/otl24-27-antarctica-emperors-snow-hill-island-helicopters | operator |
| D13 | Operators lending boots / parka (Quark, Oceanwide) | Packing | https://www.quarkexpeditions.com/frequently-asked-questions; Oceanwide OTL21-27 | operator |
| D14 | "Fly the Drake" is industry shorthand | Fly-the-Drake Q&A | no defining source found | stated as shorthand, not a defined term |

## Computed values

| # | Value | Method | Where |
|---|---|---|---|
| C1 | Daylight on the 15th of each month, Nov 2026–Mar 2027: Port Lockroy 18h29, 21h38, 19h53, 16h07, 12h52; King George Island 17h36, 19h45, 18h40, 15h38, 12h46; Antarctic Circle 24h on 15 Dec, 12h56 on 15 Mar | NOAA solar calculator equations, sun's centre at −0.833°, https://gml.noaa.gov/grad/solcalc/. Cross-checked by an independent script (within 3 minutes) | Season chart, season guide, Antarctic Circle guide |
| C2 | Antarctic Circle ≈ 66°34′S (66.564°S for 2027) | 90° minus obliquity from NOAA equation | Antarctic Circle guide, places |
| C3 | Ushuaia–Deception Island ≈ 1,008 km / 544 nmi; Punta Arenas–Marsh airstrip ≈ 1,225 km / 661 nmi; Stanley–Grytviken ≈ 1,452 km / 784 nmi | Haversine, R = 6,371 km, OSM positions | Route table, Drake guide |

## Coordinates

All positions come from OpenStreetMap (Nominatim lookup, 2026-11-02) and are listed with links in `content/antarctica/data/places.json`. These are **approximate** reference points and must be checked: Grytviken, Snow Hill Island (lookup failed; coordinates entered by hand), Antarctic Peninsula (= Port Lockroy), South Shetland Islands (= King George Island), Drake Passage, Weddell Sea, Ross Sea, Antarctic Circle reference longitude, South Georgia, Falkland Islands. The Vernadsky station latitude (65°15′S) in the season chart label should be checked against the BAS station index, https://legacy.bas.ac.uk/met/READER/surface/stationpt.html.

## Not found, so not published

- A non-commercial source for Drake crossing time.
- An Argentine official figure for Ushuaia's share of voyages.
- Month-by-month gentoo breeding dates.
- A measured February–March humpback peak; any minke whale peak in the tourist season.
- A Peninsula-specific month-by-month sea-ice series.
- Any minimum insurance amount that applies to all Antarctic trips.
- Formal definitions of the Weddell Sea and Ross Sea.
- Punta Arenas sea-voyage figures (crossing time, trip length): the route table therefore treats Punta Arenas as the fly-cruise gateway only.
