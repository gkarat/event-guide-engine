import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import { simpleGit } from "simple-git";
import fs from "fs-extra";
import path from "path";

export async function update() {
  console.log(chalk.bold.cyan("\n🔄 Event Guide Updater\n"));

  const cwd = process.cwd();
  const git = simpleGit(cwd);

  // Step 1: Verify this is an Event Guide project
  const spinner = ora("Checking project...").start();

  try {
    const versionFile = path.join(cwd, ".event-guide-version");
    if (!(await fs.pathExists(versionFile))) {
      spinner.fail("Not an Event Guide project (missing .event-guide-version)");
      process.exit(1);
    }

    const remotes = await git.getRemotes(true);
    const upstream = remotes.find((r) => r.name === "upstream");
    if (!upstream) {
      spinner.fail("No upstream remote found");
      console.log(
        chalk.dim(
          "Run: git remote add upstream https://github.com/gkarat/event-guide-engine.git"
        )
      );
      process.exit(1);
    }

    spinner.succeed("Project validated");
  } catch (error) {
    spinner.fail("Failed to validate project");
    throw error;
  }

  // Step 2: Get current version
  const currentVersion = (
    await fs.readFile(path.join(cwd, ".event-guide-version"), "utf-8")
  ).trim();

  console.log(chalk.dim(`Current version: ${currentVersion}\n`));

  // Step 3: Fetch upstream
  spinner.start("Fetching updates from upstream...");

  try {
    await git.fetch("upstream", ["--tags"]);
    spinner.succeed("Fetched upstream");
  } catch (error) {
    spinner.fail("Failed to fetch upstream");
    throw error;
  }

  // Step 4: Check for updates
  const tags = await git.tags();
  const latestTag = tags.latest;

  if (!latestTag) {
    console.log(chalk.yellow("No versions found in upstream"));
    process.exit(0);
  }

  if (latestTag === currentVersion) {
    console.log(chalk.green("✅ Already up to date!"));
    process.exit(0);
  }

  console.log(chalk.cyan(`Latest version available: ${latestTag}\n`));

  // Step 5: Show changelog (if available)
  try {
    const log = await git.log({
      from: currentVersion,
      to: latestTag,
    });

    if (log.total > 0) {
      console.log(chalk.bold("Changes:\n"));
      log.all.slice(0, 10).forEach((commit) => {
        console.log(chalk.dim(`  • ${commit.message}`));
      });
      if (log.total > 10) {
        console.log(chalk.dim(`  ... and ${log.total - 10} more commits`));
      }
      console.log();
    }
  } catch (error) {
    // Ignore changelog errors
  }

  // Step 6: Warn about database changes
  console.log(
    chalk.yellow(
      "⚠️  Warning: This update may include database schema changes."
    )
  );
  console.log(chalk.dim("   Please backup your database before proceeding.\n"));

  // Step 7: Confirm update
  const { confirm } = await prompts({
    type: "confirm",
    name: "confirm",
    message: `Update from ${currentVersion} to ${latestTag}?`,
    initial: true,
  });

  if (!confirm) {
    console.log(chalk.yellow("Update cancelled"));
    process.exit(0);
  }

  // Step 8: Check for uncommitted changes
  const status = await git.status();
  if (!status.isClean()) {
    console.log(chalk.red("\n❌ You have uncommitted changes!"));
    console.log(
      chalk.dim("Please commit or stash your changes before updating.\n")
    );
    process.exit(1);
  }

  // Step 9: Create backup branch
  const backupBranch = `backup-before-${latestTag}`;
  spinner.start(`Creating backup branch: ${backupBranch}`);

  try {
    await git.checkoutLocalBranch(backupBranch);
    await git.checkout("-");
    spinner.succeed(`Backup branch created: ${backupBranch}`);
  } catch (error) {
    spinner.fail("Failed to create backup branch");
    throw error;
  }

  // Step 10: Merge from upstream
  spinner.start(`Merging ${latestTag} from upstream...`);

  try {
    // Get current branch
    const currentBranch = await git.revparse(["--abbrev-ref", "HEAD"]);

    // Merge from upstream tag
    await git.merge([`upstream/${latestTag}`]);

    // Update version file
    await fs.writeFile(
      path.join(cwd, ".event-guide-version"),
      latestTag,
      "utf-8"
    );

    await git.add(".event-guide-version");
    await git.commit(`Update to ${latestTag}`);

    spinner.succeed("Update completed successfully!");

    console.log(chalk.green.bold("\n✅ Event Guide updated!\n"));
    console.log(chalk.dim("Next steps:\n"));
    console.log(chalk.cyan("  pnpm install  # Update dependencies"));
    console.log(chalk.cyan("  pnpm build    # Rebuild application"));
    console.log(
      chalk.dim("\nIf there were database changes, run migrations.\n")
    );
  } catch (error: any) {
    spinner.fail("Merge failed");

    if (error.message?.includes("CONFLICT")) {
      console.log(chalk.yellow("\n⚠️  Merge conflicts detected!\n"));
      console.log(chalk.dim("This likely means you modified core files."));
      console.log(chalk.dim("Please resolve conflicts manually:\n"));
      console.log(chalk.cyan("  1. Review conflicted files: git status"));
      console.log(chalk.cyan("  2. Resolve conflicts"));
      console.log(chalk.cyan("  3. git add ."));
      console.log(chalk.cyan("  4. git commit"));
      console.log(chalk.dim(`\nTo revert: git reset --hard ${backupBranch}\n`));
    } else {
      throw error;
    }
  }
}
