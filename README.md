# Homepage of Mark Gibson (jollytoad)

This is codebase of my personal homepage. It's a place I've created for
tinkering.

It was originally designed to run on [Deno](https://deno.com/), and be deployed
to [Deno Deploy](https://deno.com/deploy).

There is also experimental support for running on [Bun](https://bun.sh/) and
deploying to [Cloudflare Pages](https://developers.cloudflare.com/pages). I hope
to gradually add more runtime and deployment options as I investigate them.

## Pre-requisites

Install [Deno](https://deno.com/manual/getting_started/installation).

## Local https support

(Only supports Deno atm)

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

### With Deno

Using Deno as the runtime:

```sh
deno task start
```

### With Bun

To use Bun as the runtime, you must have
[installed bun](https://bun.sh/docs/installation):

```sh
deno task start:bun
```

or just directly execute:

```sh
./app/main_bun.ts
```

You don't need Deno or Node installed to run via Bun.

### With Cloudflare Pages (Wrangler)

To run as a Cloudflare Pages dev site, you must have `npx` pre-installed:

```sh
deno task start:cloudflare
```

This performs a build stage using Deno before starting.

## Deployment

### Deno Deploy

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

### Cloudflare Pages

Sign up to [Cloudflare](https://dash.cloudflare.com), go to `Workers & Pages`
and hit `Create`, switch to the `Pages` tab and click `Connect to Git`.

You can connect to this repo or a fork.

You have to configure the build settings as:

- **Framework preset**: _None_
- **Build command**:
  `./scripts/install_deno.sh && $HOME/.deno/bin/deno task build:cloudflare`
- **Build output directory**: `.cloudflare/dist`

You can now `Save and Deploy`.

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
