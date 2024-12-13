import {sendEmailPasswordReset, sendEmailRegistration, sendEmailVerification} from "../config/nodemailer"


class EmailService {
  static async sendPasswordRegisterEmail(email: string): Promise<void> {
    await sendEmailRegistration(email);
  }

  static async sendPasswordResetEmail(email: string): Promise<void> {
    await sendEmailPasswordReset(email);
  }

  static async sendVerificationEmail(email: string): Promise<void> {
    await sendEmailVerification(email);
  }
}

export { EmailService };