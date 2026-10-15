#! /usr/bin/env node

import { Command } from "commander";
import path from "path";
import fs from "fs";

const program = new Command();

program.argument("<filepath>").action(async (filepath) => {
  const resolvedPath = path.resolve(filepath);
  const readFile = fs.createReadStream(resolvedPath, { encoding: "utf8" });

  let currentFileArray = [];

  for await (const chunk of readFile) {
    currentFileArray.push(chunk);
  }

  if (!currentFileArray.join('')) {
    console.log("Error: the file provided is not a valid json document");
    process.exit(1);
  }

  const currentFile = JSON.parse(currentFileArray.join(""));
  console.log(currentFile);

  console.log(`${filepath} is a valid json document`)

  process.exit(0);
});

program.parse();
