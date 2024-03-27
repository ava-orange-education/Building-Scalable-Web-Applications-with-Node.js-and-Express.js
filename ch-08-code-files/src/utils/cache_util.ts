// Cache utility

import * as redis from 'redis';

export class CacheUtil {

    // redis client instance
    private static client = redis.createClient();

    constructor() {
        CacheUtil.client.connect();
    }

    /**
     * Function to get a value from the cache 
     * @param cacheName 
     * @param key 
     * @returns 
     */
    public static async get(cacheName: string, key: string) {
        try {
            const data = await CacheUtil.client.json.get(`${cacheName}:${key}`);
            return data;
        } catch (err) {
            console.error(`Error getting cache: ${err}`);
            return null;
        }
    }

    /**
     * Function to set a value in the cache
     * @param cacheName 
     * @param key 
     * @param value 
     */
    public static async set(cacheName: string, key: string, value) {
        try {
            await CacheUtil.client.json.set(`${cacheName}:${key}`, '.', value);
        } catch (err) {
            console.error(`Error setting cache: ${err}`);
        }
    }

    /**
     * Function to delete a value from the cache
     * @param cacheName 
     * @param key 
     */
    public static async remove(cacheName: string, key: string) {
        try {
            await CacheUtil.client.del(`${cacheName}:${key}`);
        } catch (err) {
            console.error(`Error deleting cache: ${err}`);
        }
    }
}


