import { Config } from './config';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class RKE2RancherInstaller {
  constructor(private config: Config) {}

  async install() {
    await this.installRKE2();
    await this.installCertManager();
    await this.installRancher();
  }

  private async installRKE2() {
    console.log('Installing RKE2...');
    
    // Create necessary directories
    await execAsync('mkdir -p /etc/rancher/rke2');
    await execAsync('mkdir -p /var/lib/rancher/rke2/agent/images/');

    // Create config file
    const configPath = '/etc/rancher/rke2/config.yaml';
    let configContent = `cluster-name: ${this.config.clusterName}\n`;
    configContent += `tls-san:\n${this.config.tlsSan.map(san => `  - "${san}"`).join('\n')}\n`;
    configContent += `node-name: ${this.config.clusterName}-master${this.config.nodeNumber || 1}\n`;

    if (!this.config.isFirstServer) {
      configContent += `server: https://${this.config.serverIp}:9345\n`;
      configContent += `token: ${this.config.token}\n`;
    }

    fs.writeFileSync(configPath, configContent);

    // Download and install RKE2
    const installScript = path.join(this.config.artifactsDir, 'install.sh');
    await execAsync(`INSTALL_RKE2_VERSION=${this.config.rke2Version} INSTALL_RKE2_ARTIFACT_PATH=${this.config.artifactsDir} sh ${installScript}`);

    // Enable and start RKE2 service
    await execAsync('systemctl enable rke2-server.service');
    await execAsync('systemctl start rke2-server.service');

    console.log('RKE2 installed successfully');
  }

  private async installCertManager() {
    console.log('Installing Cert-Manager...');
    
    // Install Helm if not present
    await this.ensureHelmInstalled();

    // Install Cert-Manager
    const chartPath = path.join(this.config.artifactsDir, `cert-manager-${this.config.certManagerVersion}.tgz`);
    let installCmd = `helm install cert-manager ${chartPath} --namespace cert-manager --create-namespace --set installCRDs=true`;
    
    if (this.config.quayMirrorRepo) {
      installCmd += ` --set image.repository=${this.config.quayMirrorRepo}/jetstack/cert-manager-controller`;
      installCmd += ` --set webhook.image.repository=${this.config.quayMirrorRepo}/jetstack/cert-manager-webhook`;
      installCmd += ` --set cainjector.image.repository=${this.config.quayMirrorRepo}/jetstack/cert-manager-cainjector`;
    }

    await execAsync(installCmd);
    console.log('Cert-Manager installed successfully');
  }

  private async installRancher() {
    console.log('Installing Rancher...');
    
    // Install Helm if not present
    await this.ensureHelmInstalled();

    // Install Rancher
    const chartPath = path.join(this.config.artifactsDir, `rancher-${this.config.rancherVersion}.tgz`);
    let installCmd = `helm install rancher ${chartPath} --namespace cattle-system --create-namespace`;
    
    if (this.config.dockerMirrorRepo) {
      installCmd += ` --set rancherImage=${this.config.dockerMirrorRepo}/rancher/rancher`;
      installCmd += ` --set systemDefaultRegistry=${this.config.dockerMirrorRepo}`;
    }

    await execAsync(installCmd);
    console.log('Rancher installed successfully');
  }

  private async ensureHelmInstalled() {
    try {
      await execAsync('helm version');
    } catch (error) {
      console.log('Helm not found, installing...');
      const helmInstallScript = path.join(this.config.artifactsDir, 'get_helm.sh');
      await execAsync(`sh ${helmInstallScript}`);
    }
  }
}