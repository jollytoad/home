#!/usr/bin/env -S bun run

/// <reference types="npm:bun-types" />

import "./polyfill/bun.ts";

import handler from "./handler.ts";
import init from "@http/host-bun-local/init";
import { setStore } from "@jollytoad/store";

setStore(import("@jollytoad/store-node-fs"));

const server = Bun.serve(await init(handler));

console.log(`Listening on ${server.url}`);
