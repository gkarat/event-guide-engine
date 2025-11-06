import chalk from "chalk";
import ora from "ora";
import path from "path";
import fs from "fs-extra";
import { simpleGit } from "simple-git";
import { validateProjectName } from "../utils/validation.js";

const REPO_URL = "https://github.com/gkarat/event-guide-engine.git";
const APP_DIR = "app";
const INITIAL_VERSION = "v0.1.0";

export async function scaffold(projectName: string) {
  console.log(chalk.bold.cyan("\nEvent Guide Scaffolder\n"));

  // Validate project name
  const validation = validateProjectName(projectName);
  if (validation !== true) {
    console.error(chalk.red(validation));
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), projectName);

  // Check if directory exists
  if (await fs.pathExists(targetDir)) {
    console.error(chalk.red(`Directory "${projectName}" already exists!`));
    process.exit(1);
  }

  // Step 1: Clone repository
  const spinner = ora("Cloning Event Guide template...").start();

  try {
    const git = simpleGit();
    const tempDir = path.join(targetDir, ".temp-clone");

    // Clone entire repo to temp
    await git.clone(REPO_URL, tempDir, ["--depth", "1"]);

    // Copy only app directory
    const appSource = path.join(tempDir, APP_DIR);
    await fs.copy(appSource, targetDir);

    // Remove temp directory
    await fs.remove(tempDir);

    spinner.succeed("Template cloned");
  } catch (error) {
    spinner.fail("Failed to clone template");
    throw error;
  }

  spinner.start("Setting up version tracking...");

  // Step 2: Initialize git with upstream
  spinner.start("Initializing git repository...");

  try {
    const git = simpleGit(targetDir);
    await git.init();
    await git.addRemote("upstream", REPO_URL);
    await git.add(".");
    await git.commit("Initial commit from scaffold");

    spinner.succeed("Git repository initialized");
  } catch (error) {
    spinner.fail("Failed to initialize git");
    throw error;
  }

  // Step 3: Check .event-guide-version file
  const versionFile = path.join(targetDir, ".event-guide-version");
  if (!(await fs.pathExists(versionFile))) {
    console.error(chalk.red("Version file not found"));
    process.exit(1);
  }

  const version = (await fs.readFile(versionFile, "utf-8")).trim();

  // Step 4: Success message
  console.log(
    chalk.green.bold(
      `\nYour Event Guide instance is ready! Version: ${version}\n`
    )
  );
  console.log(chalk.dim("Next steps:\n"));
  console.log(chalk.cyan(`  cd ${projectName}`));
  console.log(chalk.cyan(`  # 1. Edit config/instance.ts with your settings`));
  console.log(chalk.cyan(`  # 2. Copy .env.example to .env and configure`));
  console.log(chalk.cyan(`  # 3. Replace logos in public/media/`));
  console.log(chalk.cyan(`  pnpm install`));
  console.log(chalk.cyan(`  pnpm dev`));
  console.log(
    chalk.dim(
      "\nThen visit http://localhost:3000/admin to create your first user\n"
    )
  );
}
