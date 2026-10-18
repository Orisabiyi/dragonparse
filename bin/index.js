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

  if (
    currentFile.length === 2 &&
    currentFile.startsWith("{") &&
    currentFile.endsWith("}")
  ) {
    console.log(`File ${filepath} is a valid json document`);
    process.exit(0);
  } else {
    const pairs = currentFile
      .slice(1, -1)
      .split(",")
      .map((pair) => pair.split(":"));

    const flattenPairs = pairs.flat();

    // console.log(flattenPairs, pairs);

    if (!flattenPairs[flattenPairs.length - 1]) {
      console.log("Remove the trailing comma");
      process.exit(1);
    }

    const badJsonKey = [];

    let obj = {};

    pairs.forEach(([key, value]) => {
      if (!/^\s*"[^"]*"\s*$/.test(key)) {
        badJsonKey.push(key);
      }

      key = key.trim().replace(/^"|"$/g, "");
      value = value.trim().replace(/^"|"$/g, "");

      if (value === "true") {
        obj[key] = true;
      } else if (value === "false") {
        obj[key] = false;
      } else if (value === "null") {
        obj[key] = null;
      } else {
        obj[key] = value;
      }
    });

    if (badJsonKey.length > 0) {
      console.log(
        `The following ${badJsonKey.length > 1 ? "keys are" : "key is"} bad: ${badJsonKey.join(",").trim()}`,
      );
      process.exit(1);
    }

    if (
      currentFile.startsWith("{") &&
      currentFile.endsWith("}") &&
      pairs.flat().length >= 1
    ) {
      console.log(`File ${filepath} is a valid json document.`, obj);
      process.exit(0);
    }
  }
});

program.parse();
