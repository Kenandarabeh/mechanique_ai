import { prisma } from "@/lib/prisma";
import { verifyPassword, generateToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return new Response(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if verified
    if (!user.verified) {
      return new Response(
        JSON.stringify({ error: "Please verify your email first" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

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
    console.error("Sign in error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to sign in" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
