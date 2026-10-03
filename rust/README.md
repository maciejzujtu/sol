# Bestcrow on-chain API

This Anchor program is the Rust API used by the future TypeScript backend and
frontend. Its generated `idl/bestcrow.json` and `idl/bestcrow.ts` describe the
instructions, account layouts, and events. TypeScript builds unsigned instructions
from the IDL; the user's wallet signs. The backend may index public events and
prepare transactions, but it never decides custody or refunds.

The module layout follows the [Trustless Work Solana escrow repository](https://github.com/Trustless-Work/trustlesswork-solana)
as a reference: separate state, instructions, policies, events, and client-facing
IDL. Their deployed contracts and SDK are not dependencies here. Their single
approver/dispute-resolver roles and compliance registry would give a platform
authority over a crowd campaign, so this implementation uses contribution-weighted
backer votes and permissionless finalization instead.

## Campaign lifecycle

1. Creator fixes a funding goal, deadline, initial release, metadata hash, vote
   period, and 5–10 milestones. Milestone budgets plus the initial release must
   equal the goal. The initial release is at most 20% and each milestone at most
   50% of the goal. Milestone dates strictly increase.
2. Backers deposit SOL. No deposit may exceed the goal; there is no overflow or
   automatic extra funding. Backers can withdraw part or all of their deposit
   before the funding deadline without platform approval. The creator can cancel
   during funding, making every remaining deposit refundable.
3. After the deadline, anyone can finalize. Failure makes deposits refundable.
   Success pays the fixed initial release and leaves the rest in the campaign PDA.
   If finalization happens after the first milestone is already due, the campaign
   fails and refunds backers instead of paying the initial release.
4. The creator submits a hash of milestone evidence before its due date. Backers
   cast one vote per wallet and round, weighted by their final contribution.
   Approval requires YES weight at least 70% of **all** funded weight; abstentions
   do not count as approval.
5. A first vote at 50%–69.99% opens seven days to improve; below 50% opens a
   48-hour show-cause response period. The creator can submit new evidence for
   one second vote. A second failure terminates the campaign. If the creator
   misses a milestone date, anyone can open the show-cause period; if the creator
   misses that response deadline, anyone can terminate.
6. Anyone can release an approved tranche to the fixed creator address. After
   failure or termination, anyone can execute a backer's refund to that backer's
   wallet. Refunds use the frozen pool and contribution denominator, so claim
   order cannot change a backer's entitlement. Previously released tranches
   cannot be recovered.

Claiming a refund also closes the backer account and returns its rent to that
backer's wallet. Anyone may close an empty backer account during funding, or a
backer account after campaign completion. Finalized vote receipts can likewise
be closed by anyone; their rent always returns to the voter. A receipt for the
currently open voting round cannot be closed, so a vote cannot be repeated.

An individual backer can exit while funding is open. After funding succeeds,
remaining escrow exits only through campaign failure or milestone termination;
there is no unilateral withdrawal from an active milestone. Every eligible exit
can be executed without an administrator.

The final pro-rata refund for each backer rounds down to a lamport. After all
backers have claimed, anyone may send the remaining rounding dust (less than
the number of backers) to the creator. This rule is public in advance.

## Pseudonymity

Only wallet addresses, amounts, deadlines, and hashes go on-chain. No names,
emails, shipping details, or identity attestations are stored. Wallet addresses
and transaction amounts remain public on Solana; this is pseudonymity, not
cryptographic anonymity. Creators and backers must keep private evidence and
reward fulfilment data off-chain. The program does not prove product quality.

## Upgrade authority

The program has no application administrator instruction. Solana's upgrade
authority is controlled by the upgradeable loader **outside** this contract.
While an authority exists, it can replace the code and change the rules; users
must be shown its current public key. `../scripts/check-upgrade-authority.sh`
checks the deployed program's authority without signing anything. A production
policy should use a disclosed multisignature authority and a public upgrade
delay, then revoke authority only after review if immutability is desired.
Revocation is irreversible and is not performed by this repository.

## Scope

This is the SOL-only crowdfunding core. Prediction markets, tokens, equity,
revenue sharing, rewards, merchandise fulfilment, and a centralized dispute
resolver are outside this prototype. Program deployment and an end-to-end
devnet flow still need verification. `clients/js` is the generated Solana Kit
client. Its source is derived from the Anchor IDL and should be regenerated
after any instruction or account change.
