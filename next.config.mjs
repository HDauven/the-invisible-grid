/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: isGithubPages,
  images: {
    unoptimized: true
  },
  ...(isGithubPages
    ? {
        output: "export",
        basePath: "/the-invisible-grid",
        assetPrefix: "/the-invisible-grid/"
      }
    : {})
};

export default nextConfig;
