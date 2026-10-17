# Lapasan Electrical Safety - GitHub Pages Site

A mobile-friendly **Option B** website for the proposed USTP Extension Project:

> Assessment and Mapping of Community Vulnerability to Electrically Induced Fire: Basis for Electrical Safety and Risk-Reduction Planning in Barangay Lapasan, Cagayan de Oro City, Philippines

**Status:** REVISED V3 SITE - iframe-free interactive geography and local-only safety check are functional in supported browsers with internet connectivity. Official response collection remains a separately configured, consented Google Form. This package does **not** contain actual household survey results, approved survey links, vulnerability scores, barangay-approved project zones or agency endorsements. Do not describe it as a completed assessment.

## What is already working?

- Responsive homepage with community project information and 12-week activity plan.
- Four-step **working local safety check** that gives personalized general guidance and lets visitors download the safety reminders; it **does not save or transmit answers**.
- One-click official survey link when you connect an *approved* Google Form in `config.js`.
- **Actual Barangay Lapasan area map** with interactive OpenStreetMap street tiles, drag-to-pan, zoom buttons, keyboard panning, locality marker, recenter control, and a clear offline/preview fallback. No iframe, map CDN, or automatic boundary import is used. Exact study-zone boundaries require barangay approval.
- Separate privacy-safe **vulnerability-results publication area** that remains unpublished until your team releases a validated map image and authorized aggregate summaries.
- Electrical safety guidance, scope limitations and proposed action-plan section.
- Downloadable **blank** barangay action-plan CSV template.
- Mobile navigation, screen-reader labels and an accessible modal survey preview.
- No external server or paid hosting necessary.

## Fastest way to put the site online (GitHub Pages)

1. Sign in to a GitHub account the **project team controls** and create a repository, for example `lapasan-electrical-safety`. Make it **Public** only after checking every file. Never upload survey response sheets to GitHub.
2. Upload **the contents of this folder** into the root of the repository. GitHub's website has **Add file > Upload files**. Commit to the `main` branch.
3. Go to **Settings > Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/(root)`, and click **Save**.
4. After publishing, the site address will generally be `https://YOUR-USERNAME.github.io/lapasan-electrical-safety/` (or your organization's Pages URL). It may take a few minutes to appear.
5. Test the site from a phone with an internet connection for map tiles. Navigation and the local safety check work even with no Form link or map data. Some file-preview/sandbox environments block external maps; the public map link still points directly to Lapasan.

Because this is a static site, Pages cannot itself protect or process a private household-response database.

## Connect Google Forms (only after authorization)

**The safest default is for the survey to remain closed** until barangay/USTP permissions, consent notice, approved survey areas and a responsible data steward have been established.

1. Review `docs/SURVEY_AND_FIELDWORK.md` with the project leader and stakeholders.
2. Create a Google Form in a **project-controlled Google account**. A starter Apps Script is included in `google_forms/CreateSurvey.gs`; read its warning first.
3. Set the respondent form to collect only agreed, minimally necessary information. Keep the Google Sheet/response file **private** and access-restricted.
4. Obtain the Form's **respondent** URL (not the edit URL).
5. In `config.js`, set `surveyUrl` to that URL and set `surveyOpen: true` only when authorized. Commit that small change to GitHub.
6. On the site, **Open the approved household survey** will now take respondents to Google Forms.

Do not enable automatic email capture, sign-in restrictions that exclude residents, or collection of exact addresses unless the project has explicitly reviewed and authorized them.

## Publish the map *after* validation

The proposal calls for **georeferenced, aggregate, privacy-conscious vulnerability screening**. It does not prescribe scores or fixed indicator weights, so this site intentionally **does not invent a risk index**.

1. Conduct approved surveys and supervised nonintrusive observations. Keep raw data in private storage.
2. Predefine and document indicator selection, score direction, normalization, handling of unknowns/missing answers, weights and classification thresholds *after piloting and before final mapping*. Run reasonable weight-sensitivity comparisons.
3. Analyze with a spreadsheet/QGIS and validate interpretation with barangay stakeholders (and BFP personnel **if available and confirmed**).
4. In QGIS, export a **privacy-reviewed, zone-level georeferenced map** as a high-resolution PNG. Include a legend, data date, geographic aggregation unit, coverage, missing-data limitations and correct labels.
5. Save it as `assets/validated-community-map.png` (or other allowed image name).
6. Edit `data/public-map.json` only after approval. Set `status` to `published`, `reviewed` to `true`, `mapImageUrl` to `assets/validated-community-map.png`, and enter only authorized aggregated zone summaries. `minimumZoneResponses: 10` is a **starter technical guardrail**, **NOT** an USTP-approved small-cell rule; partners must approve an appropriate privacy standard. The site's code refuses to display zone summary cards with fewer responses than the configured threshold.
7. Run `node scripts/check-public-data.js`, inspect the PNG **visually for identifiable homes and labels**, and then push the approved image and JSON. Only then does the map change from the pending-data screen.

