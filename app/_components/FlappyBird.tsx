"use client";
import { userAgentFromString } from "next/server";
import React, { useEffect, useRef } from "react";

type Props = {};

const FlappyBird = (props: Props) => {
  let play = false;
  const birdRef = useRef<HTMLDivElement>(null);
  const pipeContainerRef = useRef<HTMLDivElement>(null);
  const birdYRef = useRef(0);
  const gravity = () => {
    if (birdRef.current) {
      const birdProps = birdRef.current.getBoundingClientRect();
      if (birdYRef.current > 0) {
        birdYRef.current--;
        birdRef.current.animate(
          { bottom: `${birdYRef.current}px` },
          {
            fill: "forwards",
            duration: 300,
            easing: "cubic-bezier(.56,.17,0,.82)",
          },
        );
      }
      requestAnimationFrame(gravity);
    }
  };
  requestAnimationFrame(gravity);
  class pipe {
    randomYPos: number;
    XPos: number;
    topPos: number;
    botPos: number;
    top: HTMLDivElement;
    bottom: HTMLDivElement;
    topActualPos: DOMRect;
    bottomActualPos: DOMRect;
    constructor() {
      this.randomYPos = Math.floor(Math.random() * (window.innerHeight * 0.8));
      this.topPos = window.innerHeight - this.randomYPos - 200;
      this.botPos = window.innerHeight - this.topPos - 200;
      this.top = document.createElement("div");
      this.bottom = document.createElement("div");
      this.topActualPos = this.top.getBoundingClientRect();
      this.bottomActualPos = this.bottom.getBoundingClientRect();
      this.top.style.cssText = `
      height: ${this.topPos}px;
      width: 100px;
      top: 0px;
      right:-100px;
      position: absolute;
      background: white;
      `;
      this.bottom.style.cssText = `
      height: ${this.botPos}px;
      width: 100px;
      bottom: 0px;
      right:-100px;
      position: absolute;
      background: white;
      `;
      this.XPos = -100;
    }
    insetToDom = () => {
      if (pipeContainerRef.current) {
        pipeContainerRef.current.appendChild(this.top);
        pipeContainerRef.current.appendChild(this.bottom);
      }
    };
    removeFromDom = () => {
      if (pipeContainerRef.current) {
        pipeContainerRef.current.removeChild(this.top);
        pipeContainerRef.current.removeChild(this.bottom);
      }
    };
    move = () => {
      if (play) {
        if (this.XPos < window.innerWidth) {
          this.XPos++;
          this.top.animate(
            { right: `${this.XPos}px` },
            { fill: "forwards", duration: 300 },
          );
          this.bottom.animate(
            { right: `${this.XPos}px` },
            { fill: "forwards", duration: 300 },
          );
          this.topActualPos = this.top.getBoundingClientRect();
          this.bottomActualPos = this.bottom.getBoundingClientRect();

          requestAnimationFrame(this.move);
        } else {
          this.removeFromDom();
        }

        if (birdRef.current) {
          const birdPos = birdRef.current.getBoundingClientRect();
          if (
            Math.floor(this.topActualPos.left) <= birdPos.right &&
            Math.floor(this.topActualPos.right) > birdPos.left &&
            Math.floor(birdPos.top) <= Math.floor(this.topActualPos.bottom)
          ) {
            gameOver();
          }
          if (
            Math.floor(this.bottomActualPos.left) <= birdPos.right &&
            Math.floor(this.bottomActualPos.right) > birdPos.left &&
            Math.floor(birdPos.bottom) >= Math.floor(this.bottomActualPos.top)
          ) {
            gameOver();
          }
        }
      }
    };
  }
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const intervalIdRef = useRef<NodeJS.Timeout>();
  const gameOver = () => {
    onkeydown = (e) => {};
    play = false;
    if (playButtonRef.current) playButtonRef.current.style.display = "block";
    clearInterval(intervalIdRef.current);
  };

  const handlePlay = () => {
    onkeydown = (e) => {
      if ((e.key === "ArrowUp" || e.key === " ") && birdRef.current) {
        birdRef.current.animate(
          { bottom: `${Math.min(birdYRef.current)}px` },
          { fill: "forwards", duration: 300 },
        );
        birdYRef.current = Math.min(birdYRef.current + 100, window.innerHeight);
      }
    };
    play = true;
    if (playButtonRef.current) {
      if (playButtonRef.current) playButtonRef.current.style.display = "none";
    }
    if (pipeContainerRef.current) pipeContainerRef.current.innerHTML = "";
    intervalIdRef.current = setInterval(generateNewPipe, 3000);
  };
  const generateNewPipe = () => {
    const newPipe = new pipe();
    newPipe.insetToDom();
    newPipe.move();
  };
  return (
    <>
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          ref={pipeContainerRef}
          className="absolute inset-0 flex justify-end "
        ></div>
        <button
          ref={playButtonRef}
          onClick={handlePlay}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform border px-3 py-1 text-6xl"
        >
          PLAY
        </button>
        <div
          ref={birdRef}
          className="absolute bottom-0 left-96 size-12 rounded-full bg-yellow-300 after:absolute after:-right-2 after:top-1/2 after:size-3 after:bg-orange-500"
        ></div>
      </div>
    </>
  );
};

export default FlappyBird;
