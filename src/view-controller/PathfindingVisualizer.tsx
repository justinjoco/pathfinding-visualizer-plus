import React, { Component, MouseEvent } from 'react'
import DisplayNode from './DisplayNode/DisplayNode'
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { dijkstra } from '../model/dijkstra'
import { bfs } from '../model/bfs'
import { dfs } from '../model/dfs'
import { aStar } from '../model/a_star'

import { getNodesInShortestPathOrder } from '../model/utilities'
import { Grid, Node } from '../common'
import './PathfindingVisualizer.css'

const START_NODE_ROW = 10
const START_NODE_COL = 15
const FINISH_NODE_ROW = 10
const FINISH_NODE_COL = 35

type Props = {}

type State = {
  grid: Grid
  mouseIsPressed: boolean
  dropdownOpen: boolean
  pathfinderName: Algorithms
  pathfinder: Pathfinder
}

type Pathfinder = (grid: Grid, startNode: Node, finishNode: Node) => Node[]

enum Algorithms {
  Dijkstra = "Dijkstra",
  DFS = "Depth First Search",
  BFS = "Breadth First Search",
  A_Star = "A*"
}
export default class PathfindingVisualizer extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      grid: [],
      mouseIsPressed: false,
      dropdownOpen: false,
      pathfinderName: Algorithms.Dijkstra,
      pathfinder: dijkstra
    }
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.onDropdownItemClick = this.onDropdownItemClick.bind(this)
  }

  componentDidMount() {
    const grid = getInitialGrid()
    this.setState({ grid })
  }

  handleMouseDown(row: number, col: number) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col)
    this.setState({ grid: newGrid, mouseIsPressed: true })
  }

  handleMouseEnter(row: number, col: number) {
    if (!this.state.mouseIsPressed) return
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col)
    this.setState({ grid: newGrid })
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false })
  }


  animatePathfinder(visitedNodesInOrder: Node[], nodesInShortestPathOrder: Node[]) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder)
        }, 10 * i)
        return
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i]
        let displayNode = document.getElementById(`node-${node.row}-${node.col}`)

        if (displayNode !== null)
          displayNode.className =
            'node node-visited'
      }, 10 * i)
    }
  }

  animateShortestPath(nodesInShortestPathOrder: Node[]) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i]
        let displayNode = document.getElementById(`node-${node.row}-${node.col}`)

        if (displayNode !== null) displayNode.className =
          'node node-shortest-path'
      }, 50 * i)
    }
  }

  visualizePathfinder(pathfinder: Pathfinder) {
    const { grid } = this.state
    const startNode = grid[START_NODE_ROW][START_NODE_COL]
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL]
    const visitedNodesInOrder = pathfinder(grid, startNode, finishNode)
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode)
    this.animatePathfinder(visitedNodesInOrder, nodesInShortestPathOrder)
  }

  toggle = () => this.setState((prevState) => ({ dropdownOpen: !prevState.dropdownOpen }))

  onDropdownItemClick(sender: MouseEvent<HTMLButtonElement>) {
    if (sender !== null) {
      let dropDownValue = sender.currentTarget.getAttribute("dropdownvalue")
      let pathFinderFunc = dijkstra
      let pathfinderName = Algorithms.Dijkstra
      switch (dropDownValue) {
        case Algorithms.Dijkstra:
          pathFinderFunc = dijkstra
          pathfinderName = Algorithms.Dijkstra
          break
        case Algorithms.DFS:
          pathFinderFunc = dfs
          pathfinderName = Algorithms.DFS
          break
        case Algorithms.BFS:
          pathFinderFunc = bfs
          pathfinderName = Algorithms.BFS
          break
        case Algorithms.A_Star:
          pathFinderFunc = aStar
          pathfinderName = Algorithms.A_Star
          break
      }
      const grid = getInitialGrid()
      this.setState({ pathfinderName, pathfinder: pathFinderFunc, grid })
    }
  }
  render() {
    const { grid, dropdownOpen, pathfinderName, pathfinder } = this.state
    return (
      <div>
        <Button color="primary" onClick={() => this.visualizePathfinder(pathfinder)}>
          Visualize {pathfinderName}
        </Button>
        <Dropdown isOpen={dropdownOpen} toggle={this.toggle}>
          <DropdownToggle caret>
            Algorithms
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={this.onDropdownItemClick} dropdownvalue={Algorithms.Dijkstra}>Dijkstra</DropdownItem>
            <DropdownItem onClick={this.onDropdownItemClick} dropdownvalue={Algorithms.BFS}>Breadth First Search</DropdownItem>
            <DropdownItem onClick={this.onDropdownItemClick} dropdownvalue={Algorithms.DFS}>Depth First Search</DropdownItem>
            <DropdownItem onClick={this.onDropdownItemClick} dropdownvalue={Algorithms.A_Star}>A*</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node
                  return (
                    <DisplayNode
                      key={nodeIdx}
                      row={row}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      onMouseDown={(row: number, col: number) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row: number, col: number) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

const getInitialGrid = (): Grid => {
  const grid = []
  for (let row = 0; row < 20; row++) {
    const currentRow = []
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row))
    }
    grid.push(currentRow)
  }
  return grid
}

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
  }
}

const getNewGridWithWallToggled = (grid: Grid, row: number, col: number): Grid => {
  const newGrid = grid.slice()
  const node = newGrid[row][col]
  const newNode = {
    ...node,
    isWall: !node.isWall,
  }
  newGrid[row][col] = newNode
  return newGrid
}
