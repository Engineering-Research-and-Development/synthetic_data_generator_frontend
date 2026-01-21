import { env } from '$env/dynamic/public';

export interface PublicConfig {
    backendUrl: string;
    couchUrl: string;
}

export function loadPublicConfig(): PublicConfig {
    if (!env.PUBLIC_BACKENDURL) {
        throw new Error('Missing PUBLIC_BACKENDURL');
    }
    if (!env.PUBLIC_COUCHURL) {
        throw new Error('Missing PUBLIC_COUCHURL');
    }
    return {
        backendUrl: env.PUBLIC_BACKENDURL,
        couchUrl: env.PUBLIC_COUCHURL
    }
}
