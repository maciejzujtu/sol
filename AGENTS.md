AGENTS.md: StageGate Architecture & Agent Guidelines

1. System Overview & Problem Formulation

1.1 Objective

StageGate is an on-chain, milestone-gated crowdfunding protocol designed on Solana that replaces centralized trusted intermediaries (such as Kickstarter or Indiegogo) with deterministic Program Derived Address (PDA) escrow vaults and futarchy conditional decision markets.

1.2 Core Problem & The Intermediary

Traditional crowdfunding forces backers to trust two entities:

1. The Platform Intermediary: Kickstarter extracts a 5% platform fee plus 3–5% payment processing fees, controls settlement schedules, and holds unilateral authority to freeze accounts or reverse transactions.
2. The Creator: After funding, the platform releases 100% of capital upfront ("fund and pray"). If the creator underdelivers, misallocates funds, or ghosts, backers have zero technical recourse.

1.3 The On-Chain Solution

StageGate replaces subjective platform intervention with autonomous on-chain code running on Solana:

⚬ Backer capital is held in a program-owned SPL token escrow vault.
⚬ Funds are structured into discrete, sequential tranches (T_0, T_1, \dots, T_n).
⚬ Capital release beyond Kickoff (T_0) requires passing a conditional prediction market (futarchy).
⚬ If milestone verification fails or deadlines lapse, unreleased funds are permanently locked against creator withdrawal and made immediately claimable by backers pro-rata.

2. Technical Stack Specification

┌────────────────────────────────────────────────────────────────────────┐
│                          Next.js Frontend (App Router)                 │
│  - @solana/wallet-adapter-react   - @coral-xyz/anchor                  │
│  - @metadaoproject/futarchy-sdk   - Tailwind CSS                       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ JSON-RPC / WebSocket
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                Off-Chain TypeScript Crank / Keeper Bot                 │
│  - Automated epoch / deadline monitoring and resolution triggers       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Transactions / Instructions
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Solana Devnet Programs                          │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ stagegate-program (Anchor Rust)                                │   │
│   │ - Campaign / Milestone PDA state machine                       │   │
│   │ - Tranche release & pro-rata refund calculations               │   │
│   └───────────────────────┬────────────────────────────────────────┘   │
│                           │ Cross-Program Invocation (CPI)             │
│                           ▼                                            │
│   ┌───────────────────────────────────┬────────────────────────────┐   │
│   │ metaDAOproject/conditional-vault  │ metaDAOproject/futarchy-amm│   │
│   │ - Splits USDC into pUSDC / fUSDC  │ - TWAP price discovery     │   │
│   │ - Conditional token settlement    │ - Decision threshold math  │   │
│   └───────────────────────────────────┴────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘


⚬ On-Chain Runtime: Solana (Devnet targeted for testing and evaluation).
⚬ Smart Contract Framework: Anchor Framework (anchor-lang v0.29.0+).
⚬ Futarchy & Prediction Core: MetaDAO open-source primitives (conditional-vault and futarchy-amm).
⚬ Token Standards: SPL Token and Token-2022 Program.
⚬ Client / Web Application: Next.js (TypeScript), @solana/web3.js, @coral-xyz/anchor, @solana/wallet-adapter.
⚬ Permanent Metadata Storage: Arweave / Irys or IPFS (for milestone proof logs, schematics, and audits).

3. On-Chain Data Architecture (Anchor Rust)

3.1 State Accounts

use anchor_lang::prelude::*;

#[account]
pub struct Campaign {
    pub creator: Pubkey,            // Creator authority[span_42](start_span)[span_42](end_span)[span_43](start_span)[span_43](end_span)
    pub token_mint: Pubkey,         // Deposit denomination (e.g., USDC)[span_44](start_span)[span_44](end_span)[span_45](start_span)[span_45](end_span)
    pub vault: Pubkey,              // PDA Token Account holding pledged assets[span_46](start_span)[span_46](end_span)[span_47](start_span)[span_47](end_span)
    pub total_target: u64,          // Target funding amount in base units
    pub total_pledged: u64,         // Current pledged amount
    pub current_milestone: u8,      // Current milestone index pointer
    pub milestone_count: u8,        // Total count of scheduled milestones
    pub state: CampaignState,       // State enum: Funding, Active, Failed, Completed
    pub bump: u8,                   // Campaign PDA bump
    pub vault_bump: u8,             // Vault PDA bump
}

