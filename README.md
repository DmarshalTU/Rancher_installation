# RKE2 and Rancher Installer for Isolated Environments

This tool provides a CLI interface for DevOps engineers to set parameters and create an RKE2 cluster with Rancher in completely isolated environments without internet access. All necessary binaries and dependencies are included in the package.

## Prerequisites

- Linux-based operating system
- Bash shell

No other prerequisites are needed as all required binaries are included in the package.

## Package Contents

This package includes:

1. Node.js (v18.16.0) and npm binaries
2. Helm binary
3. kubectl binary
4. RKE2 installation files
5. Rancher Helm chart
6. Cert-Manager Helm chart
7. All necessary Node.js dependencies (pre-installed in node_modules)

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/your-username/rke2-rancher-installer.git
   cd rke2-rancher-installer
   ```

2. Download the binaries from the latest release:
   ```
   curl -L https://github.com/your-username/rke2-rancher-installer/releases/latest/download/binaries.tar.gz -o binaries.tar.gz
   tar -xzvf binaries.tar.gz
   ```

3. Run the start script:
   ```
   ./start.sh
   ```

The start script will automatically install the necessary dependencies and run the installer.
## Usage

1. Transfer the entire `rke2-rancher-installer` directory to the target isolated environment.

2. Navigate to the package directory:
   ```
   cd path/to/rke2-rancher-installer
   ```

3. Run the tool:
   ```
   ./start.sh [options]
   ```

Available options:

- `-n, --cluster-name <name>`: Cluster name
- `-v, --rke2-version <version>`: RKE2 version
- `--rancher-version <version>`: Rancher version
- `--cert-manager-version <version>`: Cert-Manager version
- `--docker-mirror-repo <url>`: Local Docker mirror repository (if applicable)
- `--quay-mirror-repo <url>`: Local Quay mirror repository (if applicable)

If you don't provide all required options, the tool will prompt you for the missing information.

## Configuration

The tool uses the artifacts provided in the `artifacts` directory. Ensure this directory contains:

1. RKE2 installation files in `artifacts/rke2`
2. Rancher Helm chart in `artifacts/rancher`
3. Cert-Manager Helm chart in `artifacts/cert-manager`

## Updating the Package

To update the package with new versions of RKE2, Rancher, or Cert-Manager:

1. Replace the corresponding files in the `artifacts` directory.
2. Update the version numbers in the tool's configuration or prompts.

## Troubleshooting

If you encounter any issues:

1. Ensure all binaries in the `bin` directory have execute permissions.
2. Verify that all required artifacts are present in the `artifacts` directory.
3. Check that the versions specified for RKE2, Rancher, and Cert-Manager match the artifacts provided.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.