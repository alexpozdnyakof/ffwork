import { createApp, h, hString, hFragment } from "runtime/dist/fwork";
import { findWinline } from "./find-winline";

const defaultFieldSize = 3;

const state = {
  turn: "x",
  winline: null,
  winner: null,
  started: false,
  completed: false,
  fieldSize: defaultFieldSize,
  marks: new Array(defaultFieldSize * defaultFieldSize).fill(null),
};

const reducers = {
  mark: (state, position) => {
    const marks = [...state.marks];
    marks[position] = state.turn;
    const winline = findWinline(marks, state.fieldSize);

    return {
      ...state,
      marks,
      started: true,
      winner: winline ? (state.turn === "x" ? "Player 1" : "Player 2") : null,
      winline: winline ?? null,
      completed:
        marks.filter(Boolean).length === state.fieldSize * state.fieldSize ||
        winline,
      turn: { x: "o", o: "x" }[state.turn],
    };
  },
  changeSize: (state, size) => ({
    ...state,
    fieldSize: size,
    marks: new Array(size * size).fill(null),
  }),
  restart: (state) => ({
    ...state,
    started: false,
    winline: null,
    winner: null,
    marks: new Array(state.fieldSize * state.fieldSize).fill(null),
    completed: false,
    turn: "x",
  }),
};

function App(state, emit) {
  return h("div", { class: "app" }, [
    h("h1", { class: "game-title" }, ["TicTacToe"]),
    SettingsForm(state, emit),
    Field(state, emit),
    state.winline ? hString(`Winner ${state.winner}`) : null,
    state.winline || state.completed
      ? h("button", { on: { click: () => emit("restart") } }, ["Play again"])
      : null,
  ]);
}

function SettingsForm(state, emit) {
  return hFragment([
    h(
      "form",
      {
        class: "game-settings-form",
        on: {
          change: (event) => {
            if (event.target.name === "size") {
              emit("changeSize", Number(event.target.value));
            }
          },
        },
      },
      [
        h("div", { class: "form-group" }, [
          h("label", { for: "size" }, ["Field size"]),
          h(
            "select",
            { id: "size", name: "size", disabled: state.started },
            [3, 5, 7, 9].map((value) =>
              h(
                "option",
                {
                  value: value.toString(),
                  selected: value === state.fieldSize,
                },
                [`${value}x${value}`]
              )
            )
          ),
        ]),
      ]
    ),
  ]);
}

function Field(state, emit) {
  return h(
    "div",
    {
      class: ["game-field"],
      style: {
        "--field-size": state.fieldSize,
      },
    },
    [
      hFragment(
        state.marks.map((value, idx) =>
          h(
            "button",
            {
              on: { click: () => emit("mark", idx) },
              class: [
                "game-field__mark",
                state.winline && state.winline.includes(idx)
                  ? "mark-winner"
                  : null,
              ],
              disabled: typeof value === "string",
            },
            [
              (() => {
                if (value) return hString(value);
              })(),
            ]
          )
        )
      ),
    ]
  );
}

const app = createApp({ state, reducers, view: App });
app.mount(document.querySelector("#root"));
