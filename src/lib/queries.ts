export const getMatchesQuery = (ids: Array<number> = []) => ({
    query: `
        query GetMatchesQuery($matchIds: [Long]!) {
            matches(ids: $matchIds) {
                id,
                startDateTime,
                didRadiantWin,
                players {
                    heroId, 
                    lane,
                    role,
                    position,
                    isRadiant
                },
                pickBans {
                    heroId, 
                    order,
                    isPick,
                }
            }
        }
    `,
    variables: {
        matchIds: ids
    }
});