import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET: Fetch user's oil change records
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Fetch all oil changes for this user, sorted by date (newest first)
    const oilChanges = await prisma.oilChange.findMany({
      where: { userId: decoded.userId },
      orderBy: { changeDate: 'desc' }
    });

    return NextResponse.json(oilChanges);
  } catch (error) {
    console.error('Get oil changes error:', error);
    return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
  }
}

// POST: Create new oil change record
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { carModel, purchaseDate, changeDate, kilometersDone, notes } = body;

    // Validation
    if (!changeDate || !kilometersDone) {
      return NextResponse.json({ 
        error: 'Missing required fields: changeDate, kilometersDone' 
      }, { status: 400 });
    }

    // Create oil change record
    const oilChange = await prisma.oilChange.create({
      data: {
        userId: decoded.userId,
        carModel,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        changeDate: new Date(changeDate),
        kilometersDone: parseInt(kilometersDone),
        notes
      }
    });

    return NextResponse.json(oilChange, { status: 201 });
  } catch (error) {
    console.error('Create oil change error:', error);
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 });
  }
}

// PUT: Update oil change record
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { id, carModel, purchaseDate, changeDate, kilometersDone, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing record ID' }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.oilChange.findUnique({
      where: { id }
    });

    if (!existing || existing.userId !== decoded.userId) {
      return NextResponse.json({ error: 'Record not found or unauthorized' }, { status: 404 });
    }

    // Update record
    const updated = await prisma.oilChange.update({
      where: { id },
      data: {
        carModel,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        changeDate: changeDate ? new Date(changeDate) : undefined,
        kilometersDone: kilometersDone ? parseInt(kilometersDone) : undefined,
        notes
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update oil change error:', error);
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
  }
}

// DELETE: Delete oil change record
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing record ID' }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.oilChange.findUnique({
      where: { id }
    });

    if (!existing || existing.userId !== decoded.userId) {
      return NextResponse.json({ error: 'Record not found or unauthorized' }, { status: 404 });
    }

    // Delete record
    await prisma.oilChange.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Delete oil change error:', error);
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
  }
}
