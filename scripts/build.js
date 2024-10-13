import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";

import esbuild from "esbuild";
import { copy } from "esbuild-plugin-copy";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const ESBUILD_SHARED_CONFIG = {
  format: "esm",
  target: "esnext",
  bundle: true,
  external: ["@altv/shared", "@altv/server", "@altv/client", "@altv/natives"],
  minify: true,
};

const RESOURCES = [
  { name: "core", isView: false },
  { name: "example", isView: true },
];

RESOURCES.forEach(async (resource) => {
  /**
   * Remove old resources
   */
  rmSync(join(rootDir, "resources", resource.name), {
    recursive: true,
    force: true,
  });

  /**
   * Get resource path
   */
  const resourcePath = join(
    rootDir,
    resource.isView ? "src/views" : "src",
    resource.name
  );

  /**
   * Server
   */
  await esbuild.build({
    entryPoints: [join(resourcePath, "server", "index.ts")],
    outfile: join(rootDir, "resources", resource.name, "server", "index.js"),
    ...ESBUILD_SHARED_CONFIG,
    platform: "node",
    plugins: [
      copy({
        assets: {
          from: join(resourcePath, "resource.toml"),
          to: "../resource.toml",
        },
      }),
    ],
  });

  /**
   * Client
   */
  await esbuild.build({
    entryPoints: [join(resourcePath, "client", "index.ts")],
    outfile: join(rootDir, "resources", resource.name, "client", "index.js"),
    ...ESBUILD_SHARED_CONFIG,
    platform: "browser",
  });

  if (!resource.isView) return;

  /**
   * WebView
   */
  spawnSync(
    "parcel",
    [
      "build",
      "--public-url",
      "./",
      "--no-source-maps",
      "--dist-dir",
      join(rootDir, "resources", resource.name, "client", "html"),
      join(resourcePath, "index.html"),
    ],
    { stdio: ["ignore", "ignore", "inherit"] }
  );
});
