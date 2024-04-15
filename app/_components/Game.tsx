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
      this.pos = [14, 13, 4];
    }
    move = (direction: directionType) => {
      this.pos = this.pos.map(
        (b) => b + directionalValues[direction],
        direction,
      );
    };
  }

  const activeBlockRef = useRef(new block());
  const draw = () => {
    activeBlockRef.current.pos.forEach((element) =>
      emptyBlocksListRef.current[element].classList.add("blocked"),
    );
  };

  const undraw = () => {
    activeBlockRef.current.pos.forEach((element) =>
      emptyBlocksListRef.current[element].classList.remove("blocked"),
    );
  };
  const doesNextBlockExist = (direction: directionType) => {
    return activeBlockRef.current.pos.some((el) => {
      const nextBlock = el + directionalValues[direction];
      const nextBlockRow = parseInt(nextBlock.toString().padStart(3, "0").slice(0, -1));
      if (nextBlock > 199) return true;
      if (direction === "ArrowLeft" && nextBlock.toString().slice(-1) === "9")
        return true;
      else if (
        direction === "ArrowRight" &&
        nextBlock.toString().slice(-1) === "0"
      )
        return true;
      else {
        return takenList[nextBlockRow].includes(nextBlock);
      }
    });
  };
  const createNewBlock = () => {
    activeBlockRef.current = new block();
    draw();
  };
  let takenList: number[][] = new Array(20).fill(null).map(() => []);
  const registerBlock = () => {
    activeBlockRef.current.pos.forEach((block) => {
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
      undraw();
      activeBlockRef.current.move(direction);
      draw();
    } else {
      if (direction === "ArrowDown") {
        registerBlock();
        createNewBlock();
        gameOver();
      }
    }
  };

  const deleteFilledRow = (block: number) => {
    const row = parseInt(block.toString().padStart(3, "0").slice(0, -1));
    takenList[row].push(block);
    if (takenList[row].length === 10) {
      takenList[row].forEach((block) => {
        emptyBlocksListRef.current[block].classList.remove("blocked");
        takenList[row] = [];
      });
    }
  };

  //TODO: add more blocks and score system
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
  const handleStart = () => {
    //add controls
    onkeydown = (e) => {
      e.preventDefault();
      if (e.key in directionalValues) {
        moveBlock(e.key as directionType);
      }
    };
    draw();
    intervalIdRef.current = setInterval(() => {
      moveBlock("ArrowDown");
    }, 1000);
  };
  const handleStop = () => {
    clearInterval(intervalIdRef.current);
  };
  const [score, setScore] = useState<number | string>(0);
  const emptyBlocksListRef = useRef<HTMLDivElement[]>([]);
  const intervalIdRef = useRef<NodeJS.Timeout>();
  return (
    <>
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
      <div className="flex h-[800px] w-[402px] flex-wrap justify-center border">
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
      <div className=" ml-10">
        <h1 className="text-xl">Score: {score}</h1>
      </div>
    </>
  );
};

export default Game;
