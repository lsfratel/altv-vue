import { spawn, spawnSync, ChildProcess } from "node:child_process";
import { appendFileSync } from "node:fs";
import Watcher from "watcher";

/** @type {ChildProcess} */
let serverProcess;
let restartDebounce = Date.now() + 0;
const fileWatch = new Watcher(["src"], {
  recursive: true,
  renameDetection: true,
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function build() {
  spawnSync("node", ["scripts/build.js"], { stdio: "inherit" });
}

async function restart() {
  if (restartDebounce > Date.now()) {
    return;
  }

  restartDebounce = Date.now() + 1000;
  appendFileSync("ipc.txt", "\r\nkick-all", "utf-8");
  await sleep(200);

  if (serverProcess) {
    try {
      serverProcess.kill();
    } catch (error) {}

    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!serverProcess.killed) {
          serverProcess.kill();
          return;
        }

        serverProcess = undefined;
        clearInterval(interval);
        resolve();
      }, 200);
    });
  }

  build();

  serverProcess = spawn("./altv-server", { stdio: "inherit" });
}

function start() {
  fileWatch.on("change", restart);
  restart();
}

start();
