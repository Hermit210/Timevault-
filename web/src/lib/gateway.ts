"use server";
import { GATEWAY_ENDPOINT } from "./consts";

async function buildGatewayTransaction(tx: string, network: "devnet" | "mainnet") {
  const gatewayUrl = `${GATEWAY_ENDPOINT}/${network}?apiKey=${process.env["GATEWAY_API_KEY"]}`;
  console.log(gatewayUrl);

  const buildGatewayTransactionResponse = await fetch(gatewayUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: "timevault",
      jsonrpc: "2.0",
      method: "buildGatewayTransaction",
      params: [tx, { encoding: "base64" }],
    }),
  });

  const gatewayTx = await buildGatewayTransactionResponse.json();
  return gatewayTx;
}

export { buildGatewayTransaction };