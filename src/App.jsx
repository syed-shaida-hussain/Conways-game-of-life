import { useState, useRef } from "react";

const rows = 30;
const columns = 30;

const countAliveNeighbors = (grid, i, j) => {
  let count = 0;
  const operations = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  operations.forEach(([x, y]) => {
    const newI = i + x;
    const newJ = j + y;
    if (newI >= 0 && newI < rows && newJ >= 0 && newJ < columns) {
      count += grid[newI][newJ];
    }
  });
  return count;
};

const generateEmptyGrid = () => {
  const gridRows = [];
  for (let i = 0; i < rows; i++) {
    gridRows.push(Array.from(Array(columns), () => 0));
  }
  return gridRows;
};

const generateRandomGrid = () => {
  const gridRows = [];
  for (let i = 0; i < rows; i++) {
    gridRows.push(Array.from(Array(columns), () => Math.random() > .8 ? 1 : 0));
  }
  return gridRows;
};

function App() {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });
  const [isGameStarted, setIsGameStarted] = useState(false);
  const runningRef = useRef(isGameStarted);
  runningRef.current = isGameStarted;

  const cellClickHandler = (i, j) => {
    const newGrid = [...grid];
    newGrid[i][j] = newGrid[i][j] === 0 ? 1 : 0;
    setGrid(newGrid);
  };

  const resetGameHandler = () => {
    setGrid(() => {
      return generateEmptyGrid();
    });
  };

  const randomGridHandler = () => {
    setGrid(() => {
      return generateRandomGrid();
    });
  };


  const updateCellsHandler = () => {
    if (!runningRef.current) {
      return;
    }
    setGrid((g) => {
      return g.map((row, i) =>
        row.map((cell, j) => {
          const neighbors = countAliveNeighbors(g, i, j);
          if (cell === 1) {
            if (neighbors < 2 || neighbors > 3) {
              return 0;
            } else {
              return 1;
            }
          } else {
            if (neighbors === 3) {
              return 1;
            } else {
              return 0;
            }
          }
        })
      );
    });

    setTimeout(updateCellsHandler, 1000);
  };
  return (
    <>
     <div className="App">
      <h1>{`Conway's game of life`}</h1>
      <div className="btn-container">
        <button
          onClick={() => {
            setIsGameStarted(!isGameStarted);
            if (!isGameStarted) {
              runningRef.current = true;
              updateCellsHandler();
            }
          }}
        >
          {isGameStarted ? "Stop" : "Start"}
        </button>
        <button onClick={resetGameHandler}>Reset</button>
        <button onClick={randomGridHandler}>Random</button>

      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 20px)`,
        }}
      >
        {grid.map((row, i) =>
          row.map((col, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => cellClickHandler(i, j)}
              style={{
                backgroundColor: grid[i][j] ? "yellow" : "gray",
              }}
              className="cell"
            />
          ))
        )}
      </div>
    </div>

    </>
  )
}

export default App
