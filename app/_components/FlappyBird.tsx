"use client";
import { secureHeapUsed } from "crypto";
import { Biryani } from "next/font/google";
import Image from "next/image";
import { userAgentFromString } from "next/server";
import React, { useEffect, useRef, useState } from "react";

type Props = {};

const FlappyBird = (props: Props) => {
  let play = false;
  const birdRef = useRef<HTMLDivElement>(null);
  const pipeContainerRef = useRef<HTMLDivElement>(null);
  let birdY = 0;
  const gravity = () => {
    if (birdRef.current) {
      if (birdY > 0) {
        birdY = birdY - 25
        if (play) {
          birdRef.current.animate(
            { bottom: `${birdY}px` },
            {
              fill: "forwards",
              duration: 300, delay:0
            },
          );
        }
      }
    }
  };

  let score = 0;
  class pipe {
    randomYPos: number;
    XPos: number;
    topPos: number;
    botPos: number;
    top: HTMLDivElement;
    bottom: HTMLDivElement;
    topActualPos: DOMRect;
    bottomActualPos: DOMRect;
    scored: boolean;
    constructor() {
      this.randomYPos = Math.floor(Math.random() * (window.innerHeight * 0.8));
      this.topPos = window.innerHeight - this.randomYPos - 200;
      this.botPos = window.innerHeight - this.topPos - 200;
      this.top = document.createElement("div");
      this.bottom = document.createElement("div");
      this.topActualPos = this.top.getBoundingClientRect();
      this.bottomActualPos = this.bottom.getBoundingClientRect();
      this.scored = false;
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
      if (play && pipeContainerRef.current) {
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
        if (
          birdRef.current &&
          !this.scored &&
          (this.top == pipeContainerRef.current.firstChild ||
            this.bottom == pipeContainerRef.current.firstChild)
        ) {
          const birdPos = birdRef.current.getBoundingClientRect();
          const birdReachedPipeHorizontally =
            Math.floor(this.topActualPos.left) <= birdPos.right;
          const birdHitTopPipe =
            Math.floor(this.topActualPos.right) > birdPos.left &&
            Math.floor(birdPos.top) <= Math.floor(this.topActualPos.bottom);
          const birdHitBottomPipe =
            Math.floor(this.bottomActualPos.right) > birdPos.left &&
            Math.floor(birdPos.bottom) >= Math.floor(this.bottomActualPos.top);

          if (
            birdReachedPipeHorizontally &&
            (birdHitTopPipe || birdHitBottomPipe)
          ) {
            gameOver();
          } else if (Math.floor(this.bottomActualPos.right) <= birdPos.left) {
            this.scored = true;
            score++;
            if (scoreRef.current)
              scoreRef.current.textContent = `Score: ${score}`;
          }
        }
      }
    };
  }
  const scoreRef = useRef<HTMLHeadingElement>(null);
  const kfcRef = useRef<HTMLImageElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const pipeSpawnInterval = useRef<NodeJS.Timeout>();
  const gravityInterval = useRef<NodeJS.Timeout>();
  const gameOver = () => {
    clearInterval(gravityInterval.current);
    onkeydown = () => {};
    if (birdRef.current)
      birdRef.current.animate(
        { bottom: "48px" },
        {
          duration: 500,
          fill: "forwards",
          easing: "cubic-bezier(.56,.20,0,.82)",
        },
      );
    if (kfcRef.current) kfcRef.current.style.opacity = "100%";
    play = false;

    if (playButtonRef.current) playButtonRef.current.style.display = "block";
    clearInterval(pipeSpawnInterval.current);
  };
  const controls = () => {
    if (birdRef.current) {
      birdY = Math.min(birdY + 125, window.innerHeight);
      birdRef.current.animate(
        { bottom: `${birdY}px` },
        { fill: "forwards", duration: 300 },
      );
    }
  };
  const handlePlay = () => {
    gravityInterval.current = setInterval(gravity, 100);
    if (kfcRef.current) kfcRef.current.style.opacity = "0%";
    window.ontouchstart = () => controls();
    onkeydown = (e) => {
      if (e.key === "ArrowUp" || e.key === " ") controls();
    };
    play = true;
    score = 0;
    birdY = 0;
    if (scoreRef.current) scoreRef.current.textContent = `Score: ${score}`;
    if (playButtonRef.current) {
      if (playButtonRef.current) playButtonRef.current.style.display = "none";
    }
    if (pipeContainerRef.current) pipeContainerRef.current.innerHTML = "";
    pipeSpawnInterval.current = setInterval(generateNewPipe, 3000);
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
        <h1
          ref={scoreRef}
          className="absolute left-1/2 top-[10%] -translate-x-1/2 transform text-3xl"
        >
          Score: {score}
        </h1>
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
          className="absolute bottom-0 left-[32.5%] opacity-0"
          alt="kfc bucket"
          width={100}
          height={50}
        />
      </div>
    </>
  );
};

export default FlappyBird;
