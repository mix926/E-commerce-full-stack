import { Resend } from 'resend';

let resend: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
          }
          .header {
            background: linear-gradient(135deg, #3b82f6, #6366f1);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 12px 12px 0 0;
          }
          .content {
            background-color: white;
            padding: 30px;
            border-radius: 0 0 12px 12px;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6, #6366f1);
            color: white;
            padding: 12px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
          }
          .warning {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            font-size: 14px;
            color: #92400e;
          }
          .footer {
            background-color: #f3f4f6;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-radius: 0 0 12px 12px;
          }
          .security-tip {
            background-color: #eff6ff;
            border: 1px solid #bfdbfe;
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
            font-size: 13px;
            color: #1e40af;
          }
          h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
          }
          p {
            margin: 10px 0;
          }
          .expiration {
            font-size: 14px;
            color: #6b7280;
            margin: 15px 0;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 Password Reset Request</h1>
          </div>
          
          <div class="content">
            <p>Hi there,</p>
            
            <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
            
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Your Password</a>
            </p>
            
            <p style="text-align: center; font-size: 12px; color: #6b7280; word-break: break-all;">
              Or copy this link: ${resetUrl}
            </p>
            
            <div class="expiration">
              ⏰ This password reset link will expire in 24 hours. After that, you'll need to request a new reset link.
            </div>
            
            <div class="security-tip">
              <strong>🔐 Security Tip:</strong> Never share this reset link with anyone. We will never ask you for this link via email, chat, or phone.
            </div>
            
            <div class="warning">
              <strong>⚠️ Important:</strong> If you didn't request this password reset, please ignore this email. Your account remains secure.
            </div>
          </div>
          
          <div class="footer">
            <p>&copy; 2024 E-Commerce App. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  // If RESEND_API_KEY is not set, log to console instead of sending
  if (!process.env.RESEND_API_KEY) {
    console.log('[Email Service - Development Mode]');
    console.log(`To: ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log('(Email would be sent if RESEND_API_KEY was configured)');
    return;
  }

  try {
    const client = getResendClient();
    if (!client) {
      throw new Error('Resend client not initialized');
    }
    
    await client.emails.send({
      from: 'noreply@e-commerce-app.dev',
      to: email,
      subject: 'Reset Your Password',
      html: htmlContent,
    });
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}
