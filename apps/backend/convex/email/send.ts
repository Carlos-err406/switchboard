"use node";
import { env } from "../env.js";
import nodemailer from "nodemailer";
import { getRawTemplate, replacePlaceholders } from "./helpers";
import type { Email, EmailTemplateTypes } from "./types";

type SendEmailArgs<T extends EmailTemplateTypes> = {
  to: string[];
  cc?: string[];
  email: Email<T>;
};
const sendEmail = async <T extends EmailTemplateTypes>({
  to,
  cc,
  email,
}: SendEmailArgs<T>) => {
  try {
    const transporter = nodemailer.createTransport(env.SMTP_SERVER);
    const { variables, template } = email;
    const { BODY, SUBJECT } = await getRawTemplate(template);

    await transporter.sendMail({
      from: env.SMTP_FROM,
      to,
      cc,
      html: replacePlaceholders(BODY, variables),
      subject: SUBJECT,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export default sendEmail;
