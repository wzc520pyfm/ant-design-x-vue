# XRequest core (Vue)

- Default method POST, JSON body = `{ ...options.params, ...runParams }`
- SSE vs JSON is chosen from the response `content-type`
- `manual: true` is mandatory inside Providers (`request must be manual`)
- Timeouts emit `onError(new Error('TimeoutError'))`
- `transformStream` replaces the default SSE parser when the server speaks another framing
- `fetch` is the extension point used by official Vue docs to mock streams without hitting the network
