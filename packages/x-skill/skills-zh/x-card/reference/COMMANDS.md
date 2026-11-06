# Commands

## v0.9 (recommended)

1. `createSurface { surfaceId, catalogId }`
2. `updateComponents { surfaceId, components: [{ id, component, ...props, children? }] }`
3. `updateDataModel { surfaceId, path, value }`
4. `deleteSurface { surfaceId }`

Every message includes `version: 'v0.9'`.

## v0.8 (compat)

No `version` field. Surfaces can be implicit. Vue demos also show `surfaceUpdate` / `dataModelUpdate` (with `valueString` / `literalString`) / `beginRendering`.

Data updates in older v0.8 samples may use a `contents` array (`op`, `path`, `value`). Prefer v0.9 `path` + `value` (can set a whole object at once).

## Migration

1. Add `version: 'v0.9'`
2. Send `createSurface` before `updateComponents` (move `catalogId` there)
3. Replace `contents: [{ op, path, value }]` with `{ path, value }`

The Box accepts `(XAgentCommand_v0_9 | XAgentCommand_v0_8)[]` and detects version from the `version` field.
