# Launch and turnover checklist

## Before sharing the website as a project site

- [ ] The project leader has reviewed all public content and approved branding and claims.
- [ ] Institution/barangay permissions and whether BFP will actually participate have been confirmed.
- [ ] Project account ownership, edit access and future maintenance have been assigned.
- [ ] The survey notice and questionnaire were approved and pilot-tested.
- [ ] Actual barangay geographic coverage (including any indicative PSA outline) has been checked with barangay stakeholders; sample zones and geographic unit codes were approved.
- [ ] A nonintrusive field safety protocol and urgent referral route are in place.
- [ ] Form/Sheet access is restricted; collection/retention policy and participant rights process exist.
- [ ] No raw response data or private information is included in GitHub commits or images.
- [ ] The site is tested on at least one smartphone and for low-bandwidth access; OpenStreetMap roads and recenter work on the published site with internet, and the larger-map fallback link works.
- [ ] A QR code is produced for the public site ONLY once the site/consent notice is ready.

## Before opening the survey

- [ ] The Google Form is in the authorized institutional/project account.
- [ ] The respondent URL (not editor URL) is set in `config.js`.
- [ ] `surveyOpen` is switched to `true` **only** after approval.
- [ ] Staff have a safe process to respond to credible urgent hazards (the website is not emergency reporting).
- [ ] Non-digital participation remains available.

## Before publishing vulnerability results

- [ ] Data were cleaned and assessed; missing/unknown decisions are documented.
- [ ] Indicator directions, weights, thresholds and sensitivity checks are documented.
- [ ] Zone-level privacy threshold/combination rules were approved and applied.
- [ ] The map and interpretation were reviewed with appropriate stakeholders.
- [ ] A map legend, data date, unit, coverage and limitations are visible.
- [ ] No identifiable household markers/photos or low-count units are displayed.
- [ ] `node scripts/check-public-data.js` passes, then the PNG is also manually inspected.
- [ ] Approved action-plan information can be handed over and maintained.

## During Week 12 handover

- [ ] Transfer project account/repository permissions appropriately, not private passwords.
- [ ] Supply the QGIS project and methodology files privately to approved stakeholders.
- [ ] Provide the public map guide, approved assessment summary, draft action plan and training materials.
- [ ] Complete attendance/turnover record and evaluation feedback.
- [ ] Set a follow-up review of action items approximately 3 months after turnover, subject to partner agreement.
