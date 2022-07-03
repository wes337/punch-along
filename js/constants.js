export const COMBO_GENERATOR_FORM_ID = "comboGenerator";
export const COMBO_GENERATED_ID = "combo";
export const COMBO_SUBMIT_BUTTON_ID = "comboSubmit";
export const COMBO_RESET_BUTTON_ID = "comboReset";
export const COMBO_PROGRESS_BAR_ID = "comboProgress";
export const MOVE_CHECKBOX_CLASS = "move";
export const INPUT_CLASS = "input";

export const DEFAULT_FPS = 4;

export const CANVAS = {
  WIDTH: 120,
  HEIGHT: 180,
};

export const PARAMS = {
  NUMBER_OF_MOVES: "numberOfMoves",
  COUNTDOWN: "countDown",
  SPEED: "speed",
  MOVES: {
    OFFENSE: "offense",
    DEFENSE: "defense",
  },
};

export const DEFAULT_COMBO_PARAMS = {
  [PARAMS.NUMBER_OF_MOVES]: 3,
  [PARAMS.COUNTDOWN]: true,
  [PARAMS.SPEED]: DEFAULT_FPS,
  moves: {
    [PARAMS.MOVES.OFFENSE]: Object.keys(offense),
    [PARAMS.MOVES.DEFENSE]: Object.keys(defense),
  },
};

export const MOVES = {
  OFFENSE: {
    1: "Jab",
    2: "Cross",
    3: "Lead hook",
    4: "Rear hook",
    5: "Lead uppercut",
    6: "Rear uppercut",
  },
  DEFENSE: {
    1: "Slip",
    2: "Roll",
    3: "Parry",
    4: "Block",
    5: "Bob and weave",
  },
};
