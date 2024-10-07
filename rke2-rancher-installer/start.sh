#!/bin/bash

# Set PATH to use local binaries
export PATH="$PWD/bin:$PATH"

# Check if Node.js is available
if ! command -v node &> /dev/null
then
    echo "Node.js binary not found in the bin directory. Please ensure it's included in the package."
    exit 1
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