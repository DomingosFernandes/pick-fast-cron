export type MatchReport = {
    match_id: number
    match_seq_num: number
    radiant_win: boolean
    start_time: number
    duration: number
    avg_mmr: number 
    num_mmr: number
    lobby_type: number
    game_mode: number
    avg_rank_tier: number
    num_rank_tier: number
    cluster: number
    radiant_team: string
    dire_team: string
}

export type MatchDetails = {
    id: number
    startDateTime: number
    didRadiantWin: boolean
    players: Player[]
    pickBans: PickBan[]
  }
  
  export interface Player {
    heroId: number
    lane: string
    role: string
    position: string
    isRadiant: boolean
    imp: number
  }
  
  export interface PickBan {
    heroId?: number
    order?: number
    isPick: boolean
  }