#! /usr/bin/env node

import { Command } from "commander";

const program = new Command();

program.argument("<filepath>").action((filepath) => {
  console.log(filepath);
});
