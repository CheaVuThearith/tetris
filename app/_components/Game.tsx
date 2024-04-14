"use client";
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
      this.pos = [12, 13, 2];
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
  const sliceDigitBasedOnDirection = (el: number, direction: directionType) =>
    direction === "ArrowRight" || direction === "ArrowLeft"
      ? parseInt(el.toString().slice(-1))
      : parseInt(el.toString().slice(0, -1));
  const minOrMaxBasedOnDirection = (
    direction: directionType,
    ...values: number[]
  ) => {
    return direction === "ArrowUp" || direction === "ArrowLeft"
      ? Math.min(...values)
      : Math.max(...values);
  };
  const doesNextBlockNotExist = (direction: directionType) => {
    const latestBlockFirstDigits: number = minOrMaxBasedOnDirection(
      direction,
      ...activeBlockRef.current.pos.map((el) => {
        const digit = sliceDigitBasedOnDirection(el, direction);
        console.log(`digit: ${digit}`);
        return isNaN(digit) ? 0 : digit;
      }),
    );
    console.log(`LatestBlockFirstDigits: ${latestBlockFirstDigits}`);
    const latestBlocksList = activeBlockRef.current.pos.filter(
      (el) =>
        sliceDigitBasedOnDirection(el, direction) === latestBlockFirstDigits,
    );
    console.log(`currentBlockPosition: ${activeBlockRef.current.pos}`);
    console.log(`latestBlockList: ${latestBlocksList}`);
    console.log(direction);
    console.log(`-------------------------------------------------------`);

    try {
      return latestBlocksList.every((el) => {
        const nextBlock = el + directionalValues[direction];
        if (direction === "ArrowLeft" && nextBlock.toString().slice(-1) === "9")
          return false;
        else if (
          direction === "ArrowRight" &&
          nextBlock.toString().slice(-1) === "0"
        )
          return false;
        else
          return !emptyBlocksListRef.current[nextBlock].classList.contains(
            "blocked",
          );
      });
    } catch {
      return false;
    }
  };
  const createNewBlock = () => {
    activeBlockRef.current = new block();
    draw();
  };
  const moveBlock = (direction: directionType) => {
    if (doesNextBlockNotExist(direction)) {
      undraw();
      activeBlockRef.current.move(direction);
      draw();
    } else {
      if (direction === "ArrowDown") createNewBlock();
    }
  };
  const handleStart = () => {
    intervalIdRef.current = setInterval(() => {
      moveBlock("ArrowDown");
    }, 1000);
  };
  const handleStop = () => {
    clearInterval(intervalIdRef.current);
  };

  onkeydown = (e) => {
    e.preventDefault();
    if (e.key in directionalValues) {
      moveBlock(e.key as directionType);
    }
  };
  const emptyBlocksListRef = useRef<HTMLDivElement[]>([]);
  const intervalIdRef = useRef<NodeJS.Timeout>();
  return (
    <>
      <div className="mr-10 flex border">
        <button className="px-4 py-2 active:scale-90" onClick={handleStart}>
          Start
        </button>
        <button className="px-4 py-2 active:scale-90" onClick={handleStop}>
          Stop
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
    </>
  );
};

export default Game;
