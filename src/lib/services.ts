import { fetchRequest, stratzRequest } from './fetch-utils.js';
import { getMatchesQuery } from './queries.js';
import constants from './constants.js';
import { HeroInfo, HeroResponse } from '../models/Hero.js';
import { MatchDetails, MatchReport } from '../models/Match.js';

export async function getPublicMatchIds() {
    try {
        const matchesList: Array<MatchReport> = await fetchRequest(`${constants.opendota_endpoint}/publicMatches?mmr_descending=1`);
        const filteredMatches = matchesList
            .filter(match => { 
                if (Number.isInteger(match.avg_rank_tier) && match.avg_rank_tier < 80) return false;
                if (Number.isNaN(match.avg_mmr) || match.avg_mmr < 5000) return false;
                return true;
            })
            .map((match) => match.match_id)
            .slice(0, 30);
        return filteredMatches;
    } catch (err: any) {
        throw new Error(`Failed to get public match IDs - ${err.message}`);
    }
}

export async function getMatches(ids: Array<number> = []) {
    try {
        //Creating an array of arrays containing 5 IDs before making calls to Stratz endpoint
        const responses = [];
        for (let i = 0; i < ids.length; i += 5) {
            const query = getMatchesQuery(ids.slice(i, i + 5));
            const result = await stratzRequest(query);
            responses.push(result);
        }

        const matches = responses.reduce((a, c) => {
            if (c && c.matches) return a.concat(c.matches);
            return a;
        }, [] as Array<MatchDetails> );

        return matches;
    }
    catch (err: any) {
        throw new Error(err);
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



