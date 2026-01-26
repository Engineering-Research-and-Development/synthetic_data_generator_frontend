export class StorageService {
    static getJson<T>(key: string, defaultValue: T): T {
        try {
            const data = sessionStorage.getItem(key);
            return data ? (JSON.parse(data) as T) : defaultValue;
        } catch (e) {
            console.error(`Error parsing ${key}`, e);
            return defaultValue;
        }
    }
}