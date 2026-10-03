# Bestcrow prototype

This repository starts with the on-chain logic for a Kickstarter-style campaign on Solana.
`rust/` is the authority for custody, deadlines, votes, releases, and refunds. The
`backend/` and `frontend/` directories are reserved for TypeScript consumers of the
generated IDL and client.

## Docker toolchain

Docker Compose runs a pinned Anchor 1.1.2 / Solana CLI 3.1.10 toolchain. The image is
`linux/amd64`; Docker Desktop on Apple Silicon runs it with emulation.

```sh
docker compose --profile tools run --rm anchor anchor --version
docker compose --profile tools run --rm anchor cargo test --workspace
docker compose --profile tools run --rm anchor cargo build-sbf \
  --manifest-path programs/bestcrow/Cargo.toml --sbf-out-dir /tmp/bestcrow-build --arch v0
docker compose --profile tools run --rm anchor anchor idl build \
  -p bestcrow -o idl/bestcrow.json -t idl/bestcrow.ts
docker compose --profile tools run --rm anchor npm ci --ignore-scripts
docker compose --profile tools run --rm anchor npm run generate:client
docker compose --profile tools run --rm anchor npm run check:client
```

The SBF build writes into the disposable container. It does not create or retain a
deployment keypair in the project. The public program ID in the source is a build
placeholder; replace it with the actual deployment address before deploying.

An optional local Surfpool validator is available with
`docker compose --profile localnet up -d validator`. Its RPC is bound to
`127.0.0.1:8899`. It starts with fresh state, runs offline, and does not deploy
the program automatically. Check it with:

```sh
curl -s http://127.0.0.1:8899 -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}'
docker compose --profile localnet down
```

The TypeScript API is in `rust/clients/js/`. It exports typed instruction
builders, PDA helpers, account decoders, events, and error codes. Its peer
dependency is `@solana/kit`. The backend and frontend can use the same client;
their own wallet or transaction layer provides signers.

After deployment, inspect the loader's upgrade authority with the bundled CLI:

```sh
docker compose --profile tools run --rm anchor bash \
  /workspace/scripts/check-upgrade-authority.sh \
  <program-id> devnet <expected-authority-or-none>
```

See [rust/README.md](rust/README.md) for the contract, account interface, and
upgrade authority policy.
