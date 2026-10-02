# Folder Structure Convention

Binding convention of the Node.js/TypeScript territory home `node-quality-authority`.

- **Status:** binding. Every structural directory this home owns and defines, and
  every name it assigns inside the `configs/` family surface, follows this
  convention. The config-family artifacts are born against this grammar; this
  document precedes them and is their structure authority.
- **Classification authority boundary:** the canonical project-category registry
  document `TS_NODE_PROJECT_CATEGORY_REGISTRY_001` (Knowledge Plane,
  `knowledge/domains/programming-languages/node-typescript/config/project-categories/`)
  owns which category a project belongs to, the fail-closed decision matrix, and
  the verification contract. This document owns the physical structure and the
  naming grammar. The two surfaces reference each other by identity and never
  duplicate content.
- **Self-governance:** this home is itself a governed tenant. Its declared
  category is `single-project/direct-node` (fleet inventory, TSPI-75), and its
  own `tsconfig` family at the repository root is the canonical direct-node lane
  — the home dogfoods the grammar it declares.

## 1. Naming rules

1. **Fully lowercase:** every structural identifier is written completely in
   lowercase — directory names, family tokens, topology tokens, lane tokens,
   role tokens, and convention document names.
2. **Kebab-case:** every structural identifier joins words with single hyphens
   (`^[a-z0-9]+(?:-[a-z0-9]+)*$`). PascalCase, camelCase, spaces, and
   underscores are forbidden in structural identifiers.
3. **Tool-fixed exemption:** configuration file names are externally mandated
   tool contracts and keep their exact spelling; they are never restyled:
   `tsconfig.base.json`, `tsconfig.json`, `tsconfig.node.json`,
   `tsconfig.typecheck.json`, `tsconfig.tests.json`, `tsconfig.types.json`,
   `vitest.config.ts`, `vitest.base.config.ts`, `vitest.<suite>.config.ts`,
   `tsdown.config.ts`, `pnpm-workspace.yaml`, `pnpm-workspace.base.yaml`,
   `pnpm-workspace.delta.yaml`, `package.json`, `registry.json`.
4. **Identity preservation:** config identities that carry dots or internal
   casing (for example `pnpm-workspace.yaml`, `tsconfig.base.json`) are never
   rewritten into kebab-case folder-style names. Rules 1–2 bind structural
   folders and non-config documents only.

## 2. Category identity equals folder path

- The category ID is the hierarchical path `<topology>/<lane>` and is identical
  to the folder path of its artifacts. No mapping table exists: declaration,
  folder, and artifacts are provably the same path.
- The bound categories of this territory:
  - `single-project/direct-node`
  - `single-project/direct-node/no-prebuild`
  - `single-project/bundler-owned`
  - `monorepo`
- **Resolution key:** a consuming project resolves its category through its
  language plus the declared category path. The fleet inventory validates the
  category format only; registry membership is proven by the canonical verifier
  against the pinned registry (fleet contract
  `FLEET_REGISTRY_AND_PINS_CONTRACT_001`, class rule 5).
- **One-axis rule:** the category carries exactly one semantic axis — the
  toolchain-config classification of the project in its own language's
  territory. Any future classification axis (repository kind, data class, and
  similar) gets its own named field with its own authority; it is never folded
  into this taxonomy.

## 3. The `configs/` family layout

The nested taxonomy places the family first, the topology as the parent folder,
and the delivery-lane variant as the child folder:

```text
configs/
├── registry.json                              # the category registry (schema-pinned, versioned)
├── tsconfig/
│   ├── single-project/
│   │   ├── direct-node/
│   │   │   ├── tsconfig.base.json
│   │   │   ├── tsconfig.json
│   │   │   ├── tsconfig.node.json
│   │   │   ├── tsconfig.typecheck.json
│   │   │   ├── tsconfig.tests.json
│   │   │   ├── tsconfig.types.json
│   │   │   └── no-prebuild/                   # fallback delta (transition form)
│   │   │       ├── tsconfig.node.json
│   │   │       ├── tsconfig.tests.json
│   │   │       └── tsconfig.types.json
│   │   └── bundler-owned/
│   │       ├── tsconfig.base.json
│   │       ├── tsconfig.json
│   │       ├── tsconfig.node.json
│   │       ├── tsconfig.typecheck.json
│   │       ├── tsconfig.tests.json
│   │       └── tsconfig.types.json
│   └── monorepo/
│       ├── tsconfig.base.json                 # workspace root policy
│       ├── tsconfig.json                      # root solution surface
│       └── roles/
│           ├── node/tsconfig.base.json
│           ├── bundler-node/tsconfig.base.json
│           ├── lib/tsconfig.base.json
│           ├── web/tsconfig.base.json
│           ├── test/tsconfig.base.json
│           ├── typecheck/tsconfig.base.json
│           ├── types/tsconfig.base.json
│           ├── declaration-package-artifact/tsconfig.base.json
│           ├── shared-package-artifact/tsconfig.base.json
│           └── source-first-package/tsconfig.base.json
├── vitest/
│   ├── single-project/
│   │   ├── direct-node/
│   │   │   ├── vitest.config.ts
│   │   │   ├── vitest.base.config.ts
│   │   │   ├── vitest.unit.config.ts
│   │   │   ├── vitest.integration.config.ts
│   │   │   └── vitest.regression.config.ts
│   │   └── bundler-owned/                     # the same five-file form
│   └── monorepo/
│       ├── vitest.config.ts
│       ├── vitest.base.config.ts
│       └── vitest.role.config.ts
├── tsdown/
│   └── single-project/
│       └── bundler-owned/
│           └── tsdown.config.ts
└── pnpm/
    ├── pnpm-workspace.base.yaml               # the fortress baseline
    ├── single-project/
    │   └── pnpm-workspace.delta.yaml          # without the packages key
    └── monorepo/
        └── pnpm-workspace.delta.yaml          # with the packages form
```

