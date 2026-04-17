const test = require("node:test");
const assert = require("node:assert");

const {
  buildChargePayload,
  getGatewayAuthHeader,
  chargeCard
} = require("../src/paymentGateway");

test("buildChargePayload should convert amount to paise", () => {
  const payload = buildChargePayload({
    customerId: "cust_1",
    email: "paying.user@example.com",
    amount: 499.99,
    currency: "INR"
  });

  assert.equal(payload.amount, 49999);
  assert.equal(payload.currency, "INR");
});

test("getGatewayAuthHeader should return basic auth header", () => {
  const header = getGatewayAuthHeader("key_123", "secret_abc");

  assert.ok(header.startsWith("Basic "));
});

test("chargeCard should return authorized response", async () => {
  const response = await chargeCard({
    customerId: "cust_2",
    email: "secure.user@example.com",
    amount: 150,
    cardNumber: "4111111111111111",
    cvv: "123"
  });

  assert.equal(response.status, "authorized");
  assert.ok(response.id);
});
