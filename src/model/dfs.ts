import { Grid, Node } from '../common'
import { getAllNeighbors, updateUnvisitedNeighborsNoDist } from './utilities'

export function dfs(grid: Grid, startNode: Node, finishNode: Node): Node[] {
    const visitedNodesInOrder = []

    const stack = []
    stack.push(startNode)
    while (!!stack.length) {
        const v = stack.pop()
        // If we encounter a wall, we skip it.
        if (v !== undefined) {
            if (v.isWall)
                continue

            if (v === finishNode)
                return visitedNodesInOrder

            if (!v.isVisited) {
                v.isVisited = true
                visitedNodesInOrder.push(v)

                for (const neighbor of getAllNeighbors(v, grid)) {
                    stack.push(neighbor)
                }
                updateUnvisitedNeighborsNoDist(v, grid)
            }
        }
    }
    return visitedNodesInOrder

}