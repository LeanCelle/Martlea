/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          /*{
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: blob: https:;
              font-src 'self' https:;
              connect-src *;
              object-src 'none';
              frame-ancestors 'none';
            `.replace(/\n/g, '')
          },*/
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer-when-downgrade'
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()'
          },
        ]
      }
    ];
  }
};

export default nextConfig;
