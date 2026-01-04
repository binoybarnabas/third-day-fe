import { NextResponse } from 'next/server';
import { dummyVendors } from '@/lib/dummyData';

// We need a shared state for vendors if we want updates to persist across requests (in memory for dev).
// This is a hack for demo purposes. In production use a DB.
// Since we can't easily share the 'vendors' variable from the other route file, 
// we'll just operate on a local copy or dummyVendors. 
// Ideally, we'd have a singleton service. 

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const body = await request.json();

  // Find vendor in our "DB"
  const index = dummyVendors.findIndex(v => v.id === id);
  
  if (index !== -1) {
    // Update data
    const updatedVendor = { ...dummyVendors[index], ...body };
    dummyVendors[index] = updatedVendor; // Update the source of truth for this session

    return NextResponse.json({
      status: 200,
      data: {
        id: updatedVendor.id,
        updatedFields: Object.keys(body),
        message: "Vendor updated successfully"
      }
    });
  }

  return NextResponse.json({
    status: 404,
    message: "Vendor not found"
  }, { status: 404 });
}
