import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    console.log('🗑️ Cancelling OTP for:', email);

    // Delete OTP
    // @ts-ignore - email is unique
    const deleted = await prisma.verificationCode.deleteMany({
      where: { email }
    });

    console.log('✅ Deleted', deleted.count, 'OTP records');

    return NextResponse.json({ 
      success: true,
      message: 'OTP cancelled successfully',
      deleted: deleted.count
    });

  } catch (error) {
    console.error('❌ Cancel OTP error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to cancel OTP' 
    }, { status: 500 });
  }
}
