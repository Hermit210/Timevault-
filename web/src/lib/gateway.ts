"use server";
import { Transaction } from "@solana/web3.js";
import { GATEWAY_ENDPOINT } from "./consts";

async function buildGatewayTransaction(tx: string, network: "devnet" | "mainnet") {
  const gatewayUrl = `${GATEWAY_ENDPOINT}/v1/${network}?apiKey=${process.env["GATEWAY_API_KEY"]}`;
  const buildGatewayTransactionResponse = await fetch(gatewayUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: "timevault",
      jsonrpc: "2.0",
      method: "buildGatewayTransaction",
      params: [tx],
    }),
  });

  if (!buildGatewayTransactionResponse.ok) {
    throw new Error("Failed to build gateway transaction");
  }

  const data = await buildGatewayTransactionResponse.json();
  console.log(data);
  
  const {
    result: { transaction: encodedTransaction },
  } = data as {
    result: {
      transaction: string;
      latestBlockhash: {
        blockhash: string;
        lastValidBlockHeight: string;
      };
    };
  };

  const gatewayTx = Transaction.from(Buffer.from(encodedTransaction, "base64"));
  return gatewayTx;
}

async function sendGatewayTransaction(tx: string, network: "devnet" | "mainnet") {
  const gatewayUrl = `${GATEWAY_ENDPOINT}/v1/${network}?apiKey=${process.env["GATEWAY_API_KEY"]}`;
  const sendGatewayTransactionResponse = await fetch(gatewayUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: "timevault",
      jsonrpc: "2.0",
      method: "sendTransaction",
      params: [tx],
    }),
  });
  const gatewayResponse = await sendGatewayTransactionResponse.json();
  return gatewayResponse;
}

export { buildGatewayTransaction, sendGatewayTransaction };