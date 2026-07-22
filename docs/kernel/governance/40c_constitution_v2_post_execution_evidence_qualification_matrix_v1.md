# Task 40 Post-Execution Evidence Qualification Matrix v1

| Evidence ID | Storage location | Category | Creation-time evidence | Complete bytes | Bytes | SHA-256 | Format | Provenance strength | Independent of current candidate | Circularity risk | Governance admissibility | Final classification | Reason |
|---|---|---|---|---:|---:|---|---|---|---:|---|---|---|---|
| EVID-40-001 | Git blob `2f617624d30b5ab84cf85a9a4aabe74ee10543a3` | A | pre-execution object metadata plus tree binding | YES | 23764 | `7658039D...ACB6` | UTF-8; no BOM; LF; CRLF 0 | strong | YES | none detected | existing Git-object evidence class applies | ADMISSIBLE_EXACT | Exact complete bytes match every required invariant. |
| EVID-40-002 | Git tree `88bf090fdff14f630ae1405e9a92fd9c0ed1d821` | B | tree state contains Tasks 33–37 and excludes Task 38 | through blob | 23764 | `7658039D...ACB6` | bound blob exact | strong | YES | low | existing content-addressed-object class applies | ADMISSIBLE_EXACT | Binds exact blob to canonical path and exact authority chain. |
| EVID-40-003 | Git tree `59ff025f959ab8c64f5c297a9236f4ae183cfd03` | B | older object metadata and path tree | through blob | 23764 | `7658039D...ACB6` | bound blob exact | moderate/strong | YES | low | existing content-addressed-object class applies | ADMISSIBLE_EXACT | Independent older canonical-path binding corroborates provenance. |
| EVID-40-004 | Task 33/35 persisted artifacts | D | required artifact hashes establish pre-execution creation | NO | N/A | source identity only | operation slices | moderate | YES | none | insufficient alone | SUPPORTING_ONLY | Six local preimages do not preserve all unchanged bytes. |
| EVID-40-005 | Task 36 persisted artifacts | D | required artifact hashes and verification sequence | NO | N/A | source identity only | declarations and ranges | moderate | YES | none | insufficient alone | SUPPORTING_ONLY | Independent read assertion is not a retrievable full source. |
| EVID-40-006 | Task 38 preflight/begin evidence | D | bound before replacement | NO | N/A | source identity only | declarations | moderate | YES | none | insufficient alone | SUPPORTING_ONLY | Confirms observed identity but contains no complete byte stream. |
| EVID-40-007 | current canonical path | D | current persisted observation | postimage only | 23722 | `01EC4CAE...9886` | UTF-8; no BOM; LF | strong for current state only | NO | high for historical proof | insufficient as baseline | SUPPORTING_ONLY | Decisive current-state evidence, not historical preimage evidence. |
| EVID-40-008 | hypothetical reverse reconstruction | E | would be created after Task 39 | synthetic only | 23764 if attempted | not computed | prohibited | none | NO | certain | prohibited | INADMISSIBLE_CIRCULAR | Would assume the six operations were the only changes; not performed. |

## Qualification Result

- Exact full-byte candidates found: `1` unique blob.
- Content-addressed canonical-path bindings found: `2` trees.
- Exact admissible preimage found: `YES`.
- Founder evidence-class qualification required: `NO`.
- Circular reconstruction used: `NO`.
- Primary outcome: `OUTCOME_A`.
