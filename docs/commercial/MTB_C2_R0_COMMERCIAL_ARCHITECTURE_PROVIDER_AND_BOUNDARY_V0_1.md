# MTB-C2-R0 — Commercial Architecture, Provider Decision, and Canonical Build Boundary

Status: `R0 COMPLETE — IMPLEMENTATION NOT AUTHORIZED BY THIS DOCUMENT`

Canonical baseline: `main@bdf2853eb7087898352f804a02d38f251eb5268a`

Decision date: 2026-09-07

## 1. Goal

Turn the accepted Moon Today Board v1 local-first baseline into a sellable public
product without making a separate user pilot a prerequisite for implementation.
Market evidence will be collected after public launch. Engineering, payment,
recovery, and production verification remain mandatory before live money is
accepted.

The commercial promise remains:

> Help me return without rebuilding my world.

Moon Today Board competes on continuity and Time To Context, not task volume,
engagement, automated scheduling, or generic AI chat.

## 2. Baseline finding

The baseline is a static TypeScript/Vite PWA. It stores board content under
`moon.today-board.v1`, supports JSON portability, and has no account, backend,
remote database, analytics, tracking, sync, or payment code.

At R0 entry:

- production build: PASS;
- all 16 repository `test:*` commands: PASS;
- public repository default branch: `main`;
- current GitHub Pages surface: `https://nguyentudu.github.io/today-board/`;
- `.github/workflows/pages.yml` deploys every `main` push, so the Pages surface
  is not an immutable rollback artifact at R0 entry;
- repository license: absent;
- commercial backend: absent;
- live payment account and credentials: not established by repository evidence.

The accepted v1 remains a frozen compatibility baseline. Commercial work must
not silently reinterpret existing cards, fabricate continuity data, or make an
account necessary for local use.

## 3. Product packaging candidates

| Offer | Price at launch | Entitlement boundary |
| --- | ---: | --- |
| Moon Local | Free | Existing local-first board, offline use, JSON export/import, no account |
| Moon Continuity Pro | USD 8/month or USD 72/year | Encrypted cross-device sync, version history/recovery, extended storage, continuity review, priority support |
| Founding License | USD 49 once, first 100 completed orders | Hosted Pro service for the published product lifetime, subject to published fair-use and discontinuation/refund terms |

These prices and terms are disabled launch candidates, not validated
willingness-to-pay claims or adopted commercial commitments. Founder must adopt
the final catalog, quotas, refund rules, fair-use rules, and discontinuation
terms before R2 creates provider products. Price changes must be prospective and
must not silently alter completed orders.

Initial capacity candidate for costing is 1 GB of encrypted remote objects and
30 retained board versions per paid account. Local storage remains
device/browser-dependent. The Founding License must not be enabled until the
published terms bound storage, support, fair use, product-lifetime meaning, and
service discontinuation/refund handling.

## 4. Provider decisions

### 4.1 Payment and merchant of record

Primary provider: **Lemon Squeezy**.

Reasons:

- supports bank payouts to Vietnam;
- acts as merchant of record for digital-product checkout;
- exposes subscriptions, customer portal, refunds, license/customer data, and
  signed webhooks;
- provides a path to affiliates without adding a second payment ledger.

Official evidence consulted on 2026-09-07:

- `https://docs.lemonsqueezy.com/help/getting-started/supported-countries`
- `https://docs.lemonsqueezy.com/help/online-store/customization`
- `https://docs.lemonsqueezy.com/guides/developer-guide/webhooks`

Fallback provider: **Polar**, but no second provider implementation belongs in
Commercial v1. The payment contract must be provider-neutral so Polar can be
added only if Lemon Squeezy onboarding or payout verification fails.

Stripe Payments is not the direct provider for Commercial v1 because Vietnam
is not listed in Stripe's direct payments availability at R0 time:
`https://stripe.com/global`.

Provider KYC, payout approval, banking, tax identity, and acceptance-policy
review are Founder-owned external prerequisites. No code or model can bypass
them.

### 4.2 Runtime and storage

