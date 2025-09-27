import 'dotenv/config';
import process from 'node:process';
import twilio from 'twilio';
import consola from 'consola';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const smsEnabled = process.env.ENABLE_SMS === 'true';

const client = twilio(accountSid, authToken);

export async function sendSms(to: string, body: string) {
  if (!smsEnabled) {
    consola.log('SMS is disabled. Would have sent to:', to, 'Message Body: ', body);
    return;
  }
  try {
    await client.messages.create({
      body,
      from: twilioPhoneNumber,
      to,
    });
  }
  catch (error) {
    consola.error('Error sending SMS via Twilio:', error);
  }
}
