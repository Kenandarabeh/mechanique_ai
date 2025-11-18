import nodemailer from 'nodemailer';

// Create Gmail SMTP transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false // Accept self-signed certificates
    }
  });
};

export async function sendVerificationEmailGmail(email: string, code: string): Promise<boolean> {
  try {
    console.log('📧 Gmail SMTP: Sending verification email to:', email);
    console.log('🔐 Code:', code);

    const transporter = createTransporter();

    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection verified');

    // Send email
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'MechaMind'}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: 'Verification Code - MechaMind',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: #f3f4f6;
              font-family: Arial, sans-serif;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              padding: 30px 20px;
              background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 28px;
            }
            .header p {
              color: #e0e7ff;
              margin: 10px 0 0 0;
              font-size: 16px;
            }
            .body {
              padding: 40px 30px;
            }
            .body h2 {
              color: #1f2937;
              margin: 0 0 20px 0;
              font-size: 24px;
              text-align: center;
            }
            .body p {
              color: #475569;
              margin: 0 0 20px 0;
              font-size: 16px;
              line-height: 1.5;
              text-align: center;
            }
            .code-box {
              text-align: center;
              margin: 30px 0;
            }
            .code-container {
              display: inline-block;
              background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
              padding: 30px;
              border-radius: 12px;
              border: 2px solid #3b82f6;
            }
            .code-label {
              color: #1e40af;
              font-size: 14px;
              margin: 0 0 10px 0;
              font-weight: 600;
            }
            .code {
              color: #1e40af;
              font-size: 42px;
              letter-spacing: 8px;
              margin: 0;
              font-family: 'Courier New', monospace;
              font-weight: bold;
            }
            .warning {
              color: #6b7280;
              font-size: 14px;
              line-height: 1.6;
              margin: 30px 0 0 0;
              text-align: center;
            }
            .note {
              color: #9ca3af;
              font-size: 13px;
              line-height: 1.6;
              margin: 20px 0 0 0;
              text-align: center;
            }
            .footer {
              background-color: #f9fafb;
              padding: 20px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
            }
            .footer p {
              color: #64748b;
              margin: 0;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <h1>🔧 MechaMind</h1>
              <p>Your Smart Mechanic Assistant</p>
            </div>
            
            <!-- Body -->
            <div class="body">
              <h2>Welcome! 👋</h2>
              <p>
                Thank you for signing up with MechaMind. Use the following code to verify your account:
              </p>
              
              <!-- OTP Code -->
              <div class="code-box">
                <div class="code-container">
                  <p class="code-label">VERIFICATION CODE</p>
                  <h1 class="code">${code}</h1>
                </div>
              </div>
              
              <p class="warning">
                ⏰ This code is valid for <strong>10 minutes</strong> only
              </p>
              
              <p class="note">
                If you didn't request this code, please ignore this message.
              </p>
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <p>© 2025 MechaMind. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        MechaMind - Verification Code
        
        Welcome!
        
        Thank you for signing up with MechaMind.
        
        Your verification code is: ${code}
        
        This code is valid for 10 minutes only.
        
        If you didn't request this code, please ignore this message.
        
        © 2025 MechaMind. All rights reserved.
      `
    });

    console.log('✅ Email sent successfully!');
    console.log('📬 Message ID:', info.messageId);
    console.log('📨 Response:', info.response);

    return true;

  } catch (error) {
    console.error('❌ Failed to send email via Gmail SMTP:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return false;
  }
}

// Test function to verify SMTP connection
export async function testGmailConnection(): Promise<boolean> {
  try {
    console.log('🔍 Testing Gmail SMTP connection...');
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Gmail SMTP connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Gmail SMTP connection failed:', error);
    return false;
  }
}
