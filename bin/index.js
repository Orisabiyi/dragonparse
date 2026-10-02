#! /usr/bin/env node

import { Command } from "commander";
import path from "path";
import fs from "fs";

const program = new Command();

program.argument("<filepath>").action(async (filepath) => {
  const resolvedPath = path.resolve(filepath);
  const readFile = fs.createReadStream(resolvedPath, { encoding: "utf8" });

  let currentFileArray;

  for await (const chunk of readFile) {
    currentFileArray = chunk.split("");
  }

  if (!currentFileArray || !currentFileArray.length) {
    console.error("Error: the provider file is empty, not a JSON document");
    process.exit(1);
  }

  if (currentFileArray[0] !== "{") {
    console.error("Error: the provider file is not a JSON document");
    process.exit(1);
  }

  // for (let index = 0; index <= currentFileArray.length; index++) {
  //   if (index === 0 && currentFileArray[index] !== "{") {
  //     console.error("Error: the provider file is not a JSON document");
  //     process.exit(1);
  //   }
  // }

  console.log(currentFileArray);
});

program.parse();
