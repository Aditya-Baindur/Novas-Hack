/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    'lucide-react',
    '@radix-ui/react-slot',
    '@radix-ui/react-dialog',
    '@radix-ui/react-slider',
    '@radix-ui/react-tabs',
  ]
};

module.exports = nextConfig;
