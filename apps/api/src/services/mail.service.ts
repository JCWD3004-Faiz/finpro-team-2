import sendEmail from '../config/nodemailer';


class EmailService {
  static async sendPasswordRegisterEmail(email: string): Promise<void> {
    await sendEmail(email);
  }
}

export { EmailService };