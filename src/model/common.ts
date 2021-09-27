import { Grid, Node } from '../common'

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the pathfinder method above.
export function getNodesInShortestPathOrder(finishNode: Node): Node[] {
    const nodesInShortestPathOrder = [];
    let currentNode: Node | null = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}

export function getAllNodes(grid: Grid): Node[] {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

