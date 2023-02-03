export type ProcessedMatch = {
    id: number;
    radiantWin: boolean;
    datePlayed: Date;
    players: Array<ProcessedPlayer>;
}

export type ProcessedPlayer =  {
    heroId: number
    lane: string
    role: string
    isRadiant: boolean
    name: string;
    local: string;
    order: number;
    position: number
}

export type Question = {
    match_id: number;
    datePlayed: Date;
    radiantWin: boolean;
    lastPickRadiant: boolean;
    players: ProcessedPlayer[];
    answer: Answer;
}

export type Answer = {
    position: number,
    lane: string,
    role: string,
    options: Array<{
        heroId: number, 
        wasPicked: boolean, 
        name: string, 
        local: string 
    }>
}
