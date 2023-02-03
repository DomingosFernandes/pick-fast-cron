import { fetchRequest, stratzRequest } from './fetch-utils.js';
import { getMatchesQuery } from './queries.js';
import Bottleneck from 'bottleneck';
import constants from './constants.js';
import { HeroInfo, HeroResponse } from '../models/Hero.js';
import { MatchDetails, MatchReport } from '../models/Match.js';

export async function getPublicMatchIds() {
    try {
        const matchesList: Array<MatchReport> = await fetchRequest(`${constants.opendota_endpoint}/publicMatches?mmr_descending=1`);
        const filteredMatches = matchesList
            .map(match => ({ match_id: match.match_id, avg_mmr: match.avg_mmr }))
            .filter(match => match.avg_mmr)
            .sort((a, b) => b.avg_mmr - a.avg_mmr)
            .map((match) => match.match_id)
            .slice(0, 30);
        return filteredMatches;
    } catch (err: any) {
        throw new Error(`Failed to get public match IDs - ${err.message}`);
    }
}

export async function getMatches(ids: Array<number> = []) {
    try {
        const limiter = new Bottleneck({ minTime: 1000, maxConcurrent: 1 });
        const requestHelper = limiter.wrap(stratzRequest);

        //Creating an array of arrays containing 5 IDs 
        //before making calls to Stratz endpoint
        const allMatches: any[] = [];
        for (let i = 0; i < ids.length; i += 5) {
            const query = getMatchesQuery(ids.slice(i, i + 5));
            allMatches.push(requestHelper(query))
        }

        const responses: Array<{matches: Array<MatchDetails>}>= await Promise.all(allMatches);

        const matches = responses.reduce((a, c) => {
            if (c && c.matches) return a.concat(c.matches);
            return a;
        }, [] as Array<MatchDetails> );

        //TODO: Confirm if matches can ever have length 0
        return matches;
    }
    catch (err: any) {
        throw new Error(`Failed to get match details ${err.message}`)
    }
}

export async function getHeroes(): Promise<Array<HeroInfo>> {
    try {
        const heroes: Array<HeroResponse> = await fetchRequest(`${constants.opendota_endpoint}/heroes`) as Array<HeroResponse>;
    
        return heroes.map(hero => ({
            id: hero.id,
            codename: hero.name.slice(14),
            name: hero.localized_name,
            attribute: hero.primary_attr,
            roles: hero.roles,
            attacktype: hero.attack_type
        }));
    }
    catch (err: any) {
        throw new Error(`Failed to get heroes data - ${err.message}`);
    }
}



