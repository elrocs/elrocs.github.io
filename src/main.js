import { Sand } from "./engine/elements/Sand.js";
import { setupInput } from "./utils/InputHandler.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = 512;
const HEIGHT = 512;
const PIXEL_SIZE = 4;

canvas.width = WIDTH;
canvas.height = HEIGHT;

const ROWS = HEIGHT / PIXEL_SIZE;
const COLS = WIDTH / PIXEL_SIZE;

const grid = Array.from({ length: ROWS }, () =>
  Array(COLS).fill(null)
);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cell = grid[y][x];
      if (cell) {
        ctx.fillStyle = cell.color;
        ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
      }
    }
  }
}

function updateGrid() {
  // Loop from bottom to top so particles fall correctly
  for (let y = ROWS - 1; y >= 0; y--) {
    for (let x = 0; x < COLS; x++) {
      const cell = grid[y][x];
      if (cell && typeof cell.update === "function") {
        cell.update(grid);
      }
    }
  }
}

function createParticle(x, y) {
  grid[y][x] = new Sand(x, y);
}

setupInput(canvas, PIXEL_SIZE, COLS, ROWS, createParticle);

function loop() {
  updateGrid();
  updateGrid();
  draw();
  requestAnimationFrame(loop);
}

loop();
