#!/usr/bin/env node

import { Command } from "commander";
import { scaffold } from "./commands/scaffold.js";
import { update } from "./commands/update.js";
import chalk from "chalk";

const program = new Command();

program
  .name("create-event-guide-app")
  .description("CLI to scaffold and manage Event Guide instances")
  .version("0.1.0");

// Scaffold command (default)
program
  .argument("[project-name]", "Name of the project directory")
  .description("Create a new Event Guide instance")
  .action(async (projectName) => {
    if (!projectName) {
      console.error(chalk.red("Error: Project name is required"));
      console.log(
        chalk.dim("Usage: npx create-event-guide-app <project-name>")
      );
      process.exit(1);
    }

    try {
      await scaffold(projectName);
    } catch (error) {
      console.error(
        chalk.red("Error:"),
        error instanceof Error ? error.message : error
      );
      process.exit(1);
    }
  });

// Update command
program
  .command("update")
  .description("Update existing Event Guide instance from upstream")
  .action(async () => {
    try {
      await update();
    } catch (error) {
      console.error(
        chalk.red("Error:"),
        error instanceof Error ? error.message : error
      );
      process.exit(1);
    }
  });

program.parse();
