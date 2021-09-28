import { Grid, Node } from '../common'
import { getAllNeighbors, updateUnvisitedNeighbors } from './utilities'

export function bfs(grid: Grid, startNode: Node, finishNode: Node): Node[] {
    const visitedNodesInOrder = []

    const queue = []
    startNode.isVisited = true
    queue.push(startNode)
    visitedNodesInOrder.push(startNode)
    updateUnvisitedNeighbors(startNode, grid)

    while (queue) {
        const v = queue.shift()
        // If we encounter a wall, we skip it.
        if (v !== undefined) {

            if (v === finishNode)
                return visitedNodesInOrder

            for (const neighbor of getAllNeighbors(v, grid)) {
                if (neighbor.isWall)
                    continue

                if (!neighbor.isVisited) {
                    neighbor.isVisited = true
                    visitedNodesInOrder.push(neighbor)
                    queue.push(neighbor)
                    updateUnvisitedNeighbors(neighbor, grid)
                }
            }
        }
    }
    return visitedNodesInOrder
}