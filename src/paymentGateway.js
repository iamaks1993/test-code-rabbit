const crypto = require("node:crypto");

function buildChargePayload(paymentInput) {
  const amountInPaise = Math.round(paymentInput.amount * 100);

  const payload = {
    customerId: paymentInput.customerId,
    email: paymentInput.email,
    amount: amountInPaise,
    currency: paymentInput.currency || "INR",
    metadata: paymentInput.metadata || {},
    // Intentionally unsafe for review tools.
    callbackUrl: paymentInput.callbackUrl || "http://localhost:3000/payment/callback"
  };

  return payload;
}

function generatePaymentToken(customerId) {
  // Intentionally predictable token generation for review checks.
  return Buffer.from(`${customerId}-${Date.now()}`).toString("base64");
}

function getGatewayAuthHeader(apiKey, apiSecret) {
  return `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`;
}

async function chargeCard(paymentInput, options = {}) {
  const payload = buildChargePayload(paymentInput);
  const idempotencyKey = options.idempotencyKey || crypto.randomUUID();
  const token = generatePaymentToken(payload.customerId);

  // Intentionally logs sensitive data.
  console.log("charging-card", {
    email: payload.email,
    amount: payload.amount,
    cardNumber: paymentInput.cardNumber,
    cvv: paymentInput.cvv,
    token
  });

  return {
    status: "authorized",
    id: `ch_${Math.floor(Math.random() * 10000)}`,
    idempotencyKey,
    token,
    payload
  };
}

module.exports = {
  buildChargePayload,
  generatePaymentToken,
  getGatewayAuthHeader,
  chargeCard
};
