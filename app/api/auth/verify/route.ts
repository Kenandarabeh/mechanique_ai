import { prisma } from "@/lib/prisma";
import { verifyOTP, generateToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    console.log('🔍 Verification attempt for:', email);

    // Validate input
    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: "Email and code are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verify OTP
    const isValid = await verifyOTP(email, code);

    if (!isValid) {
      console.log('❌ Invalid OTP code');
      return new Response(
        JSON.stringify({ error: "Invalid or expired code" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log('✅ OTP verified successfully');

    // Get verification code record with metadata
    // @ts-ignore - metadata field exists after prisma generate
    const verificationRecord = await prisma.verificationCode.findUnique({
      where: { email }
    });

    if (!verificationRecord || !verificationRecord.metadata) {
      console.log('❌ No verification record found');
      return new Response(
        JSON.stringify({ error: "Verification data not found" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse stored user data
    // @ts-ignore - metadata field exists
    const userData = JSON.parse(verificationRecord.metadata);
    console.log('📋 Creating user account...');

    // NOW create the user (only after OTP is verified)
    const user = await prisma.user.create({
      data: {
        email,
        password: userData.password,
        name: userData.name,
        verified: true, // Already verified via OTP
      }
    });

    console.log('✅ User created:', user.email);

    // Delete verification code after use
    // @ts-ignore - email is unique now
    await prisma.verificationCode.delete({
      where: { email }
    });

    // Generate JWT token
    const token = generateToken(user.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          "Set-Cookie": `auth-token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`
        } 
      }
    );
  } catch (error) {
    console.error("❌ Verification error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to verify code";
    return new Response(
      JSON.stringify({ 
        error: "Failed to verify code",
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
