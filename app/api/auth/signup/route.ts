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
        JSON.stringify({ error: "User already exists" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate OTP
    const code = generateOTP();
    
    // Store OTP
    await storeOTP(email, code);

    // Hash password and create unverified user
    const hashedPassword = await hashPassword(password);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
        verified: false,
      },
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(email, code);

    if (!emailSent) {
      console.error('Failed to send verification email');
    }

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
