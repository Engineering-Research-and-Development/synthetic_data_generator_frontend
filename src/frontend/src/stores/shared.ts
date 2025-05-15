import { writable } from "svelte/store";

export const BACKEND_URL = writable<string>("http://127.0.0.1:8001");
export const COUCH_URL = writable<string>("http://127.0.0.1:5984");