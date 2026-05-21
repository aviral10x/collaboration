import { Buffer } from 'node:buffer';
import type { IncomingMessage, ServerResponse } from 'node:http';

type ContactMethod = 'Telegram' | 'WhatsApp';

type ContactSubmission = {
  name: string;
  email: string;
  website: string;
  contactMethod: ContactMethod;
  contactHandle: string;
  goal: string;
  projectDetails: string;
  budget: string;
  timeline: string;
  calendlyCallBooked: boolean;
  pageUrl: string;
};

type RequestWithMethod = IncomingMessage & {
  method?: string;
};

type Web3FormsResponse = {
  success?: boolean;
  message?: string;
};

const web3FormsAccessKey = process.env.WEB3FORMS_ACCESS_KEY ?? '5ef59b49-97e2-4d47-b503-5197e223d81a';
const spreadsheetWebhookUrl =
  process.env.SPREADSHEET_WEBHOOK_URL ??
  process.env.GOOGLE_SHEETS_WEBHOOK_URL ??
  process.env.EXCEL_WEBHOOK_URL;

function sendJson(response: ServerResponse, statusCode: number, body: Record<string, unknown>) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.end(JSON.stringify(body));
}

async function readBody(request: IncomingMessage) {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks).toString('utf8');
}

function getString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function parseSubmission(body: unknown): ContactSubmission {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid request body.');
  }

  const source = body as Record<string, unknown>;
  const contactMethod = getString(source.contactMethod);

  if (contactMethod !== 'Telegram' && contactMethod !== 'WhatsApp') {
    throw new Error('Invalid contact method.');
  }

  const submission: ContactSubmission = {
    name: getString(source.name),
    email: getString(source.email),
    website: getString(source.website),
    contactMethod,
    contactHandle: getString(source.contactHandle),
    goal: getString(source.goal),
    projectDetails: getString(source.projectDetails),
    budget: getString(source.budget),
    timeline: getString(source.timeline),
    calendlyCallBooked: Boolean(source.calendlyCallBooked),
    pageUrl: getString(source.pageUrl),
  };

  if (!submission.name || !/^\S+@\S+\.\S+$/.test(submission.email)) {
    throw new Error('Missing name or valid email.');
  }

  return submission;
}

function submissionRow(submission: ContactSubmission, submittedAt: string) {
  return [
    submittedAt,
    submission.name,
    submission.email,
    submission.website,
    submission.contactMethod,
    submission.contactHandle,
    submission.goal,
    submission.projectDetails,
    submission.budget,
    submission.timeline,
    submission.calendlyCallBooked ? 'Yes' : 'No',
    submission.pageUrl,
  ];
}

async function appendToSpreadsheet(submission: ContactSubmission, submittedAt: string) {
  if (!spreadsheetWebhookUrl) {
    return { configured: false, recorded: false };
  }

  try {
    const response = await fetch(spreadsheetWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        submittedAt,
        source: 'Neural Studios website',
        row: submissionRow(submission, submittedAt),
        fields: submission,
      }),
    });

    if (!response.ok) {
      const message = await response.text();
      console.error(`Spreadsheet webhook failed: ${response.status} ${message.slice(0, 400)}`);

      return {
        configured: true,
        recorded: false,
        status: response.status,
      };
    }

    return { configured: true, recorded: true };
  } catch (error) {
    console.error('Spreadsheet webhook failed:', error);

    return {
      configured: true,
      recorded: false,
      error: error instanceof Error ? error.message : 'Unknown spreadsheet error.',
    };
  }
}

async function sendEmail(submission: ContactSubmission) {
  const formData = new FormData();

  formData.append('access_key', web3FormsAccessKey);
  formData.append('subject', `Neural Studios Application - ${submission.name}`);
  formData.append('from_name', 'Neural Studios Website');
  formData.append('name', submission.name);
  formData.append('email', submission.email);
  formData.append('project_website_or_social_link', submission.website);
  formData.append('preferred_contact_method', submission.contactMethod);
  formData.append('contact_handle', submission.contactHandle);
  formData.append('looking_for', submission.goal);
  formData.append('project_details', submission.projectDetails);
  formData.append('monthly_budget', submission.budget);
  formData.append('ideal_timeline', submission.timeline);
  formData.append('calendly_call_booked', submission.calendlyCallBooked ? 'Yes' : 'No');
  formData.append('page_url', submission.pageUrl);

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: formData,
  });
  const text = await response.text();
  let result: Web3FormsResponse;

  try {
    result = JSON.parse(text) as Web3FormsResponse;
  } catch {
    console.error(`Web3Forms returned a non-JSON response: ${response.status} ${text.slice(0, 400)}`);
    throw new Error('Email service returned an invalid response.');
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message ?? 'Web3Forms submission failed.');
  }

  return { sent: true };
}

export default async function handler(request: RequestWithMethod, response: ServerResponse) {
  if (request.method === 'OPTIONS') {
    sendJson(response, 200, { success: true });
    return;
  }

  if (request.method !== 'POST') {
    sendJson(response, 405, { success: false, error: 'Method not allowed.' });
    return;
  }

  try {
    const rawBody = await readBody(request);
    const submission = parseSubmission(JSON.parse(rawBody));
    const submittedAt = new Date().toISOString();
    const sheet = await appendToSpreadsheet(submission, submittedAt);
    const email = await sendEmail(submission);

    sendJson(response, 200, {
      success: true,
      email,
      sheet,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Submission failed.';
    sendJson(response, 500, {
      success: false,
      error: message,
    });
  }
}
