import nodemailer from "nodemailer";
const sendMailMock = jest.fn();

jest.mock("nodemailer", () => ({
  __esModule: true,
  default: {
    createTransport: jest.fn(() => ({
      sendMail: sendMailMock,
    })),
    getTestMessageUrl: jest.fn(() => "preview-url"),
  },
}));

import { emailProcessor } from "../src/proccessors/email-processor";
import config from "../src/config";

describe("emailProcessor", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    sendMailMock.mockResolvedValue({
      messageId: "123",
    });

    (nodemailer.getTestMessageUrl as jest.Mock).mockReturnValue("preview-url");
  });

  it("should send a text email when body is plain text", async () => {
    await emailProcessor("test@example.com", "Hello world");

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: config.mailSender,
        to: "test@example.com",
        subject: "Test Subject",
        text: "Hello world",
      }),
    );
  });

  it("should send an HTML email when body contains HTML", async () => {
    await emailProcessor("test@example.com", "<h1>Hello</h1>");

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        html: "<h1>Hello</h1>",
      }),
    );
  });

  it("should attach files when attachments are provided as paths", async () => {
    const attachments = ["/path/to/file.pdf"];

    await emailProcessor("test@example.com", "Hello", attachments);

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        attachments,
      }),
    );
  });

  it("should handle data URL attachments", async () => {
    const dataUrl = "data:text/plain;base64,SGVsbG8gd29ybGQ=";

    await emailProcessor("test@example.com", "Hello", [dataUrl]);

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        attachments: [dataUrl],
      }),
    );
  });

  it("should not include attachments if not an array", async () => {
    await emailProcessor("test@example.com", "Hello", "not-an-array" as any);

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.not.objectContaining({
        attachments: expect.anything(),
      }),
    );
  });

  it("should log error if sendMail fails", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    sendMailMock.mockRejectedValue(new Error("SMTP error"));

    await emailProcessor("test@example.com", "Hello");

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error while sending mail:",
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });

  it("should log success message", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    await emailProcessor("test@example.com", "Hello");

    expect(consoleSpy).toHaveBeenCalledWith("Message sent: %s", "123");

    expect(consoleSpy).toHaveBeenCalledWith("Preview URL: %s", "preview-url");

    consoleSpy.mockRestore();
  });
});
