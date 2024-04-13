"use client";
import React, { useEffect, useState } from "react";

type Props = {};

const Game = (props: Props) => {
  const handleCanvasUpdate = () => {
    setActive((a) => [testBlock.pos]);
  };
  const valueLimit = (value:number) => {
    return Math.min(Math.max(value, 0), 199);
  };
  class block {
    pos: number;
    constructor() {
      this.pos = 0;
    }
    move = (direction: string) => {
      switch (direction) {
        case "ArrowUp":
          this.pos = valueLimit(this.pos - 10);
          handleCanvasUpdate();
          break;
        case "ArrowDown":
          this.pos = valueLimit(this.pos + 10);
          handleCanvasUpdate();
          break;
        case "ArrowLeft":
          this.pos = valueLimit(this.pos - 1);
          handleCanvasUpdate();
          break;
        case "ArrowRight":
          this.pos = valueLimit(this.pos + 1);
          handleCanvasUpdate();
          break;
        case "Enter":
          this.pos = parseInt("19" + this.pos.toString().slice(-1));
          handleCanvasUpdate();
          break;
        default:
          break;
      }
    };
  }

  const testBlock = React.useRef(new block()).current;

  onkeydown = (e) => {
    e.preventDefault();
    testBlock.move(e.key);
    console.log(testBlock.pos);
  };

  const moveBlockDownTillBottom = async () => {
    while (testBlock.pos <= 190) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      testBlock.move("ArrowDown");
    }
  };
  useEffect(() => {
    moveBlockDownTillBottom();
  }, []);

  const [active, setActive] = useState<number[]>([]);
  const [canvas, setCanvas] = useState<number[]>([]);
  return (
    <div className="flex h-[800px] w-[402px] flex-wrap justify-center border">
      {Array.from({ length: 200 }).map((_, index) => (
        <div
          key={index}
          className={`aspect-square size-10 border border-[#ffffff75] ${active.includes(index) && "shadow-inner shadow-white"}`}
          style={{ background: active.includes(index) ? "red" : undefined }}
        >
          {index}
        </div>
      ))}
    </div>
  );
};

export default Game;
