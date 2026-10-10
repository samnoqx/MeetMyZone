import { defineCloudflareConfig } from '@opennextjs/cloudflare';

const config = defineCloudflareConfig({});
// Build Next.js directly so the default Cloudflare build does not recurse.
config.buildCommand = 'npm run build:next';

export default config;
