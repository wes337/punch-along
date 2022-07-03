import { getRandomNumberBetween, toCamelCase } from "./utils.js";
import { setAnimation, getAnimationDuration } from "./animation.js";
import {
  MOVES,
  PARAMS,
  DEFAULT_COMBO_PARAMS,
  COMBO_GENERATED_ID,
  COMBO_PROGRESS_BAR_ID,
} from "./constants.js";

export const addOrRemoveMovesFromComboParams = (
  comboParams = DEFAULT_COMBO_PARAMS,
  moveNumber,
  moveName,
  moveAllowed
) => {
  let updatedParams = comboParams;

  const offenseOrDefense = Object.values(MOVES.OFFENSE).includes(moveName)
    ? PARAMS.MOVES.OFFENSE
    : PARAMS.MOVES.DEFENSE;

  if (moveAllowed) {
    updatedParams.moves[offenseOrDefense] = [
      ...new Set([...updatedParams.moves[offenseOrDefense], moveNumber]),
    ];
  } else {
    updatedParams.moves[offenseOrDefense] = updatedParams.moves[
      offenseOrDefense
    ].filter((move) => move !== moveNumber);
  }

  return updatedParams;
};

export const getAllAllowedMoves = (comboParams = DEFAULT_COMBO_PARAMS) => {
  const allowedOffenseMoves = Object.entries(MOVES.OFFENSE)
    .map(
      ([offenseNumber, offenseName]) =>
        comboParams.moves[PARAMS.MOVES.OFFENSE].includes(offenseNumber) &&
        offenseName
    )
    .filter(Boolean);

  const allowedDefenseMoves = Object.entries(MOVES.DEFENSE)
    .map(
      ([defenseNumber, defenseName]) =>
        comboParams.moves[PARAMS.MOVES.DEFENSE].includes(defenseNumber) &&
        defenseName
    )
    .filter(Boolean);

  const allAllowedMoves = [...allowedOffenseMoves, ...allowedDefenseMoves];

  return allAllowedMoves;
};

export const getRandomMove = (comboParams = DEFAULT_COMBO_PARAMS) => {
  const allAllowedMoves = getAllAllowedMoves(comboParams);

  const randomMoveNumber = getRandomNumberBetween(
    0,
    allAllowedMoves.length - 1
  );

  return allAllowedMoves[randomMoveNumber];
};

export const generateCombo = (comboParams = DEFAULT_COMBO_PARAMS) => {
  const { numberOfMoves, moves } = comboParams;

  const combo = [];

  const noMovesAllowed =
    moves[PARAMS.MOVES.OFFENSE].length === 0 &&
    moves[PARAMS.MOVES.DEFENSE].length === 0;

  if (noMovesAllowed) {
    return combo;
  }

  while (combo.length < numberOfMoves) {
    const randomMove = getRandomMove(comboParams);

    if (randomMove) {
      combo.push(randomMove);
    }
  }

  return combo;
};

export const animateGeneratedCombo = (combo) => {
  return new Promise((resolve) => {
    let animationDelay = 0;

    combo.forEach((move, index) => {
      const previousMove = combo[index - 1];

      const previousAnimationLength =
        // No delay if this is the first animation
        previousMove ? getAnimationDuration(toCamelCase(previousMove)) : 0;

      animationDelay += previousAnimationLength;

      setTimeout(() => {
        const animation = toCamelCase(move);
        setAnimation(animation);
        markMoveAsInProgressOnList(animation);

        const isLastAnimation = index === combo.length - 1;
        if (isLastAnimation) {
          setTimeout(() => {
            resolve();
          }, getAnimationDuration(animation));
        }
      }, animationDelay);
    });
  });
};

export const updateComboProgressBar = () => {
  const totalMoves = document.querySelectorAll(`#${COMBO_GENERATED_ID} ul li`);
  const completedMoves = document.querySelectorAll(
    `#${COMBO_GENERATED_ID} ul li.is-success`
  );

  const comboProgressBar = document.getElementById(COMBO_PROGRESS_BAR_ID);
  comboProgressBar.value = (completedMoves.length / totalMoves.length) * 100;
};

export const markMoveAsInProgressOnList = (move) => {
  const moveListElement = document.querySelector(
    `.${move}:not(.is-success, .is-warning)`
  );
  moveListElement?.classList.add("is-warning");
};

export const markMoveAsCompletedOnList = (move) => {
  const moveListElement = document.querySelector(`.${move}:not(.is-success)`);
  moveListElement?.classList.remove("is-warning");
  moveListElement?.classList.add("is-success");
  updateComboProgressBar();
};

export const updateGeneratedCombo = (combo) => {
  const comboGenerated = document.getElementById(COMBO_GENERATED_ID);
  comboGenerated.innerHTML = "";

  const comboList = document.createElement("ul");
  comboList.classList.add("nes-list", "is-disc");

  combo.forEach((move) => {
    const comboMove = document.createElement("li");
    comboMove.classList.add(toCamelCase(move), "nes-text");
    comboMove.textContent = move;
    comboList.appendChild(comboMove);
  });

  comboGenerated.appendChild(comboList);
};
