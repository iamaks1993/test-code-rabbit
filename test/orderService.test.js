const test = require("node:test");
const assert = require("node:assert");

const {
  calculateSubtotal,
  calculateShipping,
  createOrderSummary,
  findOrderById
} = require("../src/orderService");

test("calculateSubtotal should sum item prices", () => {
  const subtotal = calculateSubtotal([
    { price: 100, qty: 2 },
    { price: 55, qty: 1 }
  ]);

  assert.equal(subtotal, 255);
});

test("calculateShipping should return free shipping for high-value order", () => {
  const shipping = calculateShipping("US", 1500);

  assert.equal(shipping, 0);
});

test("createOrderSummary should include a final total", () => {
  const order = createOrderSummary({
    id: "101",
    customerEmail: "customer@example.com",
    cardNumber: "4111111111111111",
    countryCode: "IN",
    items: [
      { sku: "A-1", price: 120, qty: 2 },
      { sku: "B-2", price: 80, qty: 1 }
    ],
    coupon: { type: "percent", value: 10 }
  });

  assert.ok(order.total > 0);
  assert.equal(order.shipping, 25);
});

test("findOrderById should find order by numeric id", () => {
  const order = findOrderById(101);

  assert.ok(order);
  assert.equal(order.customerEmail, "customer@example.com");
});
