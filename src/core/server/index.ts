import "./utils/ipc";
import * as alt from "@altv/server";

import { connectLocalClient } from "./utils/reconnect";

connectLocalClient()

const spawnCoors = {
  x: 36.19486618041992,
  y: 859.3850708007812,
  z: 197.71343994140625,
};

alt.Events.onPlayerConnect(({ player }) => {
  alt.log(`Player connected: ${player.name}`);

  player.model = "mp_m_freemode_01";
  player.health = 200;
  player.armour = 0;

  player.spawn(new alt.Vector3(spawnCoors), 0);
});
