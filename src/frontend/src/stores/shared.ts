import { readable } from "svelte/store";
import { loadPublicConfig } from "$lib/config/public";

const config = loadPublicConfig();

export const BACKEND_URL = readable(config.backendUrl);
export const COUCH_URL = readable(config.couchUrl);
