import { MongoClient } from "mongodb";
import constants from "./constants.js";

const client = new MongoClient(constants.mongodb_uri, {});

export async function addGameDocuments(documents: any) {
    try {
        await client.connect();

        const pickFastDb = client.db('pick_fast');
        const gameInfo = await pickFastDb.collection('game_data');

        const result = await gameInfo.insertMany(documents)
        return result;
        
    } catch (err: any) {
        throw new Error(`An error occurred while trying to add game documents ${err.message}`);
    } finally {
        await client.close();
    }
}

//docker run -p 27017:27017 -itd --name pick-fast-db --mount source=pick-fast-data,target=/data/db --rm mongo:5.0