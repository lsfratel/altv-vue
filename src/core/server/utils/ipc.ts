import * as alt from "@altv/server";
import fs from "node:fs";

const FILE_NAME = "ipc.txt";

function onChange() {
  const content = fs.readFileSync(FILE_NAME, { encoding: "utf-8" });
  const contents = content.split("\n");
  const lastLine = contents[contents.length - 1].replace(/\n/g, "");
  alt.log(`FILE CONTENT: ${lastLine}`);

  switch (lastLine) {
    case "kick-all":
      alt.log(`Invoking IPC Event 'kick-all'`);
      alt.Player.all.forEach((player) => {
        player.kick("Restarting Server");
      });
      break;
  }
}

if (alt.isDebug) {
  if (fs.existsSync(FILE_NAME)) {
    fs.rmSync(FILE_NAME);
  }

  fs.writeFileSync(FILE_NAME, "");
  fs.watch(FILE_NAME, onChange);
  alt.log(`Listening for IPC Events in Debug Mode`);
}
