const MAINNET_URL = "wss://mempool.space/api/v1/ws";
const TESTNET_URL = "wss://mempool.space/testnet/api/v1/ws";

export function getSocketUrl(isMainnet: boolean) {
    return isMainnet ? MAINNET_URL : TESTNET_URL;
}
