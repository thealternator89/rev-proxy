#!/usr/bin/env node

import { program } from "commander";
import { Server } from "./server";

function collect(value, previous) {
  return [...previous, value];
}

const version = require('../package.json').version;

program
  .version(version)
  .requiredOption(
    "-p, --port <number>",
    "Port to register for proxy",
    collect,
    []
  )
  .requiredOption(
    "-r, --remote <URL>",
    "Remote URL to proxy incoming traffic",
    collect,
    []
  );

program.parse(process.argv);
const opts = program.opts();

if (opts.port.length === 0 || opts.remote.length === 0) {
  program.help();
}

try {
  buildPortToRemoteMaps(opts.port, opts.remote).forEach((map, index) => {
    const server = new Server(map.port, map.remote, index);
    server.up();
  });
} catch (error) {
  console.log(`Error: ${error.message}`);
}

function buildPortToRemoteMaps(ports: string[], remotes: string[]) {
  if (ports.length !== remotes.length) {
    throw new Error("There must be the same number of ports as remotes!");
  }

  return ports.map((port, index) => {
    const parsed = parseInt(port);

    if (`${parsed}` !== port) {
      throw new Error(`Invalid port value: ${port} - Must be a number!`);
    }

    return {
      port: parsed,
      remote: remotes[index],
    };
  });
}
