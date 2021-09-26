export type Grid = NodeInfo[][]

export type NodeInfo = {
    col: number
    row: number
    isStart: boolean
    isFinish: boolean
    distance: number
    isVisited: boolean
    isWall: boolean
    previousNode: NodeInfo | null;
}