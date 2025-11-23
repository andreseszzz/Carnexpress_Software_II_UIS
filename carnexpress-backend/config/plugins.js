module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('EMAIL_SMTP_HOST', 'smtp.ethereal.email'),
        port: env('EMAIL_SMTP_PORT', 587),
        auth: {
          user: env('EMAIL_SMTP_USERNAME'),
          pass: env('EMAIL_SMTP_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: env('EMAIL_FROM', 'noreply@carnexpress.com'),
        defaultReplyTo: env('EMAIL_REPLY_TO', 'soporte@carnexpress.com'),
      },
    },
  },
});
