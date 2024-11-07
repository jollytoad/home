#!/usr/bin/env -S node --experimental-default-type=module --experimental-strip-types

// NOT CURRENTLY WORKING: transpilation of .tsx is required

import "./polyfill/bun.ts";

import handler from "./handler.ts";
import init from "./init_hono_node_server.ts";
import { serve } from "@hono/node-server";
import { setStore } from "@jollytoad/store";

setStore(import("@jollytoad/store-node-fs"));

const server = serve(await init(handler));
const address = server.address();

console.log(`Listening on ${address}`);
