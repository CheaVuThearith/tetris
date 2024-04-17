"use client";
import { secureHeapUsed } from "crypto";
import Image from "next/image";
import { userAgentFromString } from "next/server";
import React, { useEffect, useRef } from "react";

type Props = {};

const FlappyBird = (props: Props) => {
  let play = false;
  const birdRef = useRef<HTMLDivElement>(null);
  const pipeContainerRef = useRef<HTMLDivElement>(null);
  const birdYRef = useRef(0);
  const jumped = useRef(0);
  const gravity = () => {
    if (birdRef.current) {
      if (birdYRef.current > 0) {
        if (jumped.current < 50) {
          birdYRef.current--;
          jumped.current++;
        } else {
          birdYRef.current = birdYRef.current - 5;
        }
        if (play) {
          birdRef.current.animate(
            { bottom: `${birdYRef.current}px` },
            {
              fill: "forwards",
              duration: 1000,
              easing: "cubic-bezier(.56,.17,0,.82)",
            },
          );
        }
      }
      if (typeof window !== "undefined") {
        requestAnimationFrame(gravity);
      }
    }
  };
  if (typeof window !== "undefined") {
    requestAnimationFrame(gravity);
  }
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
      width: 75px;
      top: 0px;
      right:-100px;
      position: absolute;
      background: white;
      `;
      this.bottom.style.cssText = `
      height: ${this.botPos}px;
      width: 75px;
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
          this.XPos = this.XPos + 2;
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
          if (typeof window !== "undefined") {
            requestAnimationFrame(this.move);
          }
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
  const kfcRef = useRef<HTMLImageElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const intervalIdRef = useRef<NodeJS.Timeout>();
  const gameOver = () => {
    onkeydown = () => {};
    if (birdRef.current)
      birdRef.current.animate(
        { bottom: "48px" },
        { duration: 200, fill: "forwards" },
      );
    if (kfcRef.current) kfcRef.current.style.opacity = "100%";
    play = false;

    if (playButtonRef.current) playButtonRef.current.style.display = "block";
    clearInterval(intervalIdRef.current);
  };
  const controls = () => {
    if (birdRef.current) {
      jumped.current = 0;
      birdRef.current.animate(
        { bottom: `${Math.min(birdYRef.current)}px` },
        { fill: "forwards", duration: 1000 },
      );
      birdYRef.current = Math.min(birdYRef.current + 125, window.innerHeight);
    }
  };
  const handlePlay = () => {
    if (kfcRef.current) kfcRef.current.style.opacity = "0%";
    window.ontouchstart = () => controls();
    onkeydown = (e) => {
      if (e.key === "ArrowUp" || e.key === " ") controls();
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
          className="absolute bottom-0 left-1/3 size-12 rounded-full bg-yellow-300 after:absolute after:-right-2 after:top-1/2 after:size-3 after:bg-orange-500"
        ></div>
        <Image
          ref={kfcRef}
          src="/kfrc.png"
          className="absolute opacity-0 bottom-0 left-[32.5%]"
          alt="kfc bucket"
          width={100}
          height={50}
        />
      </div>
    </>
  );
};

export default FlappyBird;
