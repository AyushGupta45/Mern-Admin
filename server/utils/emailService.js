import nodemailer from "nodemailer";

export async function sendVerificationEmail(email, verificationLink) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
  
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Email Verification",
      html: `Please click <a href="${verificationLink}">here</a> to verify your email address.`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error("Error sending verification email");
    }
  }