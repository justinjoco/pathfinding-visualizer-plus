export type Grid = Node[][]

export type Node = {
    col: number
    row: number
    distance: number
    isVisited: boolean
    isWall: boolean
    previousNode: Node | null
}