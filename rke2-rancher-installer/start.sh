#!/bin/bash

# Check if binaries are already extracted
if [ ! -d "bin" ] || [ ! -d "artifacts" ]; then
    echo "Extracting binaries and artifacts..."
    tar -xzvf binaries.tar.gz
fi

# Set PATH to use local binaries
export PATH="$PWD/bin:$PATH"

# Check if Node.js is available and is the correct version
if ! command -v node &> /dev/null
then
    echo "Node.js binary not found in the bin directory. Please ensure it's included in the package."
    exit 1
else
    node_version=$(node -v)
    if [[ $node_version != v18.16.0 ]]; then
        echo "Incorrect Node.js version. Expected v18.16.0, but found $node_version"
        exit 1
    fi
fi

# Check if npm is available
if ! command -v npm &> /dev/null
then
    echo "npm binary not found in the bin directory. Please ensure it's included in the package."
    exit 1
fi

# Compile TypeScript files
npm run build

# Run the CLI tool
node dist/cli.js "$@"