#[account]
pub struct Milestone {
    pub campaign: Pubkey,           // Parent Campaign reference
    pub index: u8,                  // Milestone order (0-indexed)
    pub payout_basis_points: u16,   // Percentage of funds allocated (e.g., 2500 = 25%)
    pub deadline_ts: i64,           // Immutable Unix timestamp cutoff[span_48](start_span)[span_48](end_span)[span_49](start_span)[span_49](end_span)
    pub proof_hash: [u8; 32],       // SHA-256 / IPFS hash of verifiable deliverable
    pub status: MilestoneStatus,    // Pending, Reviewing, Passed, Rejected[span_50](start_span)[span_50](end_span)[span_51](start_span)[span_51](end_span)
    pub conditional_vault: Pubkey,  // MetaDAO conditional vault PDA reference
}

#[account]
pub struct BackerReceipt {
    pub campaign: Pubkey,           // Associated campaign
    pub backer: Pubkey,             // Backer wallet address[span_52](start_span)[span_52](end_span)[span_53](start_span)[span_53](end_span)
    pub amount_pledged: u64,        // Contributed tokens
    pub refunded: bool,             // Anti-double-claim flag[span_54](start_span)[span_54](end_span)[span_55](start_span)[span_55](end_span)
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum CampaignState {
    Funding,
    Active,
    Failed,
    Completed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum MilestoneStatus {
    Pending,
    Reviewing,
    Passed,
    Rejected,
}


3.2 PDA Derivations

⚬ Campaign PDA: seeds = [b"campaign", creator.key().as_ref(), &campaign_id.to_le_bytes()], bump
⚬ Vault PDA: seeds = [b"vault", campaign.key().as_ref()], bump
⚬ Milestone PDA: seeds = [b"milestone", campaign.key().as_ref(), &[index]], bump
⚬ Backer Receipt PDA: seeds = [b"receipt", campaign.key().as_ref(), backer.key().as_ref()], bump

4. Program Instructions & Execution Logic

   initialize_campaign()
             │
             ▼
          pledge() ◄──────────────────────────────┐
             │                                    │
             ├──(Goal Not Reached by Cutoff)──────┴──► claim_refund()
             │
             ▼ (Target Achieved: State::Active)
      release_tranche_0()  ──► Transferred immediately to Creator[span_56](start_span)[span_56](end_span)[span_57](start_span)[span_57](end_span)
             │
   ┌─────────┴────────────────────────────────────────────┐
   │ Loop: Milestones 1 to N                              │
   │                                                      │
   │   1. submit_milestone_proof()                        │
   │      - Callable by Creator only[span_58](start_span)[span_58](end_span)[span_59](start_span)[span_59](end_span)                       │
   │      - Sets MilestoneStatus::Reviewing               │
   │      - Opens Futarchy Prediction Window              │
   │                                                      │
   │   2. Decision Resolution via resolve_milestone()     │
   │      - If Pass TWAP > Fail TWAP:                     │
   │          * Transfer Tranche N to Creator             │
   │          * Increment current_milestone               │
   │      - If Fail TWAP >= Pass TWAP:                    │
   │          * Set CampaignState::Failed[span_60](start_span)[span_60](end_span)[span_61](start_span)[span_61](end_span)               │
   │                                                      │
   │   3. Deadline Expiry via resolve_timeout()           │
   │      - If Clock > deadline_ts and still Pending:     │
   │          * Set CampaignState::Failed[span_62](start_span)[span_62](end_span)[span_63](start_span)[span_63](end_span)               │
   └───────────────────────┬──────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
      All Milestones Passed        Milestone Fails or Times Out
             │                           │
    State::Completed             State::Failed[span_64](start_span)[span_64](end_span)[span_65](start_span)[span_65](end_span)
    Project Finalized                    │
                                         ▼
                                  claim_refund()
                                  (Backers recover unreleased vault balance)[span_66](start_span)[span_66](end_span)[span_67](start_span)[span_67](end_span)[span_68](start_span)[span_68](end_span)[span_69](start_span)[span_69](end_span)


4.1 Instruction Specifications

initialize_campaign

⚬ Accounts: creator (Signer), campaign (Init, PDA), vault (Init, PDA Token Account), token_mint, system_program, token_program.
⚬ Logic: Sets parameters, initializes campaign status to CampaignState::Funding.

pledge

⚬ Accounts: backer (Signer), campaign (Mut), vault (Mut), backer_receipt (Init/Mut, PDA), backer_token_account (Mut), token_program.
⚬ Logic: Transfers tokens to vault PDA. If total_pledged >= total_target, automatically unlocks Tranche 0 to the creator and sets campaign.state = CampaignState::Active.

submit_milestone_proof

⚬ Accounts: creator (Signer), campaign (Mut), milestone (Mut, PDA), clock (Sysvar).
⚬ Guards: Requires creator == campaign.creator, milestone.status == MilestoneStatus::Pending, and clock.unix_timestamp <= milestone.deadline_ts.
⚬ Logic: Records proof_hash, updates status to MilestoneStatus::Reviewing, and initializes the conditional vault trading window.

resolve_milestone

⚬ Accounts: caller (Signer, permissionless crank), campaign (Mut), milestone (Mut), vault (Mut), creator (Mut), pass_market, fail_market.
⚬ Logic: Samples on-chain TWAP from conditional AMMs:
  
  $$\Delta = \text{TWAP}(\text{Pass Market}) - \text{TWAP}(\text{Fail Market})$$
  ⚬ If \Delta > 0: Signs via PDA seeds to transfer tranche tokens to creator; sets MilestoneStatus::Passed.
  ⚬ If \Delta \le 0: Sets MilestoneStatus::Rejected and campaign.state = CampaignState::Failed.

claim_refund

⚬ Accounts: backer (Signer), campaign (Mut), milestone (Mut), vault (Mut), backer_receipt (Mut, PDA), backer_token_account (Mut), token_program.
⚬ Guards: Requires campaign.state == CampaignState::Failed OR (clock.unix_timestamp > milestone.deadline_ts with milestone unresolved). Ensures backer_receipt.refunded == false to eliminate double-claims.
⚬ Deterministic Math:
  
  $$\text{Payout} = \frac{\text{backer\_receipt.amount\_pledged}}{\text{campaign.total\_pledged}} \times \text{vault.amount}$$
  
  Executes PDA-signed transfer of Payout to backer_token_account and marks backer_receipt.refunded = true.

5. File System Structure

Agents implementing the repository must adhere to this folder hierarchy:

stagegate/
├── programs/
│   └── stagegate/
│       ├── Cargo.toml
│       └── src/
│           ├── lib.rs
│           ├── constants.rs
│           ├── errors.rs
│           ├── instructions/
│           │   ├── mod.rs
│           │   ├── initialize_campaign.rs
│           │   ├── pledge.rs
│           │   ├── submit_milestone_proof.rs
│           │   ├── resolve_milestone.rs
│           │   ├── resolve_timeout.rs
│           │   └── claim_refund.rs
│           └── state/
│               ├── mod.rs
│               ├── campaign.rs
│               ├── milestone.rs
│               └── backer_receipt.rs
├── services/
│   └── crank/
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts               # Cron / event poller for milestone timeouts
│           └── keeper.ts              # Anchor instruction dispatch
├── app/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── idl/
│   │   │   └── stagegate.json
│   │   ├── components/
│   │   │   ├── WalletProvider.tsx
│   │   │   ├── CampaignCard.tsx
│   │   │   ├── MilestoneTracker.tsx
│   │   │   ├── FutarchyTradingBox.tsx
│   │   │   └── RefundButton.tsx
│   │   ├── hooks/
│   │   │   ├── useProgram.ts
│   │   │   └── useCampaignData.ts
│   │   └── app/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       └── campaign/
│   │           └── [id]/
│   │               └── page.tsx
├── Anchor.toml
└── README.md


6. Implementation Plan for Autonomous Agents

Phase 1: Smart Contract Construction (programs/stagegate)

1. Implement state structs and validation accounts (campaign.rs, milestone.rs, backer_receipt.rs).
2. Write Anchor errors (ErrorCode::MilestoneDeadlinePassed, ErrorCode::MilestoneStillActive, ErrorCode::UnauthorizedCreator, ErrorCode::AlreadyRefunded).
3. Implement initialize_campaign.rs and pledge.rs with token transfers via CPI to the SPL Token Program.
4. Implement claim_refund.rs ensuring pro-rata math handles integer division safely without rounding exploits:
   let refund_amount = (backer_receipt.amount_pledged as u128)
       .checked_mul(vault.amount as u128)
       .ok_or(ErrorCode::MathOverflow)?
       .checked_div(campaign.total_pledged as u128)
       .ok_or(ErrorCode::MathOverflow)? as u64;
   
5. Implement resolve_milestone.rs and resolve_timeout.rs.

Phase 2: Automation Crank Service (services/crank)

1. Build a TypeScript script using @coral-xyz/anchor and @solana/web3.js.
2. Add a polling loop (every 30 seconds) querying program.account.milestone.all().
3. Check if Date.now() / 1000 > milestone.account.deadlineTs and milestone.account.status === Pending.
4. If expired, submit the resolveTimeout transaction signed by the keeper keypair to automatically transition the campaign to Failed.

Phase 3: Client Interface (app/)

1. Setup Next.js with @solana/wallet-adapter-react and @solana/wallet-adapter-wallets.
2. Bind the Anchor IDL to generate dynamic contract calls based on the connected wallet.
3. Build the Campaign detail page displaying:
  ⚬ Target vs. Total Pledged progress bar.
  ⚬ Milestone lifecycle tracker (Pending, Under Review, Passed, Failed).
  ⚬ Verifiable proof link (IPFS/Arweave URL).
  ⚬ Interactive conditional pass/fail prediction module.
  ⚬ Pro-rata refund trigger button active when status is Failed.

7. Mandatory Jury Defense Invariants

When presenting or auditing the protocol against the competition criteria, these invariant mappings answer the mandatory jury evaluation points:

Q1: Where exactly in the code does the intermediary disappear?

⚬ Defense: In traditional crowdfunding, Kickstarter acts as an intermediary collecting fees and unilaterally mediating disputes. In this codebase, the intermediary disappears inside resolve_milestone.rs and claim_refund.rs. No platform administrator or multisig exists. The release of capital is enforced by conditional TWAP math and deterministic timestamp expiration checks running directly on the Solana runtime.

Q2: What happens if one of the parties disappears halfway through?

⚬ If the Creator disappears: The deadline_ts field on Milestone is an immutable Unix timestamp. When it lapses without submitted proof, the crank or any user calls resolve_timeout(), setting the state to Failed. Backers call claim_refund() to withdraw all unreleased capital directly from the PDA vault.
⚬ If the Backer disappears: The backer's funds are already secured inside the escrow PDA vault. The creator does not need the backer's ongoing presence or signatures to unlock approved tranches.

Q3: Who has permission to perform which operations? Can the author rug?

⚬ Defense: The author/developer possesses zero admin backdoor keys, emergency withdraw functions, or protocol-level fee switches. Escrow funds are owned strictly by the PDA seeded with [b"vault", campaign.key().as_ref()]. The only signing capability is the program itself via derived seeds during approved tranche transfers or pro-rata backer refunds.

Q4: Why blockchain and not a regular database?

⚬ Defense: A database requires a centralized host (Kickstarter/Amazon Web Services) that can be censored, subpoenaed, altered, or shut down. A database cannot provide trustless escrow guarantees to foreign parties without legal enforcement contracts. On Solana, execution is tamper-proof, transparent to audit on Solscan, and financially settled in sub-second slots without banking rails.

8. Live Demo Execution Script (2-Wallet Devnet Walkthrough)

To validate the application live during presentations, execute this deterministic walkthrough:

# 1. Environment Preparation[span_156](start_span)[span_156](end_span)[span_157](start_span)[span_157](end_span)[span_158](start_span)[span_158](end_span)[span_159](start_span)[span_159](end_span)
solana airdrop 2 <CREATOR_WALLET_PUBKEY> --url devnet
solana airdrop 2 <BACKER_WALLET_PUBKEY> --url devnet

# 2. Deploy Anchor Program[span_160](start_span)[span_160](end_span)[span_161](start_span)[span_161](end_span)
anchor build
anchor deploy --provider.cluster devnet


1. Create Campaign (Wallet 1 - Creator):
  ⚬ Connect Wallet 1 on the Next.js UI.
  ⚬ Initialize a campaign with a 1 SOL Target, 2 Milestones (Tranche 0: 0.3 SOL, Tranche 1: 0.7 SOL, Milestone 1 Deadline: 2 minutes).
2. Pledge & Seed Activation (Wallet 2 - Backer):
  ⚬ Connect Wallet 2.
  ⚬ Pledge 1 SOL. Show transaction confirmation on Solana Explorer.
  ⚬ Verify that Wallet 1 receives 0.3 SOL (Kickoff Tranche) and the Vault PDA retains 0.7 SOL.
3. Simulate Milestone Timeout (Intermediary-Free Failure Trigger):
  ⚬ Allow the 2-minute deadline to expire without calling submit_milestone_proof from Wallet 1.
  ⚬ The UI or Keeper calls resolve_timeout(). The campaign state switches to Failed.
4. Execution of Sovereign Refund:
  ⚬ Wallet 2 clicks Claim Refund.
  ⚬ Inspect the devnet transaction signature on Solana Explorer / Solscan.
  ⚬ Confirm Wallet 2 receives the exact remaining 0.7 SOL from the Vault PDA with zero manual approvals.