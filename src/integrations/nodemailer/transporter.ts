import { serverEnv } from '#env/server'
import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport(serverEnv.SMTP_SERVER)
