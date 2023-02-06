import { sampleSize, shuffle } from "lodash-es";
import { ProcessedMatch, ProcessedPlayer, Question } from "../models/Game.js";
import { HeroInfo } from "../models/Hero.js";
import { MatchDetails } from "../models/Match.js";

function processPlayersInMatch(match: MatchDetails, heroes: HeroInfo[]) {
    const { players, pickBans } = match;
    if (!(players && players.length && pickBans && pickBans.length)) return null;

    //Type guard to ensure that order is defined at this point, because order has type number/undefined
    const pickedHeroes = pickBans.filter((hero): hero is { heroId: number; order: number; isPick: boolean } => hero.isPick);

    const processedPlayers: Array<ProcessedPlayer> = []
    for (let player of players) {
        if (typeof player.position !== 'string' || player.position.length === 0) break;

        //get the index of the hero to determine at which point it was picked
        //i.e 1st pick or 2nd pick or 3rd pick.....
        const index = pickedHeroes.findIndex(pickedHero => pickedHero.heroId === player.heroId);
        if (index === -1) break;

        //get the heroInfo so that we can add the hero name and local in the questions array directly
        const heroInfo = heroes.find(hero => hero.id === player.heroId)
        if (!heroInfo) break;

        const position = +player.position.slice(-1);

        processedPlayers.push({
            ...player,
            name: heroInfo.name,
            local: heroInfo.codename,
            order: pickedHeroes[index].order,
            position: position,
        });
    }
    //Check in case the value for order is infact null - need to update this in the future
    if (processedPlayers.some(player => !Number.isInteger(player.order) || processedPlayers.length !== 10)) return null;

    return processedPlayers.sort((a, b) => a.order - b.order);
}

export function processMatches(matches: MatchDetails[], heroes: HeroInfo[]) {
    const summaryOfMatches = matches.reduce((matchAcc, match) => {
        const processedPlayers = processPlayersInMatch(match, heroes);

        //If we get null, it means players returned in response for the match had null/empty values so 
        //we can skip processing this match
        if (!processedPlayers) return matchAcc;

        //Else we have a proper list of 10 players and the match info can be passed over
        matchAcc.push({
            id: match.id,
            radiantWin: match.didRadiantWin,
            datePlayed: new Date(match.startDateTime * 1000),
            players: processedPlayers
        });
        return matchAcc;
    }, [] as Array<ProcessedMatch>);

    if (summaryOfMatches.length === 0) throw new Error(`There are no match summaries processed.`)

    return summaryOfMatches;
}

export function processMatchesForQuestions(listOfMatches: ProcessedMatch[], heroes: HeroInfo[]): Array<Question> {
    return listOfMatches.reduce((listAcc, matchPlayed) => {
        const players = matchPlayed.players;
        if (!Array.isArray(players) || players.length !== 10) return listAcc;

        const lastPickIndex = players.length - 1;
        const otherPicks = players.slice(0, lastPickIndex);
        const lastPick = players[lastPickIndex];

        //This means the last pick had a low contribution to their team's win
        if (lastPick.imp < 0) return listAcc;

        //This means the last team to pick did not win the game 
        if (lastPick.isRadiant !== matchPlayed.radiantWin) return listAcc;

        //Add the last hero that was actually picked
        const options = [{ heroId: lastPick.heroId, wasPicked: true, name: lastPick.name, local: lastPick.local }];

        //##Add 3 other heroes that are similar to the hero picked

        //To find similar heroes based on roles, we need to get the HeroInfo object
        //based on the heroId
        const heroInfo = heroes.find(hero => hero.id === lastPick.heroId);
        if (!heroInfo) return listAcc;

        //Then we can sample 3 random roles on the picked hero
        const randomHeroRoles = sampleSize(heroInfo.roles, 3);

        //Then filter out all the heroes that have these specific roles
        const similarHeroes = heroes.filter(hero => randomHeroRoles.every(role => hero.roles.includes(role)) && hero.id !== lastPick.heroId);

        //Then randomly select and 3 heroes
        const randomHeroes = sampleSize(similarHeroes, 3);

        for (let rando of randomHeroes) {
            options.push({ heroId: rando.id, wasPicked: false, name: rando.name, local: rando.codename });
        }

        if (options.length < 4) return listAcc;

        listAcc.push({
            match_id: matchPlayed.id,
            datePlayed: matchPlayed.datePlayed,
            radiantWin: matchPlayed.radiantWin,
            lastPickRadiant: lastPick.isRadiant,
            players: otherPicks,
            answer: {
                position: lastPick.position,
                lane: lastPick.lane,
                role: lastPick.role,
                options: shuffle(options),
            }
        })
        return listAcc;
    }, [] as Array<Question>);
}