import { markMoveAsCompletedOnList } from "./combos.js";
import { CANVAS, DEFAULT_FPS } from "./constants.js";

var canvas;
var ctx;
var spriteSheet;
var currentAnimation = "idle";
var fps = DEFAULT_FPS;
var fpsInterval = Math.round(1000 / fps);

const SPRITE_WIDTH = 120;
const SPRITE_HEIGHT = 180;

// var timeDebug;

const animations = {
  idle: {
    loop: true,
    frames: 4,
    currentFrame: 0,
    spriteSheetStart: 16,
  },
  cross: {
    frames: 2,
    currentFrame: 0,
    alternate: true,
    spriteSheetStart: 12,
  },
  jab: {
    frames: 2,
    currentFrame: 0,
    alternate: true,
    spriteSheetStart: 20,
  },
  rearHook: {
    frames: 4,
    currentFrame: 0,
    spriteSheetStart: 34,
  },
  leadHook: {
    frames: 4,
    currentFrame: 0,
    spriteSheetStart: 24,
  },
  rearUppercut: {
    frames: 4,
    currentFrame: 0,
    spriteSheetStart: 38,
  },
  leadUppercut: {
    frames: 4,
    currentFrame: 0,
    spriteSheetStart: 28,
  },
  slip: {
    frames: 1,
    currentFrame: 0,
    alternate: true,
    spriteSheetStart: 44,
  },
  parry: {
    frames: 2,
    currentFrame: 0,
    spriteSheetStart: 32,
  },
  roll: {
    frames: 2,
    currentFrame: 0,
    spriteSheetStart: 42,
  },
  block: {
    frames: 2,
    currentFrame: 0,
    alternate: true,
    spriteSheetStart: 1,
  },
  bobAndWeave: {
    frames: 8,
    currentFrame: 0,
    spriteSheetStart: 4,
  },
};

const getNextSpriteIndex = (animation) => {
  let nextFrame = animations[animation].currentFrame + 1;

  if (nextFrame > animations[animation].frames) {
    if (animations[animation].loop) {
      nextFrame = 1;
    } else {
      // if (timeDebug) {
      //   const endTime = performance.now();
      //   let timeDiff = endTime - timeDebug; //in ms
      //   // strip the ms
      //   timeDiff /= 1000;

      //   const seconds = Math.round(timeDiff);
      //   timeDebug = undefined;
      // }

      // Animation ended, reset to idle
      markMoveAsCompletedOnList(animation);
      currentAnimation = "idle";
      animations[animation].currentFrame = 0;

      const animationShouldAlternate =
        animations[animation].hasOwnProperty("alternate");
      if (animationShouldAlternate) {
        animations[animation].alternate = !animations[animation].alternate;
      }

      return getNextSpriteIndex(currentAnimation);
    }
  }

  animations[animation].currentFrame = nextFrame;
  const nextSpriteIndex = Math.max(
    animations[animation].spriteSheetStart + nextFrame - 1,
    animations[animation].spriteSheetStart
  );

  return nextSpriteIndex;
};

const drawSpriteByIndex = (spriteIndex) => {
  ctx.drawImage(
    spriteSheet,
    SPRITE_WIDTH * spriteIndex,
    0,
    SPRITE_WIDTH,
    SPRITE_HEIGHT,
    0,
    0,
    SPRITE_WIDTH,
    SPRITE_HEIGHT
  );
};

const animate = (prevTime = window.performance.now(), time) => {
  const timeSinceLastLoop = time - prevTime;

  const enoughTimeHasPassed = timeSinceLastLoop > fpsInterval;
  if (enoughTimeHasPassed) {
    // Get ready for next frame by setting previous time to time right now
    prevTime = time - (timeSinceLastLoop % fpsInterval);

    ctx.clearRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
    const spriteIndex = getNextSpriteIndex(currentAnimation);
    drawSpriteByIndex(spriteIndex);
  }

  requestAnimationFrame((time) => animate(prevTime, time));
};

export const setupCanvas = () => {
  return new Promise((resolve) => {
    canvas = document.getElementById("canvas");
    canvas.width = CANVAS.WIDTH;
    canvas.height = CANVAS.HEIGHT;

    ctx = canvas.getContext("2d");
    spriteSheet = new Image();
    spriteSheet.src = "./img/spritesheet.png";

    spriteSheet.onload = () => {
      animate();
      resolve();
    };
  });
};

export const getAnimationDuration = (animation) => {
  const { frames } = animations[animation];
  return Math.max((frames / fps) * 1000, 1000) + fpsInterval;
};

export const setSpeed = (speed) => {
  fps = speed;
  fpsInterval = Math.round(1000 / speed);
};

export const setAnimation = (animation) => {
  animations[animation].currentFrame = 0;
  currentAnimation = animation;

  // timeDebug = window.performance.now();
};
