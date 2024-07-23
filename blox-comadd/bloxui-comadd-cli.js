#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();

// Helper function to simulate progress
const simulateProgress = async (spinner, message, delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      spinner.text = message;
      resolve();
    }, delay);
  });
};

// Init command
program
  .command('init')
  .description('Initialize BloxUI')
  .action(async () => {
    const { default: inquirer } = await import('inquirer');
    const { default: ora } = await import('ora');
    const { default: chalk } = await import('chalk');

    const { confirmInit } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmInit',
        message: 'Do you want to initialize BloxUI in this directory?',
        default: true
      }
    ]);

    if (!confirmInit) {
      console.log(chalk.yellow('Initialization aborted.'));
      return;
    }

    const spinner = ora('Starting BloxUI initialization...').start();

    await simulateProgress(spinner, 'Creating configuration file...', 2000);

    const configPath = path.join(process.cwd(), 'bloxui.config.js');
    if (fs.existsSync(configPath)) {
      spinner.fail(chalk.red('BloxUI is already initialized.'));
    } else {
      fs.writeFileSync(configPath, 'module.exports = {};');

      await simulateProgress(spinner, 'Setting up directories...', 2000);
      if (!fs.existsSync(path.join(process.cwd(), 'components'))) {
        fs.mkdirSync(path.join(process.cwd(), 'components'));
      }

      await simulateProgress(spinner, 'Finalizing setup...', 2000);

      spinner.succeed(chalk.green('BloxUI initialization complete.'));

      console.log(chalk.cyan('\nAwesome! BloxUI is now initialized.'));
      console.log(chalk.green('You can start adding templates and components using the following commands:'));
      console.log(chalk.yellow('\nTo add a new component:'));
      console.log(chalk.blue('bloxui-comadd add <component-name>'));
      console.log(chalk.yellow('\nTo explore available templates, check out our documentation or the CLI Tools library.'));
      console.log(chalk.green('Happy coding with BloxUI!'));

    }
  });

// Add command
program
  .command('add <component>')
  .description('Add a BloxUI component')
  .action(async (component) => {
    const { default: ora } = await import('ora');
    const { default: chalk } = await import('chalk');

    const spinner = ora(`Adding component ${chalk.cyan(component)}...`).start();

    const componentTemplatePath = path.join(__dirname, 'components', `${component}.js`);
    const destinationPath = path.join(process.cwd(), 'components','blox',`${component}.js`);

    await simulateProgress(spinner, `Locating template for ${component}...`, 2000);

    if (!fs.existsSync(componentTemplatePath)) {
      spinner.fail(chalk.red(`Component ${component} not found.`));
      process.exit(1);
    }

    await simulateProgress(spinner, `Copying ${component} template to destination...`, 2000);

    if (!fs.existsSync(path.dirname(destinationPath))) {
      fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
    }

    fs.copyFileSync(componentTemplatePath, destinationPath);
    spinner.succeed(chalk.green(`Component ${component} added to ${destinationPath}`));
  });

program.parse(process.argv);
