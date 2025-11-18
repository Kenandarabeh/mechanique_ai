import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  try {
    console.log('📧 إرسال رمز التحقق إلى:', email);
    console.log('🔐 الرمز:', code);

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'MechaMind <onboarding@resend.dev>',
      to: email,
      subject: 'رمز التحقق - MechaMind',
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                                      <div style="text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #1e293b 0%, #334155 100%);">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🔧 MechaMind</h1>
                      <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">مساعدك الذكي للميكانيك</p>
                  </div>
                  </tr>
                  
                  <!-- Body -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; text-align: center;">مرحبًا بك! 👋</h2>
                      <p style="color: #475569; margin: 0 0 20px 0; font-size: 16px; line-height: 1.5;">
                        شكرًا لتسجيلك في MechaMind. استخدم الرمز التالي لتأكيد حسابك:
                      </p>
                      
                      <!-- OTP Code -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 30px; border-radius: 12px; border: 2px solid #black; display: inline-block;">
                              <p style="color: black; font-size: 14px; margin: 0 0 10px 0; text-align: center;">رمز التحقق</p>
                              <h1 style="color: black; font-size: 42px; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">${code}</h1>
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                        ⏰ هذا الرمز صالح لمدة <strong>10 دقائق</strong> فقط
                      </p>
                      
                      <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 20px 0 0 0; text-align: center;">
                        إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                                        <div style="text-align: center; padding: 20px; background-color: #f1f5f9; border-top: 1px solid #e2e8f0;">
                      <p style="color: #64748b; margin: 0; font-size: 14px;">
                        © 2025 MechaMind. جميع الحقوق محفوظة.
                      </p>
                  </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ خطأ في إرسال البريد:', error);
      return false;
    }

    console.log('✅ تم إرسال البريد بنجاح!');
    console.log('📨 Email ID:', data?.id);
    return true;

  } catch (error) {
    console.error('❌ فشل إرسال البريد الإلكتروني:', error);
    return false;
  }
}
