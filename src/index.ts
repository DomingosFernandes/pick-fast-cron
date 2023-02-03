import { getPublicMatchIds, getMatches, getHeroes } from "./lib/services.js";
import { addGameDocuments } from "./lib/mongodb.js";
import { processMatchesForQuestions } from "./lib/utils.js";
import { processMatches } from "./lib/utils.js";

async function main() {
    const [ heroes, publicMatchIds ]  = await Promise.all([getHeroes(), getPublicMatchIds()]); 
    console.log("Fetched hero and public match IDs data ✅");
    
    const publicMatches = await getMatches(publicMatchIds);
    const listOfMatches = processMatches(publicMatches, heroes);
    console.log("Fetched match data for match IDs ✅");

    const questionsList = processMatchesForQuestions(listOfMatches, heroes);
    
    await addGameDocuments(questionsList);
    console.log("Created and saved game data successfully ✅");
}

main().catch(err => console.log("The job ran into an error and will now exit. ", err.message, " ❌"));