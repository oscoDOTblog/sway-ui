import { NextResponse } from 'next/server';

// Server-side admin configuration
const adminPassword = process.env.ADMIN_PASSWORD || 'sway-sway-sway-124589-myia-myia-mya';

export async function POST(request) {
  try {
    const { password } = await request.json();
    
    // TEMPORARY: Debug on server side
    console.log('🔧 SERVER DEBUG: ADMIN_PASSWORD env var exists:', !!process.env.ADMIN_PASSWORD);
    console.log('🔧 SERVER DEBUG: Using password:', adminPassword);
    console.log('🔧 SERVER DEBUG: Received password:', password);
    console.log('🔧 SERVER DEBUG: Password match:', password === adminPassword);

    if (password === adminPassword) {
      return NextResponse.json({
        success: true,
        message: 'Authentication successful'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid password'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({
      success: false,
      error: 'Authentication error'
    }, { status: 500 });
  }
}
