import { prisma } from "@/lib/prisma";
import { generateOTP, storeOTP, hashPassword } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ 
          error: "User already exists",
          message: "This email is already registered. Please sign in instead.",
          userExists: true
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate OTP
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    console.log('🔐 Generated OTP:', code);
    console.log('📧 Sending to:', email);
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Delete any existing verification code for this email first
    await prisma.verificationCode.deleteMany({
      where: { email }
    });
    
    // Store signup data temporarily (don't create user yet!)
    // @ts-ignore - metadata field exists after migration
    await prisma.verificationCode.create({
      data: {
        email,
        code,
        expiresAt,
        metadata: JSON.stringify({ password: hashedPassword, name })
      }
    });
    
    // Send verification email
    console.log('📨 Attempting to send email...');
    console.log(`📧 Sending verification code to: ${email}`);
    
    const emailSent = await sendVerificationEmail(email, code);

    if (!emailSent) {
      console.error('❌ Failed to send verification email');
      return new Response(
        JSON.stringify({ 
          error: "Failed to send verification email. Please check your email address and try again.",
          details: "Email service error"
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log('✅ Email sent successfully!');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Verification code sent to your email",
        // For development only - remove in production
        ...(process.env.NODE_ENV === 'development' && { code })
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Signup error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to sign up";
    return new Response(
      JSON.stringify({ 
        error: "Failed to sign up",
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
