import {
  generateCombo,
  updateGeneratedCombo,
  animateGeneratedCombo,
  addOrRemoveMovesFromComboParams,
} from "./combos.js";
import {
  MOVES,
  COMBO_GENERATED_ID,
  COMBO_GENERATOR_FORM_ID,
  MOVE_CHECKBOX_CLASS,
  DEFAULT_FPS,
  PARAMS,
  DEFAULT_COMBO_PARAMS,
  COMBO_SUBMIT_BUTTON_ID,
  COMBO_RESET_BUTTON_ID,
  COMBO_PROGRESS_BAR_ID,
  INPUT_CLASS,
} from "./constants.js";
import { setupCanvas, setSpeed } from "./animation.js";

const startCountDown = (comboParams = DEFAULT_COMBO_PARAMS) => {
  return new Promise((resolve) => {
    const countdownDisabled = !comboParams[PARAMS.COUNTDOWN];
    if (countdownDisabled) {
      resolve();
    } else {
      const comboGenerated = document.getElementById(COMBO_GENERATED_ID);
      comboGenerated.innerHTML = "";

      const countDown = document.createElement("div");
      countDown.classList.add("countdown");
      comboGenerated.appendChild(countDown);

      for (let i = 1; i <= 5; i += 1) {
        countDown.innerHTML = "Ready?";
        setTimeout(() => {
          if (i === 5) {
            return resolve();
          } else {
            countDown.innerHTML = i === 4 ? "Go!" : `${i}...`;
          }
        }, 1000 * i);
      }
    }
  });
};

const setSubmitButtonDisabled = (disabled) => {
  const submitComboButton = document.getElementById(COMBO_SUBMIT_BUTTON_ID);
  submitComboButton.disabled = disabled;
  submitComboButton.classList.toggle("is-primary");
  submitComboButton.classList.toggle("is-disabled");
};

const handleSubmit = (event) => {
  event.preventDefault(); // Prevent default form submit

  const form = event.target;

  let comboParams = {
    ...DEFAULT_COMBO_PARAMS,
  };

  for (let i = 0; i < form.length; i += 1) {
    const { id, value, checked, type, parentElement } = form[i];

    const isMoveParam =
      parentElement?.classList.contains(MOVE_CHECKBOX_CLASS) &&
      type === "checkbox";

    if (isMoveParam) {
      comboParams = addOrRemoveMovesFromComboParams(
        comboParams,
        value,
        id,
        checked
      );
    }

    if (comboParams.hasOwnProperty(id)) {
      comboParams[id] = type === "checkbox" ? checked : value;
    }
  }

  const combo = generateCombo(comboParams);

  // Disable submit button while a combo is in progress
  setSubmitButtonDisabled(true);

  const comboWrapper = document.querySelector(".comboWrapper");
  comboWrapper.scrollIntoView();

  startCountDown(comboParams).then(() => {
    const comboProgressBar = document.getElementById(COMBO_PROGRESS_BAR_ID);
    comboProgressBar.style.visibility = "visible";

    updateGeneratedCombo(combo);
    animateGeneratedCombo(combo).then(() => {
      // Combo complete, enable submit button
      setSubmitButtonDisabled(false);
    });
  });
};

const handleSpeedChange = (event) => {
  const speed = event.target.value;
  setSpeed(speed);
};

const addEventListeners = () => {
  const comboForm = document.getElementById(COMBO_GENERATOR_FORM_ID);
  comboForm.addEventListener("submit", handleSubmit);

  const speedInput = document.getElementById(PARAMS.SPEED);
  speedInput.addEventListener("change", handleSpeedChange);

  const comboResetButton = document.getElementById(COMBO_RESET_BUTTON_ID);
  comboResetButton.addEventListener("click", resetAllParamsToDefault);
};

const createCheckboxForMove = (parent, value, id) => {
  const checkboxWrapper = document.createElement("label");
  checkboxWrapper.classList.add(MOVE_CHECKBOX_CLASS, INPUT_CLASS);

  const input = document.createElement("input");
  input.classList.add("nes-checkbox", "is-dark");
  input.type = "checkbox";
  input.id = id;
  input.value = value;
  input.checked = true;

  const label = document.createElement("span");
  label.textContent = id;

  checkboxWrapper.appendChild(input);
  checkboxWrapper.appendChild(label);

  parent.appendChild(checkboxWrapper);
};

const createCheckboxesForMoves = () => {
  const offenseSelection = document.getElementById(PARAMS.MOVES.OFFENSE);

  for (const [offenseNumber, offenseName] of Object.entries(MOVES.OFFENSE)) {
    createCheckboxForMove(offenseSelection, offenseNumber, offenseName);
  }

  const defenseSelection = document.getElementById(PARAMS.MOVES.DEFENSE);

  for (const [defenseNumber, defenseName] of Object.entries(MOVES.DEFENSE)) {
    createCheckboxForMove(defenseSelection, defenseNumber, defenseName);
  }
};

const resetAllParamsToDefault = () => {
  const speedInput = document.getElementById(PARAMS.SPEED);
  speedInput.value = DEFAULT_FPS;
  setSpeed(DEFAULT_FPS);

  const numberOfMovesInput = document.getElementById(PARAMS.NUMBER_OF_MOVES);
  numberOfMovesInput.value = DEFAULT_COMBO_PARAMS[PARAMS.NUMBER_OF_MOVES];

  const enableCountdownCheckbox = document.getElementById(PARAMS.COUNTDOWN);
  enableCountdownCheckbox.checked = true;

  const moveCheckboxes = document.querySelectorAll(
    `.${MOVE_CHECKBOX_CLASS} .nes-checkbox`
  );
  moveCheckboxes.forEach((moveCheckbox) => (moveCheckbox.checked = true));

  const clickGenerateToBegin = document.createElement("div");
  clickGenerateToBegin.classList.add("nes-balloon", "from-left");
  clickGenerateToBegin.textContent = "Click generate to begin";

  const comboGenerated = document.getElementById(COMBO_GENERATED_ID);
  comboGenerated.innerHTML = "";
  comboGenerated.appendChild(clickGenerateToBegin);

  const comboProgressBar = document.getElementById(COMBO_PROGRESS_BAR_ID);
  comboProgressBar.value = 0;
  comboProgressBar.style.visibility = "hidden";
};

const main = () => {
  createCheckboxesForMoves();
  addEventListeners();
  setupCanvas();
  resetAllParamsToDefault();
};

main();
