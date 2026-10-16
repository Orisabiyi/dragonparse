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

  const currentFile = currentFileArray.join('').trim();
  console.log(currentFile.endsWith('}'));

  if (!currentFile || !currentFile.startsWith('{') || !currentFile.endsWith('}')) {
    console.log("Error: the file provided is not a valid json document");
    process.exit(1);
  }

  const pairs = currentFile.slice(1, -1).split(',').map(pair => pair.split(':'))

  if (currentFile.startsWith('{') && currentFile.endsWith('}') && pairs.flat().length <= 1) {
    console.log(`File ${filepath} is a valid json document`)
    process.exit(0)
  }

  let obj= {}

  pairs.forEach(([key, value]) => {
    console.log(key.trim(), value.trim())
    key = key.trim().replace(/^"|"$/g, '')
    value = value.trim().replace(/^"|"$/g, '')

    obj[key] = value
  })

  console.log(obj)



  // const data = Object.keys(currentFile)

  // console.log(data)

  // console.log(`${filepath} is a valid json document`)

  process.exit(0);
});

program.parse();
