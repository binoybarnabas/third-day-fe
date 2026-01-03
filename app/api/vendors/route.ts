import { NextResponse } from 'next/server';
import { dummyVendors } from '@/lib/dummyData';

// Simulate a database since we can't persist to file easily in a serverless-like env
// In a real app, this would be a database call.
// Note: In Next.js dev mode, this "in-memory" array might reset on recompile.
let vendors = [...dummyVendors];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '7');
  const search = searchParams.get('search') || '';

  let filteredVendors = vendors;

  if (search) {
    const query = search.toLowerCase();
    filteredVendors = vendors.filter(v => 
      v.businessName.toLowerCase().includes(query) || 
      v.ownerName.toLowerCase().includes(query) || 
      v.email.toLowerCase().includes(query)
    );
  }

  const totalItems = filteredVendors.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedVendors = filteredVendors.slice(start, end);

  return NextResponse.json({
    vendors: paginatedVendors,
    meta: {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page
    }
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  
  const newVendor = {
    id: Math.floor(Math.random() * 10000) + 100,
    ...body,
    productCount: 0,
    totalSales: 0,
    commission: 10,
    createdAt: new Date().toISOString()
  };
  
  // In a real app we'd save this to DB
  vendors.unshift(newVendor);

  return NextResponse.json({
    status: 201,
    data: {
      id: newVendor.id,
      businessName: newVendor.businessName,
      message: "Vendor created successfully"
    }
  }, { status: 201 });
}
