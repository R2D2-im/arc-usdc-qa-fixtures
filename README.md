# Arc ERC-20 USDC self-transfer test DApp

Static single-page test tool for `ops#323`. It groups executable fixtures for
ERC-20 transfer, finite/unlimited/revoke approval, increase/decrease allowance,
EIP-2612 Permit, and Permit2.

## Run locally

```sh
cd /Users/r2d2/clawd/manual-test/arc-erc20-transfer
python3 -m http.server 8080
```

Open `http://<reachable-host>:8080` in the imToken DApp browser. The wallet must
already contain the Arc Mainnet network configuration.

Default parameters:

- contract: `0x3600000000000000000000000000000000000000`
- recipient: `0x4031e602F315e37ec17415740fd24605372911B6`
- recipient/spender: `0x4031e602F315e37ec17415740fd24605372911B6`
- raw unit: `1000000` (1 USDC at 6 decimals)
- every transaction uses outer value `0`
- Permit and Permit2 cases only request typed-data signatures and do not broadcast

The page disables all cases unless the current chain ID is `5042` (`0x13b2`).
Each transaction still requires an explicit wallet confirmation. Permit2 uses the
canonical address `0x000000000022D473030F116dDEE9F6B43aC78BA3`; verify that Arc
supports this contract before treating a signature preview as an executable flow.
