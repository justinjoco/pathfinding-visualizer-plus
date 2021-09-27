export type Grid = Node[][]

export type Node = {
    col: number
    row: number
    isStart: boolean
    isFinish: boolean
    distance: number
    isVisited: boolean
    isWall: boolean
    previousNode: Node | null
}