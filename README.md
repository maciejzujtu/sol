# StageGate prototype

StageGate is a milestone-gated Solana crowdfunding prototype. The Anchor program in `rust/` owns SPL USDC escrow, releases a kickoff tranche at the exact funding goal, and releases later tranches only after the matching MetaDAO futarchy proposal is finalized as `Passed`. A failed proposal or missed deadline freezes the remaining escrow for pro-rata backer refunds. `backend/` is the TypeScript API and keeper. `frontend/` has a Next.js Pass/Fail trading screen backed by MetaDAO unsigned instructions and wallet signing.

## Docker

The Anchor image is pinned to Anchor 1.1.2 / Solana CLI 3.1.10; on Apple Silicon it uses amd64 emulation. The backend image builds from a pinned Node 22 image. Start the API:

```sh
docker compose --profile backend up --build -d backend
curl http://127.0.0.1:3001/health
```

Start the trading frontend alongside the backend:

```sh
docker compose --profile backend --profile frontend up --build -d backend frontend
```

Open `http://localhost:3000`. The frontend's API classes and configuration are
documented in [frontend/README.md](frontend/README.md).

`RPC_URL` defaults to Solana devnet. To use the offline Surfpool validator for basic RPC testing:

```sh
RPC_URL=http://validator:8899 docker compose --profile localnet --profile backend up -d validator backend
```

The offline validator starts empty. It does not include the StageGate or MetaDAO programs, so an end-to-end futarchy flow needs a network where both are deployed or a configured local fork.

Build and check Rust and the generated TypeScript client:

```sh
docker compose --profile tools run --rm anchor cargo test --workspace
docker compose --profile tools run --rm anchor cargo build-sbf --manifest-path programs/bestcrow/Cargo.toml --sbf-out-dir /tmp/stagegate-sbf --arch v0
docker compose --profile tools run --rm anchor anchor idl build -p bestcrow -o idl/bestcrow.json -t idl/bestcrow.ts
docker compose --profile tools run --rm anchor npm ci --ignore-scripts
docker compose --profile tools run --rm anchor npm run generate:client
docker compose --profile tools run --rm anchor npm run check:client
```

The SBF command writes to a disposable container. The source program ID is a placeholder; a deployer must choose and synchronize the real program ID before deployment. No deployment is performed here.

## Protocol setup

1. The creator supplies a project SPL `base_mint`, the canonical Circle USDC mint for the network, and a MetaDAO v0.6 DAO using that base/USDC pair. The DAO spot pool must already hold enough base and USDC to seed both conditional markets at the DAO's minimum liquidity levels.
2. Create an active Squads proposal and the corresponding MetaDAO question, conditional vaults and Draft proposal for **each** milestone. The backend `POST /meta-dao/prepare` endpoint returns unsigned instructions for the MetaDAO setup, staking, launch and finalization steps. The creator pays for proposal stake and market liquidity separately from backer escrow.
3. Call `create_campaign` with 1–10 milestone proposals as ordered remaining accounts. It fixes the goal, dates, tranche amounts, evidence metadata hash, base/quote mints and DAO. The initial release is at most 30%; all tranche amounts must sum to the goal. A MetaDAO DAO can be bound to only one StageGate campaign.
4. Backers pledge USDC until the exact goal is reached. The kickoff tranche transfers immediately. The creator posts each milestone evidence hash before its due date, then launches its precommitted MetaDAO proposal. MetaDAO's own TWAP and threshold logic finalizes the result; anyone can pass the finalized proposal to `resolve_milestone` for a tranche release or refund freeze.
5. Funding failure, a failed proposal, or a missed milestone/market deadline enables permissionless pro-rata refunds of unreleased USDC. Before funding succeeds, backers may withdraw their pledge. Refund and deadline instructions are available through the generated client and backend API.

MetaDAO v0.6 enforces a proposal duration of at least 24 hours, so the two-minute SOL demo in `AGENTS.md` is obsolete for this USDC futarchy flow. The StageGate market timeout must exceed the MetaDAO proposal duration. MetaDAO proposal creation also requires external Squads, DAO and liquidity setup. StageGate verifies account ownership, DAO/base/quote binding, Draft status at campaign creation, proposal timestamps, and finalized outcome; it does not attest whether an off-chain deliverable is good or prove that a Squads action represents the evidence. The `base_mint` market can be manipulated if its liquidity and price discovery are weak.

## API and keeper

See [backend/README.md](backend/README.md) for routes and unsigned transaction formats. The keeper polls every 30 seconds, reports actionable campaign transitions, and can submit them when an operator explicitly configures a separate keeper keypair. It is read-only by default. The program itself does not depend on the keeper: all transitions are permissionless.

The Rust ABI is pinned to the MetaDAO v0.6.1 [programs repository](https://github.com/metaDAOproject/programs). Escrow uses the legacy SPL Token program because that MetaDAO version uses it. Token-2022 is outside the current prototype. `rust/clients/js/` is generated from the Anchor IDL and must be regenerated after contract changes.

Program upgrades remain controlled by Solana's upgradeable loader, outside the contract. Check a deployed program's authority with `scripts/check-upgrade-authority.sh`; no upgrade or authority revocation is performed here.
