import { testGmailConnection, sendVerificationEmailGmail } from '@/lib/gmail-smtp';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test connection
    const connected = await testGmailConnection();
    
    if (!connected) {
      return NextResponse.json({
        success: false,
        message: 'Failed to connect to Gmail SMTP'
      }, { status: 500 });
    }

    // Get email from query params or use default
    const { searchParams } = new URL(request.url);
    const testEmail = searchParams.get('email') || process.env.SMTP_USER || 'test@example.com';

    // Send test email
    const sent = await sendVerificationEmailGmail(testEmail, '123456');

    if (sent) {
      return NextResponse.json({
        success: true,
        message: `Test email sent successfully to ${testEmail}`,
        config: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.SMTP_USER,
          from: process.env.SMTP_FROM_EMAIL,
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to send test email'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({
      success: false,
      message: 'Test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
