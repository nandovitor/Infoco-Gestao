import type { VercelRequest, VercelResponse } from '@vercel/node';

async function getZohoAccessToken(clientId: string, clientSecret: string, refreshToken: string) {
  const url = `https://accounts.zoho.com/oauth/v2/token?refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${clientSecret}&grant_type=refresh_token`;
  const response = await fetch(url, { method: 'POST' });
  if (!response.ok) {
    throw new Error('Failed to refresh Zoho token');
  }
  const data = await response.json();
  return data.access_token;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { to, subject, body, fromAddress } = req.body;
  if (!to || !subject || !body || !fromAddress) {
    return res.status(400).json({ message: 'Missing required fields: to, subject, body, fromAddress' });
  }
  
  const { ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, ZOHO_API_DOMAIN } = process.env;

  if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN || !ZOHO_API_DOMAIN) {
      return res.status(500).json({ message: 'Zoho API environment variables not configured.' });
  }

  try {
    const accessToken = await getZohoAccessToken(ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN);
    
    // Zoho API para enviar e-mail requer um formato JSON específico.
    const emailPayload = {
      from: {
        address: fromAddress, // e.g., 'admin@infoco.com'
      },
      to: [
        {
          email_address: {
            address: to,
          },
        },
      ],
      subject: subject,
      content: body, // Zoho aceita HTML no content
      mail_format: 'html'
    };

    const sendResponse = await fetch(`${ZOHO_API_DOMAIN}/api/accounts/${fromAddress}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    if (!sendResponse.ok) {
        const errorData = await sendResponse.json();
        console.error("Zoho send mail error:", errorData);
        return res.status(sendResponse.status).json({ message: 'Failed to send email via Zoho', details: errorData });
    }

    return res.status(200).json({ message: 'Email sent successfully!' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An internal error occurred.' });
  }
}
