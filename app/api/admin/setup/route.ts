import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

// Create the first admin user
// This endpoint should be called only once to create the super admin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, secretKey } = body;

    // Secret key protection (change this to your own secret)
    const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'mechamind-super-admin-2025';
    
    if (secretKey !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { isAdmin: true }
    });

    if (existingAdmin) {
      return NextResponse.json({ 
        error: 'Admin already exists',
        email: existingAdmin.email 
      }, { status: 400 });
    }

    // Check if email is already taken
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      // If user exists but is not admin, upgrade them to admin
      const admin = await prisma.user.update({
        where: { email },
        data: { 
          isAdmin: true,
          verified: true,
          password: await hashPassword(password), // Update password too
          name: 'Super Admin'
        }
      });

      return NextResponse.json({ 
        message: 'Existing user upgraded to admin successfully',
        email: admin.email
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new admin user
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Super Admin',
        verified: true,
        isAdmin: true
      }
    });

    return NextResponse.json({ 
      message: 'Admin created successfully',
      email: admin.email
    });
  } catch (error) {
    console.error('Create admin error:', error);
    return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 });
  }
}

// Make user admin (only for existing admin)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminEmail, targetEmail, makeAdmin } = body;

    // Verify the requester is admin
    const requester = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!requester || !requester.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update target user
    const updatedUser = await prisma.user.update({
      where: { email: targetEmail },
      data: { isAdmin: makeAdmin }
    });

    return NextResponse.json({ 
      message: `User ${makeAdmin ? 'promoted to' : 'removed from'} admin`,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    });
  } catch (error) {
    console.error('Update admin error:', error);
    return NextResponse.json({ error: 'Failed to update admin status' }, { status: 500 });
  }
}
