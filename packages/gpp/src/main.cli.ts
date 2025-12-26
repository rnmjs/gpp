#!/usr/bin/env node
import childProcess from "node:child_process";
import os from "node:os";
import process from "node:process";

process.on("SIGINT", () => {
  // do nothing, just for blocking
});
process.on("SIGTERM", () => {
  // do nothing, just for blocking
});

async function executeCommand(command: string, args: string[]) {
  return await new Promise<number>((resolve, reject) => {
    const child = childProcess.spawn(command, args, {
      stdio: "inherit",
    });

    child.on("close", (code, signal) => {
      resolve(code ?? (signal ? 128 + os.constants.signals[signal] : 1));
    });

    child.on("error", (error) => {
      reject(error);
    });
  });
}

process.exit(
  (await executeCommand("git", ["pull"])) ||
    (await executeCommand("git", ["push"])),
);
