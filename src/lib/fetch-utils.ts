import fetch, { RequestInfo, RequestInit } from 'node-fetch';
import constants from './constants.js';

export async function fetchRequest(url: RequestInfo, options: RequestInit = {}): Promise<any> {
    try {
        const apiResponse = await fetch(url, options);
        if (apiResponse.ok) {
            return apiResponse.json();
        }
        throw new Error(`Status code: ${apiResponse.status} - message: ${apiResponse.statusText}`);
    } catch (err: any) {
        throw new Error(`Error during fetch : ${err.message}`);
    }
}   

export async function stratzRequest(fetchQuery: { query: string, variables: Record<string, any>}) {
    try {
        const fetchOptions = {
            method: 'POST',
            body: JSON.stringify(fetchQuery),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${constants.stratz_token}`
            }
        }
        const result: any = await fetchRequest(constants.stratz_endpoint, fetchOptions);
        return result.data;
    }
    catch (err: any) {
        throw new Error(err);
    }
}
