import React, { Component } from 'react'
import DisplayNode from './DisplayNode/DisplayNode'
import { Button } from 'reactstrap'
import { dijkstra } from '../model/dijkstra'
import { getNodesInShortestPathOrder } from '../model/common'
import { Grid, Node } from '../common'
import './PathfindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

type Props = {}

type State = {
  grid: Grid
  mouseIsPressed: boolean
  pathfinder: Pathfinder
}

type Pathfinder = (grid: Grid, startNode: Node, finishNode: Node) => Node[]

export default class PathfindingVisualizer extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false,
      pathfinder: dijkstra
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row: number, col: number) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row: number, col: number) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animatePathfinder(visitedNodesInOrder: Node[], nodesInShortestPathOrder: Node[]) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        let displayNode = document.getElementById(`node-${node.row}-${node.col}`)

        if (displayNode !== null)
          displayNode.className =
            'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder: Node[]) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        let displayNode = document.getElementById(`node-${node.row}-${node.col}`)

        if (displayNode !== null) displayNode.className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizePathfinder(pathfinder: (grid: Grid, startNode: Node, finishNode: Node) => Node[]) {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = pathfinder(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animatePathfinder(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {
    const { grid, pathfinder } = this.state;

    return (
      <div>
        <Button color="primary" onClick={() => this.visualizePathfinder(pathfinder)}>
          Visualize
        </Button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <DisplayNode
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      onMouseDown={(row: number, col: number) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row: number, col: number) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row} />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const getInitialGrid = (): Grid => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col: number, row: number): Node => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid: Grid, row: number, col: number): Grid => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