Commercial frontend and API target: **Cloudflare Pages + Workers**.

Metadata and ledgers: **Cloudflare D1**.

Encrypted board snapshots and attachment objects: **Cloudflare R2**.

The existing GitHub Pages URL remains the current local-only public surface.
Before commercial UI reaches `main`, R1 must preserve the accepted v1 build as
an immutable tagged artifact and either pin, replace, or disable the automatic
`main` Pages deployment. Only that preserved artifact may be called the v1
rollback surface. AWS, Railway, PostgreSQL, and S3 are not Commercial v1
dependencies.

### 4.3 Identity

Identity provider: **Auth0**, isolated from any Proof Commerce tenant.

Rules:

- Moon Local never requires authentication;
- sign-in appears only when the user buys, restores a purchase, or enables
  sync;
- Auth0 subject identifiers are mapped to internal opaque account IDs;
- payment email is not trusted as authentication by itself;
- no social graph, contact import, or cross-product identity merge is allowed.

### 4.4 Email and support

Lemon Squeezy owns checkout receipts and billing lifecycle messages. Auth0 owns
authentication messages. Commercial v1 adds no marketing-email ingestion or
behavioral drip system. A Founder-controlled support address is published in
the trust pack; outbound campaigns require explicit Founder approval.

## 5. Architecture

### 5.1 Trust split

The system has two planes:

1. **Local continuity plane** — board semantics, drafts, media, search,
   lifecycle, import/export, and offline behavior.
2. **Commercial control plane** — identity, checkout linkage, payment ledger,
   entitlement, encrypted sync objects, recovery metadata, support, and
   minimal operations.

The control plane must not become the source of truth for plaintext continuity
content.

### 5.2 Data classes

| Class | Examples | Permitted location | Plaintext server access |
| --- | --- | --- | --- |
| Local continuity | title, context, return point, promise, outcome, local media | Device | No |
| Encrypted sync payload | encrypted board snapshot and encrypted attachment | R2 | No |
| Recovery metadata | version, object hash, device/key-envelope identifiers | D1/R2 metadata | Yes, content-free only |
| Account | opaque account ID, Auth0 subject, locale | D1 | Yes, minimum necessary |
| Commerce | provider customer/order/subscription IDs, product, status, amount/currency | D1 | Yes |
| Operations | webhook receipt ID, attempt/result, error class | D1 with retention limit | Yes, no board content |

Client-side encryption is mandatory before content reaches R2. The service must
not store plaintext board content, an unwrapped content-encryption key, a
recovery phrase, raw Auth0 tokens, payment-card data, or provider secrets in the
repository.

### 5.3 Entitlement truth

Entitlement is derived from verified provider events and the immutable order
ledger, never from a browser redirect or client claim.

Minimum states:

- `free`
- `pro_active`
- `pro_grace`
- `pro_expired`
- `founding_active`
- `refunded`
- `revoked`

Every provider webhook must be signature-verified, durably recorded before
acknowledgement, replayable, and safe under duplicate or out-of-order delivery.
Lemon Squeezy does not supply a guaranteed unique delivery-event ID in the
webhook contract. The adapter therefore computes a SHA-256 digest of the exact
verified request body and records a deduplication key containing provider,
store, test/live mode, event name, resource type, resource ID, and payload
digest. Exact retries are acknowledged without a second ledger transition.
Resource state is reconciled with the provider API before an out-of-order or
ambiguous event changes entitlement. Refund and chargeback events remove future
paid access without deleting local data.

The webhook adapter must reject any unapproved store, test/live mode, product,
or variant before ledger or entitlement mutation. Sandbox and live ledgers are
logically isolated.

R2 uses provider sandbox fixtures and synthetic opaque account IDs only. It
cannot create a live customer entitlement. R3 adds authenticated ownership:
the server creates checkout linkage for the authenticated opaque account and
places only the required signed/custom account reference in provider checkout
data. A success redirect, email match, or client-submitted customer ID never
proves ownership.

