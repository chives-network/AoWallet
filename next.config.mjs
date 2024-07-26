/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    trailingSlash: true,
    reactStrictMode: false,
    webpack: config => {
        config.resolve.alias = {
          ...config.resolve.alias,
          apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
        }
    
        return config
    }
};

export default nextConfig;

