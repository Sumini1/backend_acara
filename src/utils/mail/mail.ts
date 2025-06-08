import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import {
  EMAIL_SMTP_SERVICE_NAME,
  EMAIL_SMTP_HOST,
  EMAIL_SMTP_PORT,
  EMAIL_SMTP_USER,
  EMAIL_SMTP_PASS,
  EMAIL_SMTP_SECURE,
} from "../env";

// Transporter setup
const transporter = nodemailer.createTransport({
  service: EMAIL_SMTP_SERVICE_NAME,
  host: EMAIL_SMTP_HOST,
  port: EMAIL_SMTP_PORT,
  secure: EMAIL_SMTP_SECURE,
  auth: {
    user: EMAIL_SMTP_USER,
    pass: EMAIL_SMTP_PASS,
  },
  requireTLS: true,
});

// Interface untuk parameter email
export interface SendMailParams {
  from: string;
  to: string;
  subject: string;
  html: string;
}

// Fungsi kirim email
export const sendMail = async (params: SendMailParams) => {
  try {
    const result = await transporter.sendMail(params);
    return result;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};

// Fungsi render HTML dari template EJS
export const renderMailHtml = async (
  template: string,
  data: any
): Promise<string> => {
  const filePath = path.join(__dirname, `templates/${template}.ejs`);
data
  try {
    const content = (await ejs.renderFile(filePath, data)) as string;
    return content;
  } catch (error) {
    console.error("Failed to render email template:", error);
    throw error;
  }
};
