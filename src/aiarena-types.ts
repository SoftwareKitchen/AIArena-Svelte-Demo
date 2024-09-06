export interface MatchIdentifier{
    tournament: string | null
    match: string
}

export interface ConnectFourState{
    slot: number
    activePlayer: number | null
    board: number[][]
}