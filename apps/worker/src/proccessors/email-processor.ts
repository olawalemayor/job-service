import nodemailer from "nodemailer";
import config from "../config";
import Mail from "nodemailer/lib/mailer";

const transporter = nodemailer.createTransport({
  host: config.mailHost,
  port: config.mailPort,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: config.mailUser,
    pass: config.mailPassword,
  },
});

export const emailProcessor = async (
  to: string,
  body: string,
  attachments?: any,
) => {
  const isHTML = /<[a-z/][\s\S]*>/i.test(body);

  const mail: Mail.Options = {
    from: config.mailSender,
    to,
    subject: "Test Subject",
  };

  if (isHTML) mail.html = body;
  else mail.text = body;

  if (attachments && Array.isArray(attachments)) {
    const mailAttachments: Mail.Options["attachments"] = [];
    attachments.forEach((att) => {
      if (typeof att === "string") {
        const isDataUrl =
          /^data:([a-z]+\/[a-z0-9\-+.]+(;[a-z0-9\-.!#$%*+.{}|~`^&'_]+=[a-z0-9\-.!#$%*+.{}|~`^&'_]+)*)?(;base64)?,([a-z0-9!$%&'()*+,.;:\-=_~@/?\s]*)$/i.test(
            att,
          );

        const filename = "Attachment" + new Date().toISOString();

        if (isDataUrl) mailAttachments.push({ raw: att, filename });
        else mailAttachments.push({ path: att, filename });
      }
    });
    mail.attachments = attachments;
  }

  try {
    const info = await transporter.sendMail(mail);

    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};
