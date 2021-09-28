import React, { Component, MouseEvent } from 'react'
import DisplayNode from './DisplayNode/DisplayNode'
import { Button, ButtonGroup, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
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

type Coord = {
  row: number,
  col: number
}

type State = {
  grid: Grid
  startCoord: Coord
  endCoord: Coord
  mouseIsPressed: boolean
  dropdownOpen: boolean
  pathfinderName: Algorithms
  pathfinder: Pathfinder
  rSelected: number
}

type Pathfinder = (grid: Grid, startNode: Node, finishNode: Node) => Node[]

enum Algorithms {
  Dijkstra = "Dijkstra",
  DFS = "Depth First Search",
  BFS = "Breadth First Search",
  A_Star = "A*"
}

enum Setting {
  Walls = 1,
  StartNode,
  EndNode
}

const instructionMap = {
  [Setting.Walls]: "Click and drag across the grid to set up walls",
  [Setting.StartNode]: "Click on a node to set the start node",
  [Setting.EndNode]: "Click on a node to set the end location"
}
export default class PathfindingVisualizer extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      grid: [],
      startCoord: { row: START_NODE_ROW, col: START_NODE_COL } as Coord,
      endCoord: { row: FINISH_NODE_ROW, col: FINISH_NODE_COL } as Coord,
      mouseIsPressed: false,
      dropdownOpen: false,
      pathfinderName: Algorithms.Dijkstra,
      pathfinder: dijkstra,
      rSelected: 1,
    }
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.onDropdownItemClick = this.onDropdownItemClick.bind(this)
    this.setRSelected = this.setRSelected.bind(this)
  }

  componentDidMount() {
    const grid = this.getInitialGrid()
    this.setState({ grid })
  }

  handleMouseDown(row: number, col: number) {
    const { grid, rSelected } = this.state

    switch (rSelected) {
      case Setting.Walls:
        this.setState({ grid: this.getNewGridWithWallToggled(this.state.grid, row, col), mouseIsPressed: true })
        break
      case Setting.StartNode:
        this.setState({ startCoord: { row, col }, grid: this.setGridNodesToUnvisited(grid), mouseIsPressed: true })
        break
      case Setting.EndNode:
        this.setState({ endCoord: { row, col }, grid: this.setGridNodesToUnvisited(grid), mouseIsPressed: true })
        break
    }
  }

  handleMouseEnter(row: number, col: number) {
    if (this.state.mouseIsPressed) {
      const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col)
      this.setState({ grid: newGrid })
    }
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false })
  }

  highlightShortestPath(nodesInShortestPathOrder: Node[]) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      const node = nodesInShortestPathOrder[i]
      let displayNode = document.getElementById(`node-${node.row}-${node.col}`)

      if (displayNode !== null) displayNode.className =
        'node node-shortest-path'
    }
  }

  moveStartNodeToFinishNode(nodesInShortestPathOrder: Node[]) {
    for (let i = 1; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i]
        let displayNode = document.getElementById(`node-${node.row}-${node.col}`)

        if (displayNode !== null) {
          displayNode.className = 'node node-start'
          this.setState({ startCoord: { row: node.row, col: node.col } })
        }

        const prevNode = nodesInShortestPathOrder[i - 1]
        let prevdisplayNode = document.getElementById(`node-${prevNode.row}-${prevNode.col}`)

        if (prevdisplayNode !== null) {
          prevdisplayNode.className = 'node'
        }

      }, 100 * i)
    }
  }

  visualizePathfinder(pathfinder: Pathfinder) {
    const { grid, startCoord, endCoord } = this.state
    const startNode = grid[startCoord.row][startCoord.col]
    const finishNode = grid[endCoord.row][endCoord.col]
    pathfinder(grid, startNode, finishNode)
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode)
    this.highlightShortestPath(nodesInShortestPathOrder)
    this.moveStartNodeToFinishNode(nodesInShortestPathOrder)
  }

  toggle = () => this.setState((prevState) => ({ dropdownOpen: !prevState.dropdownOpen }))

  onDropdownItemClick(sender: MouseEvent<HTMLButtonElement>) {
    const { grid } = this.state
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
      const newGrid = this.setGridNodesToUnvisited(grid)
      this.setState({ pathfinderName, pathfinder: pathFinderFunc, grid: newGrid })
    }
  }

  getInitialGrid = (resetVisited: boolean = true): Grid => {
    const grid = []
    for (let row = 0; row < 20; row++) {
      const currentRow = []
      for (let col = 0; col < 50; col++) {
        currentRow.push(this.createNode(col, row, resetVisited))
      }
      grid.push(currentRow)
    }
    return grid
  }

  setGridNodesToUnvisited = (grid: Grid): Grid => {
    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 50; col++) {
        grid[row][col].isVisited = false
        grid[row][col].distance = Infinity
        grid[row][col].previousNode = null
      }
    }
    return grid
  }

  createNode = (col: number, row: number, resetVisited: boolean = true): Node => {
    return {
      col,
      row,
      distance: Infinity,
      isVisited: !resetVisited,
      isWall: false,
      previousNode: null,
    }
  }

  getNewGridWithWallToggled = (grid: Grid, row: number, col: number): Grid => {
    const newGrid = grid.slice()
    const node = newGrid[row][col]
    const newNode = {
      ...node,
      isWall: !node.isWall,
    }
    newGrid[row][col] = newNode
    return newGrid
  }

  setRSelected(id: number) {
    this.setState({ rSelected: id })
  }

  render() {
    const { grid, dropdownOpen, startCoord, endCoord, rSelected, pathfinderName, pathfinder } = this.state

    return (
      <div>
        <h1>Pathfinding Visualizer Plus</h1>
        <Button color="primary" onClick={() => this.visualizePathfinder(pathfinder)}>
          Move via {pathfinderName}
        </Button>
        <div>
          <ButtonGroup>
            <Button color="info" onClick={() => this.setRSelected(Setting.Walls)} active={rSelected === Setting.Walls}>Set Walls</Button>
            <Button color="info" onClick={() => this.setRSelected(Setting.StartNode)} active={rSelected === Setting.StartNode}>Set Start Node</Button>
            <Button color="info" onClick={() => this.setRSelected(Setting.EndNode)} active={rSelected === Setting.EndNode}>Set End Node</Button>
          </ButtonGroup>
        </div>
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
        <h5>{instructionMap[rSelected as Setting]}</h5>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isWall } = node
                  return (
                    <DisplayNode
                      key={nodeIdx}
                      row={row}
                      col={col}
                      isStart={row === startCoord.row && col === startCoord.col}
                      isFinish={row === endCoord.row && col === endCoord.col}
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



