export interface Config {
    clusterName: string;
    rke2Version: string;
    rancherVersion: string;
    certManagerVersion: string;
    isOffline: boolean;
    artifactsDir: string;
    dockerMirrorRepo?: string;
    quayMirrorRepo?: string;
    isFirstServer: boolean;
    tlsSan: string[];
    serverIp?: string;
    token?: string;
    nodeNumber?: number;
  }