Each purchase creates an independently revocable grant. Effective access is the
union of valid grants, so refunding one subscription cannot revoke an unrelated
Founding grant. Subscription cancellation preserves access through the verified
paid-through time. A full refund, full chargeback, or provider revocation ends
only the affected grant according to the published refund policy. Partial
refunds are recorded but do not change entitlement unless the refunded line
item maps to a separately revocable grant. Ambiguous state is fail-closed for
new paid capabilities while local/export access remains available.

### 5.4 Sync truth

- Local mutation succeeds without network access.
- Sync is explicit and can be disabled.
- The device keeps the usable local board.
- Remote versions are append-only objects; D1 points to current and retained
  versions.
- Conflict handling never silently overwrites two divergent boards.
- Account deletion removes remote objects after a disclosed recovery window;
  it does not remotely erase the user's local board.
- Export remains available regardless of entitlement state.

Commercial v1 uses a user-held recovery kit. A content master key is generated
on the first sync device, never uploaded unwrapped, and wrapped separately for
each authorized device. Another device receives it through an explicit recovery
kit import or an approved device-to-device transfer. Auth0 login or password
reset cannot reconstruct a missing encryption key. Losing every authorized
device and recovery kit means remote ciphertext cannot be recovered by Moon.

Every snapshot and attachment uses authenticated encryption with a unique nonce
and associated data binding account, object, version, and schema identifiers.
Every list/read/write/delete request authorizes the opaque account against the
requested object and version; possession of an object ID is insufficient.
Commercial v1 retains at most 30 board versions for 30 days. Confirmed account
deletion enters a seven-day disclosed recovery window, then deletes remote
objects and account mappings; billing records are retained only as legally and
financially required.

Before sync is offered, v1 localStorage data must migrate transactionally to an
IndexedDB board/object store. The migration preserves `moon.today-board.v1` as
a rollback source until post-migration verification succeeds, never uploads as
a side effect, and must handle embedded media without duplicating it. After a
successful migration, every board mutation and media write uses IndexedDB as
the single authoritative local store. The old localStorage value is
recovery-only and cannot remain a concurrent writer. Export/import must still
round-trip board semantics and media after migration.

## 6. Repository topology

### 6.1 Public repository: `nguyentudu/today-board`

Owns the local continuity plane, commercial UI, provider-neutral client
contracts, encryption client, landing/trust surfaces, and client verification.
It must contain no production secrets or privileged provider operations.

### 6.2 Private repository: proposed `nguyentudu/today-board-commercial`

Owns Workers, D1 migrations, R2 access, Auth0 token verification, Lemon Squeezy
webhooks, entitlement derivation, sync APIs, operations, and backend tests.

Creating the private repository is an external mutation and requires a separate
Founder command. R0 does not create it.

## 7. Canonical build phases

| Phase | Outcome | Exit evidence |
| --- | --- | --- |
| R1 — Commercial UX | onboarding, pricing, account/sync entry points, trust copy | build and existing local-first tests remain green; new UX tests pass |
| R2 — Payment sandbox | signed webhook ledger, disabled catalog candidates, fixture checkout, portal contract, entitlement | replay, duplicate, reorder, allowlist, refund, cancellation, and failure tests pass; no live customer grant |
| R3 — Identity, storage migration, and encrypted sync | optional account, server-created checkout ownership, IndexedDB migration, client encryption, version/recovery flow | ownership, migration, plaintext-exclusion, conflict, offline, deletion, and restore tests pass |
| R4 — Launch surface | domain-ready landing, legal/trust/support, release identity | link/copy/accessibility/legal inventory verification passes |
| R5 — Production seal | live provider/runtime configuration and reversible smoke order | exact build SHA, route health, webhook, entitlement, refund, and rollback evidence |
| R6 — Public launch | public access and Founder-approved distribution campaign | launch URLs, offers, support path, and monitoring ownership recorded |

No tester-count or willingness-to-pay threshold blocks R1–R6. A real-money
production smoke order and refund are still required before broad distribution.

## 8. Canonical implementation boundary

