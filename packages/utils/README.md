# ☕ Coffee Shop Shared Utilities

This package contains shared utility helpers for the Coffee Shop monorepo.

## Purpose

`packages/utils` is a local workspace package that exposes reusable helper functions used by the backend and potentially other packages.

## Example

```js
import { greet } from '../../packages/utils/index.js';

console.log(greet('Coffee Shop'));
```

## Contents

- `index.js` — exported utility functions

## Workspace Usage

From any workspace package, import utilities using a relative package path.

## Notes

- Keep utilities small and reusable
- Add new helpers here when they are shared between apps