**Privacy warning:** Anything you put in a **public GitHub repository**, including `data/public-map.json` and `assets/`, is public even if the website hides it. The client-side checks are just additional guardrails. Never upload raw household files, name/phone/email/address fields, consent logs, precise home coordinates, private referral details or API keys.

## Folder guide

```text
index.html                   Main one-page website
styles.css                   Responsive styling
app.js                       Menu, safety check, built-in street map viewer, publication logic
config.js                    Public site configuration and approved Form link
assets/favicon.svg           Original generic site symbol (not an official logo)
assets/                      Add an approved QGIS-exported PNG here later
data/public-map.json         Pending/unpublished aggregate map manifest
google_forms/CreateSurvey.gs  OPTIONAL Google Apps Script survey starter
templates/                   Blank worksheet/checklist templates
scripts/check-public-data.js  Basic safety and schema checks
/docs/                       Deployment, privacy, fieldwork and proposal notes
```

## Recommended project operating model

- **Public website:** GitHub Pages, public general information, an approved survey link, reviewed aggregate map and final public action-plan summary.
- **Restricted survey storage:** Google Forms + restricted-access Google Sheet managed by a designated steward.
- **Offline fieldwork:** assisted/paper survey options and supervised nonintrusive observations for households lacking internet.
- **Analysis:** private workbook + QGIS; validation meeting before any public map release.
- **Handover:** agreed website maintainer, revision log, approved information content, map interpretation guide, action plan and follow-up check.

## Test locally

With Python installed, from this directory:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000` in a browser. On Windows, `py -m http.server 8000` may work. A local server avoids browser restrictions on fetching the map JSON from `file://`.

No npm or frontend build process is required.

## Proposal alignment

See `docs/PROPOSAL_ALIGNMENT.md` and `docs/PROPOSAL_INSERTION_TEXT.md`. The website supports the proposal; it **does not replace** household fieldwork, expert referral, stakeholder validation or the action-planning workshop.

## What remains for your team

The **public survey URL**, approved survey wording/area codes, official partner permissions, contact/referral protocol, project account access, sample/coverage plan, actual survey and observation data, QGIS map, chosen scoring/weights, validation/approval, and ongoing maintenance owner cannot be filled in responsibly without the project stakeholders. These are not bugs or missing website code; they are necessary real-world inputs.


## Version 2: real Lapasan mapping details

- **Map centre:** 8.48328 degrees N, 124.66490 degrees E, based on OpenStreetMap locality point shown by Mapcarta. PhilAtlas independently locates Barangay Lapasan at approximately 8.4829 N, 124.6640 E.
- **Street tiles:** OpenStreetMap contributors, accessed through direct browser map-tile requests. Requires internet to see street tiles.
- **Boundary:** None is included yet. The project must verify the current study area and zone/block geometry with barangay stakeholders before publishing boundaries.
- **Do not claim any mapped hazards:** This release contains no measured vulnerability results, households, colored high-risk areas, or fabricated research findings.

Reference URLs:
- OpenStreetMap: https://www.openstreetmap.org/?mlat=8.48328&mlon=124.6649#map=15/8.48328/124.6649
- Mapcarta Lapasan locality: https://mapcarta.com/15760394
- PhilAtlas: https://www.philatlas.com/mindanao/r10/cagayan-de-oro/lapasan.html

### Known activation steps (not bugs)

1. Team confirms consent procedures, field sampling, municipality/barangay survey units, and private data steward.
2. Team creates an approved Google Form using the optional `google_forms/CreateSurvey.gs` script or manually, connects restricted Sheet storage, and inserts respondent link into `config.js`.
3. Team conducts actual fieldwork and privately computes approved aggregated indicators. After partner validation, exports an appropriate QGIS map image and configures `data/public-map.json`.
4. Team publishes to GitHub Pages and maintains the approved material and status text. The static public site must not store identifiable participant data.

The local quick check **cannot** send research responses to a central dataset by itself. That is deliberate: a public GitHub Pages repository is not private storage.

## V3: broken-embed correction

The former home-page iframe could show a broken-file icon in browser previews or security-restricted embeds. V3 removes ALL embedded OpenStreetMap iframes and the third-party Leaflet CDN. A lightweight browser tile viewer requests current OpenStreetMap street tiles directly. Its map supports dragging, zoom controls, arrow-key panning, and a recenter button. The custom viewer is intended for this one small public community website, not a GIS substitute.

If a sandbox or offline connection blocks tile images, a styled **coordinate locator** (not a fake street map) appears with a working **Open Lapasan map** external link. The real street layout only appears when tiles can load. OpenStreetMap contributors are attributed in each map. The correct Lapasan centre is **approximate** and not an official administrative boundary.
