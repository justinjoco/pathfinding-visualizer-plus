import { Grid, Node } from '../common'
import { getAllNodes, updateUnvisitedNeighbors, sortNodesByDistance } from './utilities'

export function aStar(grid: Grid, startNode: Node, finishNode: Node): Node[] {
    const visitedNodesInOrder = []
    startNode.distance = 0
    const unvisitedNodes = getAllNodes(grid)
    while (!!unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes)
        const closestNode = unvisitedNodes.shift()
        // If we encounter a wall, we skip it.
        if (closestNode !== undefined) {
            if (closestNode.isWall)
                continue
            // If the closest node is at a distance of infinity,
            // we must be trapped and should therefore stop.
            if (closestNode.distance === Infinity)
                return visitedNodesInOrder

            closestNode.isVisited = true
            visitedNodesInOrder.push(closestNode)
            if (closestNode === finishNode)
                return visitedNodesInOrder
            updateUnvisitedNeighbors(closestNode, grid, true, manhattanDistance(closestNode, finishNode))
        }
    }
    return visitedNodesInOrder
}

function manhattanDistance(start: Node, end: Node) {
    return Math.abs(end.col - start.col) + Math.abs(end.row - start.row)
}