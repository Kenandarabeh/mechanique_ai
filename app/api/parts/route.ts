import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all parts or single part by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Get single part by ID
    if (id) {
      // @ts-ignore - CarPart model exists after prisma generate
      const part = await prisma.carPart.findUnique({
        where: { id }
      });
      
      if (!part) {
        return NextResponse.json({ error: 'Part not found' }, { status: 404 });
      }
      
      return NextResponse.json(part);
    }

    // Build query filters
    const where: any = {};
    
    if (category) {
      where.category = category;
    }
    
    if (search) {
      where.OR = [
        { nameAr: { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
        { nameFr: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get all parts with filters
    // @ts-ignore - CarPart model exists after prisma generate
    const parts = await prisma.carPart.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(parts);
  } catch (error) {
    console.error('GET /api/parts error:', error);
    return NextResponse.json({ error: 'Failed to fetch parts' }, { status: 500 });
  }
}

// POST - Create new part
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { nameAr, nameEn, nameFr, category, priceDZD, brand, compatible, inStock, stockCount, description, imageUrl } = body;

    // Validation
    if (!nameAr || !nameEn || !category || priceDZD === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // @ts-ignore - CarPart model exists after prisma generate
    const part = await prisma.carPart.create({
      data: {
        nameAr,
        nameEn,
        nameFr: nameFr || nameEn,
        category,
        priceDZD: parseFloat(priceDZD),
        brand,
        compatible,
        inStock: inStock !== undefined ? inStock : true,
        stockCount: stockCount !== undefined ? parseInt(stockCount) : 0,
        description,
        imageUrl
      }
    });

    return NextResponse.json(part, { status: 201 });
  } catch (error) {
    console.error('POST /api/parts error:', error);
    return NextResponse.json({ error: 'Failed to create part' }, { status: 500 });
  }
}

// PUT - Update part
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Part ID required' }, { status: 400 });
    }

    const body = await request.json();
    
    const updateData: any = {};
    
    if (body.nameAr) updateData.nameAr = body.nameAr;
    if (body.nameEn) updateData.nameEn = body.nameEn;
    if (body.nameFr) updateData.nameFr = body.nameFr;
    if (body.category) updateData.category = body.category;
    if (body.priceDZD !== undefined) updateData.priceDZD = parseFloat(body.priceDZD);
    if (body.brand !== undefined) updateData.brand = body.brand;
    if (body.compatible !== undefined) updateData.compatible = body.compatible;
    if (body.inStock !== undefined) updateData.inStock = body.inStock;
    if (body.stockCount !== undefined) updateData.stockCount = parseInt(body.stockCount);
    if (body.description !== undefined) updateData.description = body.description;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;

    // @ts-ignore - CarPart model exists after prisma generate
    const part = await prisma.carPart.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(part);
  } catch (error) {
    console.error('PUT /api/parts error:', error);
    return NextResponse.json({ error: 'Failed to update part' }, { status: 500 });
  }
}

// DELETE - Delete part
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    console.log('🗑️ DELETE request received for ID:', id);
    
    if (!id) {
      console.error('❌ No ID provided');
      return NextResponse.json({ error: 'Part ID required' }, { status: 400 });
    }

    // Check if part exists first
    // @ts-ignore - CarPart model exists after prisma generate
    const existingPart = await prisma.carPart.findUnique({
      where: { id }
    });

    if (!existingPart) {
      console.error('❌ Part not found:', id);
      return NextResponse.json({ error: 'Part not found' }, { status: 404 });
    }

    console.log('✅ Part found, deleting:', existingPart.nameEn);

    // @ts-ignore - CarPart model exists after prisma generate
    await prisma.carPart.delete({
      where: { id }
    });

    console.log('✅ Part deleted successfully');
    return NextResponse.json({ message: 'Part deleted successfully', id });
  } catch (error) {
    console.error('❌ DELETE /api/parts error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete part',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
