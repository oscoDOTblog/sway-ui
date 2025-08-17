import { ImageResponse } from '@vercel/og';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  const slug = searchParams.get('slug');

  if (!title || !slug) {
    return new Response('Missing title or slug', { status: 400 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #ff0080, #ff6b9d)',
          }}
        />
        
        {/* Logo */}
        <div
          style={{
            fontSize: '32px',
            marginBottom: '40px',
            color: '#ff0080',
          }}
        >
          💃
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#ffffff',
            lineHeight: 1.2,
            marginBottom: '20px',
            maxWidth: '1080px',
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '24px',
            color: '#b3b3b3',
            position: 'absolute',
            bottom: '80px',
            left: '60px',
          }}
        >
          Sway Quest - Dance Blog
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
