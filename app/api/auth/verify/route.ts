import { prisma } from "@/lib/prisma";
import { verifyOTP, generateToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

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
      return new Response(
        JSON.stringify({ error: "Invalid or expired code" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Mark user as verified
    const user = await prisma.user.update({
      where: { email },
      data: { verified: true },
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
    console.error("Verification error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to verify code" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
