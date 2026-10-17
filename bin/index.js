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

  const currentFile = currentFileArray.join("").trim();

  if (
    !currentFile ||
    !currentFile.startsWith("{") ||
    !currentFile.endsWith("}")
  ) {
    console.log("Error: the file provided is not a valid json document");
    process.exit(1);
  }

  const pairs = currentFile
    .slice(1, -1)
    .split(",")
    .map((pair) => pair.split(":"));
  const flattenPairs = pairs.flat();

  if (!flattenPairs[flattenPairs.length - 1]) {
    console.log("Remove the trailing comma");
    process.exit(1);
  }

  const badJsonKey = flattenPairs.filter(
    (item) => /^\s*"[^"]*"\s*$/.test(item) === false,
  );

  if (badJsonKey.length > 0) {
    console.log(
      `The following key(s) are bad, fix them: ${badJsonKey.map((item) => item.trim()).join(', ')}`,
    );
    process.exit(1);
  }

  if (
    currentFile.startsWith("{") &&
    currentFile.endsWith("}") &&
    pairs.flat().length <= 1
  ) {
    console.log(`File ${filepath} is a valid json document`);
    process.exit(0);
  }

  let obj = {};

  pairs.forEach(([key, value]) => {
    // console.log(key)
    key = key.trim().replace(/^"|"$/g, "");
    value = value.trim().replace(/^"|"$/g, "");

    obj[key] = value;
  });

  console.log(obj);

  // const data = Object.keys(currentFile)

  // console.log(data)

  // console.log(`${filepath} is a valid json document`)

  process.exit(0);
});

program.parse();
