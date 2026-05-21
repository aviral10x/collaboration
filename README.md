# Neural Studios - Cinematic Video Studio Portfolio

## Contact form spreadsheet capture

The contact form posts to `/api/contact`. The API sends the lead through Web3Forms and can append the same submission to a spreadsheet webhook.

Set these Vercel environment variables:

```bash
WEB3FORMS_ACCESS_KEY=your_web3forms_key
SPREADSHEET_WEBHOOK_URL=your_google_apps_script_or_excel_power_automate_webhook
VITE_GA_MEASUREMENT_ID=your_google_analytics_measurement_id
```

The spreadsheet webhook receives:

```json
{
  "submittedAt": "2026-05-21T00:00:00.000Z",
  "source": "Neural Studios website",
  "row": ["submittedAt", "name", "email", "website", "contactMethod", "contactHandle", "goal", "projectDetails", "budget", "timeline", "calendlyCallBooked", "pageUrl"],
  "fields": {}
}
```
