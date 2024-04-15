"use client";
import next from "next";
import React, { useEffect, useRef, useState } from "react";

const Game = () => {
  type directionType = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";
  enum directionalValues {
    ArrowUp = -10,
    ArrowDown = +10,
    ArrowLeft = -1,
    ArrowRight = +1,
  }
  class block {
    pos: number[];
    constructor() {
      this.pos = [14, 13];
    }
    move = (direction: directionType) => {
      this.pos = this.pos.map(
        (b) => b + directionalValues[direction],
        direction,
      );
    };
  }

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
        console.log(takenList[nextBlockRow].includes(nextBlock));
        return takenList[nextBlockRow].includes(nextBlock);
      }
    });
  };

  const createNewBlock = () => {
    activeBlock = new block();
    drawCurrentBlock();
  };

  let takenList: number[][] = new Array(20).fill(null).map(() => []);

  const moveBlocksDownAfterBreak = (row: number) => {
    //adds 10 to all blocks above the broken row
    let rowsAboveBrokenRow = takenList
      .slice(0, row)
      .map((li) => li.map((el) => el + 10));
    const rowsBelowBrokenRow = takenList.slice(row + 1);
    takenList = [[], ...rowsAboveBrokenRow, ...rowsBelowBrokenRow];
    emptyBlocksListRef.current.forEach((element) =>
      element.classList.remove("blocked"),
    );

    takenList.forEach((list) =>
      list.forEach((el) => {
        emptyBlocksListRef.current[el].classList.add("blocked");
      }),
    );
  };
  const scoring = () => {
    setScore((s) => (s as number) + 100);
  };

  const deleteFilledRow = (block: number) => {
    const row = parseInt(block.toString().padStart(3, "0").slice(0, -1));
    takenList[row].push(block);
    if (takenList[row].length === 10) {
      takenList[row].forEach((block) => {
        emptyBlocksListRef.current[block].classList.remove("blocked");
      });
      moveBlocksDownAfterBreak(row);
      scoring();
    }
  };

  const registerBlock = () => {
    activeBlock.pos.forEach((block) => {
      deleteFilledRow(block);
    });
  };

  const gameOver = () => {
    if (takenList[0].length >= 1) {
      console.log("gameOver");
      clearInterval(intervalIdRef.current);
      setScore("Game Over!");
      onkeydown = () => {};
    }
  };

  const moveBlock = (direction: directionType) => {
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
  };

  //TODO: add more blocks
  const handleRestart = () => {
    handleStop();
    emptyBlocksListRef.current.forEach((block) => {
      block.classList.remove("blocked");
      takenList = new Array(20).fill(null).map(() => []);
    });
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
    blockContainerRef.current.style.filter = "";
    drawCurrentBlock();
    intervalIdRef.current = setInterval(() => {
      moveBlock("ArrowDown");
    }, 1000);
  };

  const handleStop = () => {
    //remove controls
    onkeydown = (e) => {};
    blockContainerRef.current.style.filter = "blur(1px)";
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
            >
              {index}
            </div>
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
