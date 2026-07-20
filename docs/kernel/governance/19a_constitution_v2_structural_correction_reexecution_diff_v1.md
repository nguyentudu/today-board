# Moon Constitution v2 Structural Correction Re-execution Diff v1

## 1. Diff Control

| Field | Value |
| --- | --- |
| Source Constitution SHA-256 | `BF8F80F38C217E2E39F9D50A862B8314E5ECDBDFD99D91B873350E43F76279F5` |
| Result Constitution SHA-256 | `7707FAC9379160C78FA6D97A53D851A61EC8F4CF02F7E7FBE67E8EA11DA6E079` |
| Manifest v2 SHA-256 | `8DBDFB1B1CD8820DDC399C14F223A705C3078A8D7F65AFA4BD0B1FE50BE7B143` |
| Logical operations | 6 |
| Rendered diff hunks | 2 |
| Unauthorized logical operations | 0 |
| Unauthorized rendered hunks | 0 |
| Total byte delta | +278 |

## 2. Exact Logical Operations

JSON strings below are the exact UTF-8 preimages and postimages. Spaces before closing quotes are literal.

### STRUCT-OP-001

Source range: `[42, 122)`

Removed:

```json
"Status: Amendment 001 incorporated — pending post-incorporation verification  "
```

Inserted:

```json
"Status: Amendment 001 incorporated — post-incorporation verification PASS; structural correction applied — pending independent verification  "
```

### STRUCT-OP-002

Source range: `[160, 262)`

Removed:

```json
"Version posture: Constitution v2 incorporates Amendment 001; pending post-incorporation verification  "
```

Inserted:

```json
"Version posture: Constitution v2 remains a candidate; Amendment 001 incorporated; structural correction applied; independent structural correction verification pending  "
```

### STRUCT-OP-003

Source range: `[355, 355)`

Removed:

```json
""
```

Inserted:

```json
"Ratification: Founder ratification pending  \nOfficial status: Constitution v2 is not official  \nSupersession: Constitution v1 is not superseded  \n"
```

### STRUCT-OP-004

Source range: `[37399, 37410)`

Removed:

```json
"Fresh-start"
```

Inserted:

```json
"Fresh Start"
```

### STRUCT-OP-005

Source range: `[37412, 37424)`

Removed:

```json
"present-only"
```

Inserted:

```json
"Present Only"
```

### STRUCT-OP-006

Source range: `[37448, 37459)`

Removed:

```json
"no-old-pull"
```

Inserted:

```json
"No Old Pull"
```

## 3. Rendered Hunk 1 - Document Control

Mapped operations: `STRUCT-OP-001`, `STRUCT-OP-002`, `STRUCT-OP-003`.

```diff
-Status: Amendment 001 incorporated — pending post-incorporation verification  
+Status: Amendment 001 incorporated — post-incorporation verification PASS; structural correction applied — pending independent verification  
 Scope: Phase 0 - Meaning and Model  
-Version posture: Constitution v2 incorporates Amendment 001; pending post-incorporation verification  
+Version posture: Constitution v2 remains a candidate; Amendment 001 incorporated; structural correction applied; independent structural correction verification pending  
 Incorporated amendment: Moon Constitution Amendment 001 v1  
 Incorporation date: 2026-07-16
+Ratification: Founder ratification pending  
+Official status: Constitution v2 is not official  
+Supersession: Constitution v1 is not superseded  
```

## 4. Rendered Hunk 2 - Section 15

Mapped operations: `STRUCT-OP-004`, `STRUCT-OP-005`, `STRUCT-OP-006`.

```diff
-6. **Moon must respect continuity boundaries.** Fresh-start, present-only, light-continuity, and no-old-pull preferences may be essential to dignity and safety. Their exact constitutional treatment remains for later specification, but their legitimacy is established here.
+6. **Moon must respect continuity boundaries.** Fresh Start, Present Only, light-continuity, and No Old Pull preferences may be essential to dignity and safety. Their exact constitutional treatment remains for later specification, but their legitimacy is established here.
```

## 5. Frozen-Payload Evidence

| Measure | Before | After |
| --- | --- | --- |
| AMEND-001-C SHA-256 | `E6EE9BD4FD488FE6AE36B1009A6305F37E46205EAF2B81257B8132906E4D7957` | `E6EE9BD4FD488FE6AE36B1009A6305F37E46205EAF2B81257B8132906E4D7957` |
| Payload length | 877 bytes | 877 bytes |
| Start byte | 37,625 | 37,903 |
| Byte identity unchanged | Not applicable | YES |

## 6. Diff Classification

| Measure | Result |
| --- | ---: |
| Authorized logical operations | 6 |
| Unauthorized logical operations | 0 |
| Authorized rendered hunks | 2 |
| Unauthorized rendered hunks | 0 |
| Whitespace changes outside authorized ranges | 0 |
| Unrelated formatting changes | 0 |

**Diff verdict: AUTHORIZED SIX-OPERATION POSTIMAGE ONLY**
