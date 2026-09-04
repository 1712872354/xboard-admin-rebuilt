# xboard-admin-rebuilt

Reconstruction of the XBoard Admin frontend from the published `cedar2025/xboard-admin-dist` build artifacts.

## Status

Initial reconstruction scaffold. The goal is to reproduce the published UI and behavior from the available compiled assets and rendered page evidence, while keeping the rebuilt source maintainable.

## Reconstruction targets

- React/Vite application structure
- Chinese / English / Russian localization
- Shared admin layout and UI components
- Server Management page as the first pixel-validation target
- API/service layer and page interactions inferred from the published bundle
- Monaco editor integration where required
