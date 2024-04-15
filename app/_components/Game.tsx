"use client";
import React, { useEffect, useRef, useState } from "react";

const Game = () => {
  const blockTypes = {
    i: [3, 4, 5, 6],
    j: [3, 13, 14, 15],
    l: [5, 15, 14, 13],
    o: [4, 5, 14, 15],
    s: [4, 5, 13, 14],
    t: [4, 13, 14, 15],
    z: [3, 4, 14, 15],
  };
  type directionType = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";
  enum directionalValues {
    ArrowDown = +10,
    ArrowLeft = -1,
    ArrowRight = +1,
    ArrowUp = 0,
  }
  class block {
    pos: number[];
    constructor() {
      this.pos = Object.values(blockTypes)[Math.floor(Math.random() * 6)];
    }
    move = (direction: directionType) => {
      this.pos = this.pos.map(
        (b) => b + directionalValues[direction],
        direction,
      );
    };
  }

  const rotateBlock90Degrees = () => {
    undrawCurrentBlock();
    // Convert the block indices to row and column indices
    let block: any = activeBlock.pos;
    block = block.map((i: number) => [Math.floor(i / 10), i % 10]);

    // Move the block to the origin
    let minRow = Math.min(...block.map(([i, j]: number[]) => i));
    let minCol = Math.min(...block.map(([i, j]: number[]) => j));
    block = block.map(([i, j]: number[]) => [i - minRow, j - minCol]);

    // Rotate the block
    block = block.map(([i, j]: number[]) => [j, i]);

    // Reverse the row indices
    let maxRow = Math.max(...block.map(([i, j]: number[]) => i));
    block = block.map(([i, j]: number[]) => [maxRow - i, j]);

    // Move the block back to its original position
    block = block.map(([i, j]: number[]) => [i + minRow, j + minCol]);

    // Convert the row and column indices back to block indices
    block = block.map(([i, j]: number[]) => i * 10 + j);
    activeBlock.pos = block;
    drawCurrentBlock();
  };

  let activeBlock = new block();
  const drawCurrentBlock = () => {
    activeBlock.pos.forEach((element) =>
      emptyBlocksListRef.current[element].classList.add("blocked"),
    );
  };

  const undrawCurrentBlock = () => {
    activeBlock.pos.forEach((element) =>
      emptyBlocksListRef.current[element].classList.remove("blocked"),
    );
  };

  const doesNextBlockExist = (direction: directionType) => {
    return activeBlock.pos.some((el) => {
      const nextBlock = el + directionalValues[direction];
      const nextBlockRow = parseInt(
        nextBlock.toString().padStart(3, "0").slice(0, -1),
      );
      if (nextBlock > 199) return true;
      if (direction === "ArrowLeft" && nextBlock.toString().slice(-1) === "9")
        return true;
      else if (
        direction === "ArrowRight" &&
        nextBlock.toString().slice(-1) === "0"
      )
        return true;
      else {
        return takenList.current[nextBlockRow].includes(nextBlock);
      }
    });
  };

  const createNewBlock = () => {
    activeBlock = new block();
    drawCurrentBlock();
  };

  const takenList = useRef<number[][]>(new Array(20).fill(null).map(() => []));

  const undrawCanvas = () => {
    takenList.current.forEach((list) => {
      list.forEach((el) => {
        emptyBlocksListRef.current[el].classList.remove("blocked");
      });
    });
  };
  const moveBlocksDownAfterBreak = (row: number) => {
    //adds 10 to all blocks above the broken row
    const rowsAboveBrokenRow = takenList.current
      .slice(0, row)
      .map((li) => li.map((el) => el + 10));
    const rowsBelowBrokenRow = takenList.current.slice(row + 1);
    takenList.current = [[], ...rowsAboveBrokenRow, ...rowsBelowBrokenRow];
  };

  const drawCanvas = () => {
    takenList.current.forEach((list) => {
      list.forEach((el) => {
        emptyBlocksListRef.current[el].classList.add("blocked");
      });
    });
  };
  const scoring = () => {
    if (filledRows.current.length !== 0) {
      const scoreToAdd =
        Math.floor(
          1.2 ** filledRows.current.length + filledRows.current.length,
        ) * 50;
      setScore((s) => (s as number) + scoreToAdd);
    }
  };
  const filledRows = useRef<number[]>([]);
  const deleteFilledRow = () => {
    filledRows.current.sort();
    filledRows.current.forEach((row, index) => {
      takenList.current[row] = [];
      moveBlocksDownAfterBreak(row);
    });
    filledRows.current = [];
  };

  const registerBlock = () => {
    activeBlock.pos.forEach((block) => {
      const row = parseInt(block.toString().padStart(3, "0").slice(0, -1));
      takenList.current[row].push(block);
      if (takenList.current[row].length === 10) {
        filledRows.current.push(row);
      }
    });
    scoring();
    undrawCanvas();
    deleteFilledRow();
    drawCanvas();
  };
  const clearCanvas = () => {
    emptyBlocksListRef.current.forEach((block) => {
      block.classList.remove("blocked");
      takenList.current = new Array(20).fill(null).map(() => []);
    });
  };
  const gameOver = () => {
    if (takenList.current[0].length >= 1) {
      clearInterval(intervalIdRef.current);
      onkeydown = () => {};
      clearCanvas()
      undrawCanvas();
      activeBlock.pos = [
         82, 87, 122, 113, 104, 105, 116, 127,
      ];
      drawCurrentBlock();
    }
  };

  const moveBlock = (direction: directionType) => {
    if (direction !== "ArrowUp") {
      if (!doesNextBlockExist(direction)) {
        undrawCurrentBlock();
        activeBlock.move(direction);
        drawCurrentBlock();
      } else {
        if (direction === "ArrowDown") {
          registerBlock();
          createNewBlock();
          gameOver();
        }
      }
    } else if (
      !doesNextBlockExist("ArrowLeft") &&
      !doesNextBlockExist("ArrowRight")
    ) {
      rotateBlock90Degrees();
    }
  };

  //TODO: add more blocks
  const handleRestart = () => {
    handleStop();
    clearCanvas();
    setScore(0);
    createNewBlock();
    handleStart();
  };
  const blockContainerRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    //add controls
    onkeydown = (e) => {
      e.preventDefault();
      if (e.key in directionalValues) {
        moveBlock(e.key as directionType);
      }
    };
    if (blockContainerRef.current) {
      blockContainerRef.current.style.filter = "";
    }
    drawCurrentBlock();
    intervalIdRef.current = setInterval(() => {
      moveBlock("ArrowDown");
    }, 500);
  };

  const handleStop = () => {
    //remove controls
    onkeydown = (e) => {};
    if (blockContainerRef.current) {
      blockContainerRef.current.style.filter = "blur(1px)";
    }
    clearInterval(intervalIdRef.current);
  };
  const [score, setScore] = useState<number | string>(0);
  const emptyBlocksListRef = useRef<HTMLDivElement[]>([]);
  const intervalIdRef = useRef<NodeJS.Timeout>();

  return (
    <>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="mr-10 flex flex-col border">
          <button className="px-4 py-2 active:scale-90" onClick={handleStart}>
            Start
          </button>
          <button className="px-4 py-2 active:scale-90" onClick={handleStop}>
            Pause
          </button>
          <button className="px-4 py-2 active:scale-90" onClick={handleRestart}>
            Restart
          </button>
        </div>
        <div
          ref={blockContainerRef}
          className="flex h-[800px] w-[402px] flex-wrap justify-center border"
        >
          {Array.from({ length: 200 }).map((_, index) => (
            <div
              ref={(el) => {
                if (el) {
                  emptyBlocksListRef.current[index] = el;
                }
              }}
              key={index}
              className={`aspect-square size-10 border border-[#ffffff75]`}
            ></div>
          ))}
        </div>
        <div className=" ml-10 w-20">
          <h1 className="text-xl">Score: {score}</h1>
        </div>
      </div>
    </>
  );
};

export default Game;
