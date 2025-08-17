// Server-side admin password
const adminPassword = process.env.ADMIN_PASSWORD || 'sway-sway-sway-124589-myia-myia-mya';

// Validate admin password from request headers
export function validateAdminAuth(request) {
  try {
    const adminPasswordHeader = request.headers.get('x-admin-password');
    
    if (!adminPasswordHeader) {
      return {
        isValid: false,
        error: 'Missing admin password header'
      };
    }

    // Accept either the actual password or the authenticated token
    if (adminPasswordHeader !== adminPassword && adminPasswordHeader !== 'admin-authenticated') {
      return {
        isValid: false,
        error: 'Invalid admin password'
      };
    }

    return {
      isValid: true,
      error: null
    };
  } catch {
    return {
      isValid: false,
      error: 'Authentication error'
    };
  }
}

// Create unauthorized response
export function createUnauthorizedResponse(message = 'Unauthorized') {
  return new Response(
    JSON.stringify({
      success: false,
      error: message
    }),
    {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
