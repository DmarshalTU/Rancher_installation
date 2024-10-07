import { Command } from 'commander';
import { Config } from '../core/config';
import { RKE2RancherInstaller } from '../core/installer';
import * as inquirer from 'inquirer';

const program = new Command();

program
  .option('-n, --cluster-name <name>', 'Cluster name')
  .option('-v, --rke2-version <version>', 'RKE2 version')
  .option('--rancher-version <version>', 'Rancher version')
  .option('--cert-manager-version <version>', 'Cert-Manager version')
  .option('--offline', 'Offline installation')
  .option('-a, --artifacts-dir <path>', 'Artifacts directory')
  .option('--docker-mirror-repo <url>', 'Docker mirror repository')
  .option('--quay-mirror-repo <url>', 'Quay mirror repository')
  .parse(process.argv);

const options = program.opts();

async function promptForMissingOptions(options: any): Promise<Config> {
  const questions = [];

  if (!options.clusterName) {
    questions.push({
      type: 'input',
      name: 'clusterName',
      message: 'Enter the cluster name:',
    });
  }

  if (!options.rke2Version) {
    questions.push({
      type: 'input',
      name: 'rke2Version',
      message: 'Enter the RKE2 version:',
      default: 'v1.21.5+rke2r2',
    });
  }

  // Add more questions for missing options...

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    ...answers,
    isOffline: options.offline || false,
    isFirstServer: await promptIsFirstServer(),
    tlsSan: await promptTlsSan(),
    nodeNumber: await promptNodeNumber(),
  };
}

async function promptIsFirstServer(): Promise<boolean> {
  const answer = await inquirer.prompt({
    type: 'confirm',
    name: 'isFirstServer',
    message: 'Is this the first server to be installed?',
    default: true,
  });
  return answer.isFirstServer;
}

async function promptTlsSan(): Promise<string[]> {
  const answer = await inquirer.prompt({
    type: 'input',
    name: 'tlsSan',
    message: 'Enter FQDN and IP for the cluster certificates (space-separated):',
  });
  return answer.tlsSan.split(' ');
}

async function promptNodeNumber(): Promise<number> {
  const answer = await inquirer.prompt({
    type: 'input',
    name: 'nodeNumber',
    message: 'Enter the node number:',
    default: '1',
  });
  return parseInt(answer.nodeNumber, 10);
}

async function main() {
  const config = await promptForMissingOptions(options);
  const installer = new RKE2RancherInstaller(config);
  await installer.install();
}

main().catch(console.error);