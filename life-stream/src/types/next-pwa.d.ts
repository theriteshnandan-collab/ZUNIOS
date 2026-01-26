declare module 'next-pwa' {
    import { NextConfig } from 'next';

    function withPWA(config: {
        dest: string;
        disable?: boolean;
        register?: boolean;
        skipWaiting?: boolean;
        runtimeCaching?: any[];
        buildExcludes?: any[];
        publicExcludes?: string[];
        scope?: string;
        sw?: string;
        cacheOnFrontEndNav?: boolean;
        reloadOnOnline?: boolean;
        customWorkerDir?: string;
        fallbacks?: {
            [key: string]: string;
        };
    }): (nextConfig: NextConfig) => NextConfig;

    export default withPWA;
}
