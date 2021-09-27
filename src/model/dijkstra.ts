import { Grid, Node } from '../common'
import { getAllNodes, getUnvisitedNeighbors } from './utilities'
// Performs Dijkstra's algorithm returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.

export function dijkstra(grid: Grid, startNode: Node, finishNode: Node): Node[] {
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
      updateUnvisitedNeighborsWithDist(closestNode, grid)
    }
  }
  return visitedNodesInOrder
}

function sortNodesByDistance(unvisitedNodes: Node[]) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance)
}

function updateUnvisitedNeighborsWithDist(node: Node, grid: Grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid)
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1
    neighbor.previousNode = node
  }
}
