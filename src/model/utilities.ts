import { Grid, Node } from '../common'

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the pathfinder method above.
export function getNodesInShortestPathOrder(finishNode: Node): Node[] {
  const nodesInShortestPathOrder = []
  let currentNode: Node | null = finishNode
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode)
    currentNode = currentNode.previousNode
  }
  return nodesInShortestPathOrder
}

export function getAllNodes(grid: Grid): Node[] {
  const nodes = []
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node)
    }
  }
  return nodes
}


export function getUnvisitedNeighbors(node: Node, grid: Grid): Node[] {
  const neighbors = []
  const { col, row } = node
  if (row > 0)
    neighbors.push(grid[row - 1][col])
  if (row < grid.length - 1)
    neighbors.push(grid[row + 1][col])
  if (col > 0)
    neighbors.push(grid[row][col - 1])
  if (col < grid[0].length - 1)
    neighbors.push(grid[row][col + 1])

  return neighbors.filter(neighbor => !neighbor.isVisited)
}

export function getAllNeighbors(node: Node, grid: Grid): Node[] {
  const neighbors = []
  const { col, row } = node
  if (row > 0)
    neighbors.push(grid[row - 1][col])
  if (row < grid.length - 1)
    neighbors.push(grid[row + 1][col])
  if (col > 0)
    neighbors.push(grid[row][col - 1])
  if (col < grid[0].length - 1)
    neighbors.push(grid[row][col + 1])

  return neighbors
}

export function updateUnvisitedNeighborsNoDist(node: Node, grid: Grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid)
  for (const neighbor of unvisitedNeighbors) {
    neighbor.previousNode = node
  }
}
