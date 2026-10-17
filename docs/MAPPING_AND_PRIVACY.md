# Mapping, interpretation and privacy release protocol

Based on **Annex B** and **Component 3** of the supplied extension proposal. This is a technical support note; final weights, thresholds, target sample and data permissions have NOT been approved.

## 1. Define area coverage with partners

Obtain barangay-approved or authoritative zone/block boundaries, survey coverage and base geospatial information. Keep full household geolocation (if ever collected with authorization) separate from public outputs. The public map should use **aggregated geographical units** large enough to protect respondents. A meaningful map cannot be constructed from invented zone polygons.

## 2. Finalize indicator rules after piloting

The proposal suggests four possible dimensions:

- Reported/observable electrical warning signs
- Household preparedness
- Evacuation constraints
- Emergency access

For each approved indicator, record its wording/source, coded direction, normalization, missing/unknown rule, indicator weight, rationale and limitations in the blank `templates/indicator-register.csv`. **Do not treat a self-report as professional diagnosis.**

## 3. Analyze transparently

Document sampling/participation, missing responses and excluded records; distinguish zero/no from unknown. Use an approved, reproducible scoring procedure. Test whether reasonable alternative weights change any priority categories. Do not choose or change thresholds after inspecting results merely to create dramatic map differences.

## 4. Review aggregate disclosure risk

- Do not publish exact homes, street addresses, household photos, full coordinates, names or contact information.
- Merge/suppress geographic units with small respondent counts or likely reidentification risk. The sample `minimumZoneResponses: 10` is an example software check only, not a guarantee of anonymity or official policy.
- Be careful with maps showing tiny polygons or rare characteristics even if names have been removed.
- The **QGIS map PNG itself** can leak labels/coordinates: inspect its pixels, legend and attribute labels before uploading.
- The JSON file is public on GitHub Pages. Only include explicitly approved aggregated summaries.
- Confirm how public outputs will be versioned/corrected, which account owns them, and the retention period of private records.

## 5. Validate with stakeholders

Hold a map interpretation workshop and correct contextual errors without describing the map as a finding of code noncompliance, actual electrical defects, fire causation or safety status of a specific home. Record the validation date, persons/roles (without publicizing private contact details), limitations and remaining uncertainty.

## 6. Export and publish

In QGIS export a high-resolution image containing:

- Title with **community vulnerability screening / planning** language
- Barangay location and confirmed geographic aggregation units
- A correct legend and classification method reference
- Survey coverage, survey data period and validation date
- A notice of missing data/uncertainty
- A statement that categories are **screening priorities**, not household safety labels

After partner review, save the map under `assets/` and update `data/public-map.json`. It must keep `status: pending` until review is complete.

## Example public-map.json STRUCTURE (fictional example only)

This snippet is for understanding field names, NOT for copying or publishing as results. No fake map image is packaged as a validated result.

```json
{
  "status": "published",
  "reviewed": true,
  "mapTitle": "Reviewed zone-level screening map",
  "mapImageUrl": "assets/validated-community-map.png",
  "surveyPeriod": "DATE_RANGE_APPROVED_BY_TEAM",
  "validationDate": "APPROVED_DATE",
  "minimumZoneResponses": 10,
  "zones": [
    { "zone": "EXAMPLE_ZONE_NAME", "responses": 20, "priority": "Moderate" }
  ]
}
```

Do not publish this example as a finding.


## Real map versus vulnerability map (Version 3)

The website now includes a **real street-map viewer centered on Barangay Lapasan**. OpenStreetMap renders the actual map labels, roads and geography; this baseline map is *not* evidence of electrically induced fires or community vulnerability. No barangay boundary is drawn by default: the point marker only indicates the approximate Lapasan locality. If tiles fail in a restricted preview, the local location panel appears with a direct OpenStreetMap link. Current barangay-approved study coverage and internal zones must be separately established before using the map for scoring. The website does not derive any risk level from a postcode, map tile or simple quick-check answer.