The exact allowed namespaces and initially planned paths are recorded in
`MTB_C2_R0_CANONICAL_PATH_MANIFEST_V0_1.json`.

Rules:

- R1–R5 receive separate bounded implementation authority.
- Public-client and commercial-control-plane paths are authorized by their
  explicit phase entries only. A shared bootstrap path may appear in more than
  one phase when that phase is expected to modify it; the union of R2/R3/R5
  control-plane paths never grants any one phase authority over the others.
- Existing v1 domain semantics may be imported but not rewritten merely to
  accommodate commerce.
- Commercial code must depend on domain contracts; domain code must not depend
  on a payment provider.
- R1 must preserve the accepted v1 static artifact and stop commercial `main`
  changes from silently replacing the rollback surface.
- Moving from the GitHub Pages origin to a commercial domain cannot read the old
  origin's localStorage. R1/R4 must give existing users an explicit export from
  the old origin and import into the new origin; no cross-origin data access or
  silent migration may be claimed.
- R4 must parameterize install-readiness verification for the selected
  deployment base. The commercial custom-domain root and the accepted GitHub
  Pages `/today-board/` subpath are separate supported targets; changing one
  must not erase verification coverage for the other.
- No AI chat, marketplace, social feed, collaboration, calendar automation,
  engagement notification, Proof Commerce integration, or voice productization
  is inside Commercial v1.
- No raw continuity telemetry or engagement optimization is allowed.
- Provider credentials live only in deployment secret stores.
- A new path outside the manifest requires a short boundary amendment, not a
  new constitutional/governance chain.

## 9. Licensing decision gate

The repository is public and currently has no `LICENSE`. Public visibility does
not by itself grant an open-source license.

Recommended model, pending explicit Founder adoption:

- public local client under AGPL-3.0;
- hosted commercial service and paid entitlements sold separately;
- Moon name and marks excluded from the code license;
- private commercial control plane remains proprietary for Commercial v1.

Because licensing changes legal rights, R0 records the recommendation but does
not add a license. Founder must explicitly approve the exact license text before
R1 modifies `LICENSE`, README claims, or commercial Terms.

## 10. Required external inputs before their dependent phase

| Input | Owner | Needed by |
| --- | --- | --- |
| Lemon Squeezy verified store and sandbox/live credentials | Founder | R2/R5 |
| Final product/variant IDs and refund policy | Founder + Codex-prepared packet | R2 |
| Separate Auth0 application/tenant credentials | Founder | R3 |
| Cloudflare account, zone/project authority, D1/R2 bindings | Founder | R3/R5 |
| Custom domain and DNS authority | Founder | R4/R5 |
| Support email | Founder | R4 |
| Exact license approval | Founder | R1/R4 |
| Terms/privacy legal review or explicit Founder adoption | Founder | R4/R5 |

Codex can prepare configurations, schemas, code, tests, copy, evidence packets,
and deployment commands. Founder retains authority over KYC, financial account
ownership, secrets, legal adoption, live prices, public deployment, outbound
messages, refunds, and public launch.

## 11. R0 acceptance and rollback

R0 passes when:

- canonical baseline identity is recorded;
- build and all existing tests pass;
- payment, runtime, storage, and identity providers are decided;
- local/control-plane trust boundary is explicit;
- packaging and entitlement states are explicit;
- public/private repository ownership is explicit;
- implementation paths and exclusions are machine-readable;
- no application, payment, deployment, account, or user-data mutation occurred.

Independent architecture and canonical-boundary QA: `PASS` after remediation
of webhook identity, deployment rollback, account/payment ownership, recovery,
storage migration, and exact path-inventory findings.

Rollback is deletion of the R0 branch. `main`, `gh-pages`, production assets,
external provider accounts, and user data are unchanged by R0.

## 12. Next authority gate

After independent review of this packet, the next bounded command is:

> Founder authorizes MTB-C2-R1 to implement the Commercial UX and trust
> preparation paths listed for R1, without backend creation, provider secrets,
> payment activation, or deployment.
