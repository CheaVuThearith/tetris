"use client";
import { userAgentFromString } from "next/server";
import React, { useRef } from "react";

type Props = {};

const FlappyBird = (props: Props) => {
  const birdRef = useRef<HTMLDivElement>(null);
  const birdPosY = useRef(0);
  onkeydown = (e) => {
    if (e.key === "ArrowUp") {
      birdRef.current?.animate(
        [{ transform: `translate(0, ${-birdPosY.current}px)` }],
        { duration: 200, fill: "forwards" },
      );
      birdPosY.current = birdPosY.current + 100;
    }
    (async () => {
      while (birdPosY.current > 0) {
        await new Promise((resolve) => setTimeout(resolve, 20));
        birdRef.current?.animate(
          [{ transform: `translate(0, ${-birdPosY.current}px)` }],
          { duration: 0, fill: "forwards" },
        );
        birdPosY.current  = birdPosY.current - 1;
      }
    })();
  };
  return (
    <>
      <div className="absolute inset-0 -z-10">
        <div
          ref={birdRef}
          className="absolute left-96 top-96 size-12 rounded-full bg-yellow-300 after:absolute after:-right-2 after:top-1/2 after:size-3 after:bg-orange-500"
        ></div>
      </div>
    </>
  );
};

export default FlappyBird;