**Variant-materialization rule:** a variant folder level materializes only where
the family carries a real content dimension for it. The `pnpm` family carries
only topology deltas — forced single-file variant folders without a content
dimension are preemptive structure and forbidden. The `tsdown` family exists
only for the bundler-owned lane (the bundler owns `dist/`); no other lane
materializes a tsdown surface.

## 4. Topology semantics

- **`single-project`** — one deliverable, one package root.
  - `direct-node`: the TypeScript compiler is the sole runtime producer
    (`noEmit: false`); the module pair is `Node20` + `Node16`. The canonical
    strong topology carries the full six-file set including the composite
    typecheck producer. `no-prebuild` is the documented fallback delta under
    `direct-node/` (a transition form, never the long-term default).
  - `bundler-owned`: the bundler owns `dist/` (tsdown or an equivalent);
    the TypeScript graph validates only (`noEmit: true` in the node lane).
    Exactly one tool owns the runtime artifact — never two.
- **`monorepo`** — a workspace with roles. Three layers: the workspace root
  policy, the role templates under `roles/`, and thin per-package leaves that
  extend one role template. The ten roles are the closed set listed in
  section 3.

The terminal delivery-owner decision (which tool owns the emitted artifact)
belongs to the lane architecture and is re-anchored per use from the canonical
lane blueprint `CONFIG_TSCONFIG_COMPLETE_LANE_ARCHITECTURE_BLUEPRINT_001`;
this convention binds only the folder grammar that carries it.

## 5. The registry surface

`configs/registry.json` is the machine-readable registry instance of this
territory: schema-pinned, versioned, and bound by the consuming homes through
the three-pin contract. Its entries carry the category ID (identical to the
folder path), the artifact map for each config family, and the proof map. It
deliberately carries no derived fields: the ID is the path, and the topology
and lane are won by splitting the path — never restated as second values. The
registry document in the Knowledge Plane owns the taxonomy and the decision
matrix; the instance and this document never redefine them.

## 6. Binding and proof forms

- **Binding chain:** a consuming project declares its category, binds it as
  `planned`, proves it through read-back, and flips it to `bound` — the
  declaration chain of the fleet contract.
- **Proof forms:** base-file byte identity against the pinned category
  artifacts, invariant guards on leaf files, declared values (source roots,
  suite names), registry membership, and the behavior gate of the toolchain —
  the five-stage fail-closed verification is owned by the registry document
  (`TS_NODE_PROJECT_CATEGORY_REGISTRY_001`) and is referenced here by identity.
- **Propagation:** category artifacts and pinned forms propagate to tenants
  only through reviewed re-binding pull requests with renewed proofs — the
  pin-bound propagation discipline of
  `REPOSITORY_GOVERNANCE_CANONICAL_FILES_CONVENTION_REFERENCE_001`.

## 7. Identity cross-references

| Surface | Canonical identity | Owns |
|---|---|---|
| Project-category registry | `TS_NODE_PROJECT_CATEGORY_REGISTRY_001` (Knowledge Plane, `config/project-categories/`) | taxonomy, decision matrix, verification contract |
| Lane architecture | `CONFIG_TSCONFIG_COMPLETE_LANE_ARCHITECTURE_BLUEPRINT_001` | delivery-owner decision, lane semantics |
| Fleet contract | `FLEET_REGISTRY_AND_PINS_CONTRACT_001` (class rule 5) | the `category` field, format-only validation, resolution key |
| Canonical files convention | `REPOSITORY_GOVERNANCE_CANONICAL_FILES_CONVENTION_REFERENCE_001` | pin-bound propagation, file-family governance |
| Territory onboarding | `LANGUAGE_TERRITORY_ONBOARDING_001` | the territory-home role of this repository |

These references are identity-only. This document never restates their
content; a conflict resolves toward the referenced authority, and the drift is
a governed finding.
