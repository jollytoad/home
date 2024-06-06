# Homepage of Mark Gibson (jollytoad)

This is codebase of my personal homepage. It's a place I've created for
tinkering.

It runs on Deno, deployed on Deno Deploy.

## Pre-requisites

Install [Deno](https://deno.com/manual/getting_started/installation).

## Local https support

To emulate a more realistic production environment locally, you can provide a
localhost key/cert pair, which automatically be picked up and the server will be
run over `https`.

The simplest way is using [mkcert](https://github.com/FiloSottile/mkcert). To
install via Homebrew on a Mac (or checkout the link for alternatives):

```sh
brew install mkcert nss
```

Then create certificate and install a local certificate authority:

```sh
deno task mkcert
```

## Usage locally

Now start this service:

```sh
deno task start
```

## Deployment

Sign up to [Deno Deploy](https://deno.com/deploy), create a project, and then
edit the `deno.json` file and change the target project in the `deploy` task.

Grab your Deploy access token, and set the `DENO_DEPLOY_TOKEN` env var.

To deploy a staging site:

```sh
deno task deploy
```

Or, to deploy to production:

```sh
deno task deploy --prod
```

## How does it work?

Go ahead, have a browse, take a look at [main.ts](./main.ts) to see how the app
works in production, you should be able to follow imports and functions to
understand how it all hangs together.

If you are feeling more adventurous take a look at [dev.ts](./dev.ts) which also
calls various build scripts to dynamically generate the routing and cron job
modules.

The project uses and showcases much of my
[http functions library](https://jsr.io/@http), which is designed to be easy to
follow and understand (hopefully).
