import { markMoveAsCompletedOnList } from "./combos.js";
import { CANVAS, DEFAULT_FPS } from "./constants.js";

var canvas;
var ctx;
var sprite;
var currentAnimation = "idle";
var fps = DEFAULT_FPS;
var fpsInterval = Math.round(1000 / fps);

// var timeDebug;

const animations = {
  idle: {
    loop: true,
    frames: 4,
    currentFrame: 0,
  },
  cross: {
    frames: 2,
    currentFrame: 0,
    alternate: true,
  },
  jab: {
    frames: 2,
    currentFrame: 0,
    alternate: true,
  },
  rearHook: {
    frames: 4,
    currentFrame: 0,
  },
  leadHook: {
    frames: 4,
    currentFrame: 0,
  },
  rearUppercut: {
    frames: 4,
    currentFrame: 0,
  },
  leadUppercut: {
    frames: 4,
    currentFrame: 0,
  },
  slip: {
    frames: 1,
    currentFrame: 0,
    alternate: true,
  },
  parry: {
    frames: 2,
    currentFrame: 0,
  },
  roll: {
    frames: 2,
    currentFrame: 0,
  },
  block: {
    frames: 2,
    currentFrame: 0,
    alternate: true,
  },
  bobAndWeave: {
    frames: 8,
    currentFrame: 0,
  },
};

const getNextSprite = (animation) => {
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

      return null;
    }
  }

  animations[animation].currentFrame = nextFrame;

  return `./img/${animation}${
    animations[animation].alternate ? "2" : ""
  }-${nextFrame}.png`;
};

const animate = (prevTime = window.performance.now(), time) => {
  requestAnimationFrame((time) => animate(prevTime, time));

  const timeSinceLastLoop = time - prevTime;

  const enoughTimeHasPassed = timeSinceLastLoop > fpsInterval;
  if (enoughTimeHasPassed) {
    // Get ready for next frame by setting previous time to time right now
    prevTime = time - (timeSinceLastLoop % fpsInterval);

    ctx.clearRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
    sprite.src = getNextSprite(currentAnimation) || sprite.src;
    ctx.drawImage(sprite, 0, 0);
  }
};

export const setupCanvas = () => {
  canvas = document.getElementById("canvas");
  canvas.width = CANVAS.WIDTH;
  canvas.height = CANVAS.HEIGHT;

  ctx = canvas.getContext("2d");
  sprite = new Image();
  sprite.src = getNextSprite(currentAnimation) || sprite.src;

  animate();
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
