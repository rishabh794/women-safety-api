import 'dotenv/config';
import process from 'node:process';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export async function sendSms(to: string, body: string) {
  try {
    await client.messages.create({
      body,
      from: twilioPhoneNumber,
      to,
    });
  }
  catch (error) {
    console.error('Error sending SMS via Twilio:', error);
  }
}
