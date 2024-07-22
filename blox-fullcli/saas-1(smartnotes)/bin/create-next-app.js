#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs-extra');
const path = require('path');

async function main() {
  const ora = (await import('ora')).default;
  const chalk = (await import('chalk')).default;
  const program = new Command();

  program
    .name('blox-create-app')
    .version('1.0.0')
    .arguments('<project-directory>')
    .action(async (projectDirectory) => {
      const targetPath = path.resolve(process.cwd(), projectDirectory);
      const templatePath = path.resolve(__dirname, '../template/my-nextjs-template');

      const spinner1 = ora({
        text: 'Creating project directory...',
        spinner: 'dots'
      }).start();

      try {
        await fs.ensureDir(targetPath);
        spinner1.succeed('Project directory created.');
        
        const spinner2 = ora({
          text: 'Copying template files...',
          spinner: 'dots'
        }).start();

        await fs.copy(templatePath, targetPath);
        spinner2.succeed('Template files copied.');

        const spinner3 = ora({
          text: 'Finalizing setup...',
          spinner: 'dots'
        }).start();

        // Simulate some final setup steps, e.g., installing dependencies
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate a delay
        spinner3.succeed('Setup finalized.');

        console.log(chalk.green('All done! Your new project is ready.'));
        console.log(`\nTo get started, run:\n`);
        console.log(`  ${chalk.cyan(`cd ${projectDirectory}`)}`);
        console.log(`  ${chalk.cyan('npm install')}`);
        console.log(`  ${chalk.cyan('npm run dev')}`);
      } catch (err) {
        spinner1.fail('Failed to create project directory.');
        console.error(err.message);
      }
    });

  program.parse(process.argv);
}

main().catch((err) => console.error(err));
