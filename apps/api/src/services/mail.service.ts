import {sendEmailPasswordReset, sendEmailRegistration} from "../config/nodemailer"


class EmailService {
  static async sendPasswordRegisterEmail(email: string): Promise<void> {
    await sendEmailRegistration(email);
  }

  static async sendPasswordResetEmail(email: string): Promise<void> {
    await sendEmailPasswordReset(email);
  }
}

export { EmailService };