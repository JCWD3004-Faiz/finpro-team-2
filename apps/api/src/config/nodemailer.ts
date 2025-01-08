import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";
import environment from "dotenv";
import config from "../config/config";
import { PrismaClient } from "@prisma/client";

environment.config();

const prisma = new PrismaClient();

const transporter: Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


export async function sendEmailRegistration(email: string): Promise<void> {
    try {
      const user = await prisma.pendingRegistrations.findMany({
        where: { email: email },
      });
  
      if (!user) {
        console.error('User not found');
        return;
      }
  
      const templatePath = path.join(__dirname, '/views/', 'emailVerification.ejs');
      const verificationLink = `${config.FRONTEND_URL}/auth/verify-registration/${user[0].verification_token}`;
      const html = await ejs.renderFile(templatePath, {
        userName: user[0].username,
        verificationLink,
        userEmail: email
      });
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user[0].email,
        subject: 'Email Verification',
        html: html, 
      };
  
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
}

export async function sendEmailPasswordReset(email: string): Promise<void> {
  try {
    const user = await prisma.pendingRegistrations.findMany({
      where: { email: email },
    });

    if (!user) {
      console.error('User not found');
      return;
    }

    const templatePath = path.join(__dirname, '/views/', 'passwordReset.ejs');
    const verificationLink = `${config.FRONTEND_URL}/auth/verify-password/${user[0].verification_token}`;
    const html = await ejs.renderFile(templatePath, {
      verificationLink,
      userEmail: email
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user[0].email,
      subject: 'Password Reset',
      html: html, 
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export async function sendEmailVerification(email: string): Promise<void> {
  try {
    const user = await prisma.pendingRegistrations.findMany({
      where: { email: email },
    });

    if (!user) {
      console.error('User not found');
      return;
    }

    const templatePath = path.join(__dirname, '/views/', 'emailVerif.ejs');
    const verificationLink = `${config.FRONTEND_URL}/auth/verify-email/${user[0].verification_token}`;
    const html = await ejs.renderFile(templatePath, {
      userName: user[0].username,
      verificationLink,
      userEmail: email
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user[0].email,
      subject: 'New Email Verification',
      html: html, 
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
  