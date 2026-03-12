# Adox Perfume Store

## Current State
A luxury perfume e-commerce site with admin panel at `/admin`. The admin panel allows editing products and site content. However, saves fail silently and changes never persist to the main page.

## Requested Changes (Diff)

### Add
- Stable storage in backend: `stable var` arrays for products, site content, and next product ID
- `preupgrade` / `postupgrade` system hooks to save and restore all data across canister upgrades

### Modify
- `main.mo`: add `stableProducts`, `stableSiteContent`, `stableNextProductId` stable vars; add `preupgrade` and `postupgrade` hooks
- `App.tsx`: remove duplicate `QueryClientProvider` (was shadowing the one in `main.tsx`, causing query invalidation to target the wrong cache)
- `ProductsSection.tsx`: show sample products only while actor is initializing; once backend is ready, show real products (or empty state)

### Remove
- Duplicate `QueryClientProvider` from `App.tsx`

## Implementation Plan
1. Fix `main.mo` -- add stable vars and upgrade hooks so all data survives redeployment
2. Fix `App.tsx` -- remove duplicate QueryClient that caused query cache inconsistency
3. Fix `ProductsSection.tsx` -- sample products now only show during loading, not after the backend returns an empty list
