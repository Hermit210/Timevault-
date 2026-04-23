"use server";

async function buildGatewayTransaction(tx: string, network: "devnet" | "mainnet"): Promise<{
  transaction: string;
  latestBlockhash: {
    blockhash: string;
    lastValidBlockHeight: string;
  };
}> {
  const rpcUrl = network === "mainnet"
    ? `https://mainnet-beta.helius-rpc.com/?api-key=${process.env["HELIUS_API_KEY"]}`
    : `https://devnet.helius-rpc.com/?api-key=${process.env["HELIUS_API_KEY"]}`;

  const blockhashResponse = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getLatestBlockhash",
      params: [{ commitment: "finalized" }],
    }),
  });
  const blockhashData = await blockhashResponse.json();
  const { blockhash, lastValidBlockHeight } = blockhashData.result.value;

  return {
    transaction: tx,
    latestBlockhash: {
      blockhash,
      lastValidBlockHeight: lastValidBlockHeight.toString(),
    },
  };
}

async function sendGatewayTransaction(tx: string, network: "devnet" | "mainnet"): Promise<string> {
  const rpcUrl = network === "mainnet"
    ? `https://mainnet-beta.helius-rpc.com/?api-key=${process.env["HELIUS_API_KEY"]}`
    : `https://devnet.helius-rpc.com/?api-key=${process.env["HELIUS_API_KEY"]}`;

  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "sendTransaction",
      params: [tx, { encoding: "base64", skipPreflight: true }],
    }),
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

export { buildGatewayTransaction, sendGatewayTransaction };
