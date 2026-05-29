# Contract: Clipboard Return To Play

## Affected Surfaces

- UI surface: embedded `ClipboardConcussionAlert` shown on the Clipboard attendance modify
  page
- API proxy surface: `GET /clipboard/incident` and `GET /clipboard/incident/:id`

## Incident Response Contract

### List Response

`GET /clipboard/incident`

Returns paginated incident data where each incident may include a nested `returnToPlay`
object.

```json
{
  "data": [
    {
      "id": 45858,
      "dateTime": "2026-05-10 18:24:00",
      "concussionStatus": "confirmed",
      "studentConcerned": {
        "id": 65249624,
        "smsId": "56125",
        "firstName": "Brooke",
        "lastName": "Beekman",
        "legalFirstName": "Brooke"
      },
      "returnToPlay": {
        "date": "2026-06-01T14:00:00",
        "reason": "tbc (3 weeks if concussion)"
      },
      "archived": false
    }
  ],
  "currentPage": 1,
  "pageLength": 100,
  "numRecords": 1,
  "lastPage": 1
}
```

### Single Incident Response

`GET /clipboard/incident/:id`

Returns one incident object with the same nested `returnToPlay` shape used in the list
response.

## Field Semantics

- `returnToPlay.date` is a UTC timestamp from Clipboard.
- Consumers must interpret `returnToPlay.date` as UTC before comparing it with local class
  dates or formatting it for staff.
- `returnToPlay.reason` is optional; when blank, the UI falls back to a generic concussion
  label.
- If `returnToPlay` is missing or incomplete, the page must remain usable and the alert
  must degrade safely.

## UI Behaviour Contract

When the attendance modify page loads:

1. The UI fetches Clipboard incidents through the shared Clipboard incident service.
2. The service and shared type expose the nested `returnToPlay` object to the alert.
3. The alert keeps only confirmed incidents whose `returnToPlay.date`, interpreted as UTC,
   falls on or after the relevant local class date.
4. The alert omits incidents whose return-to-play restriction has already expired.
5. The alert links to the Clipboard incident, shows the student name, and uses the
   available reason text or a generic fallback.
6. On request failure, the page stays usable and the existing visible error path remains in
   effect.

## Verification Contract

- `mgg-ui` tests must cover the updated incident service boundary and any extracted UTC/date
  interpretation helpers.
- `../mggs-api` tests must cover list and single-incident responses returning the nested
  `returnToPlay` object.
- Manual validation must confirm at least one active restriction case, one expired
  restriction case, and one UTC day-boundary case on the attendance page.
