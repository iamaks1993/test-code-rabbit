const shippingRatesByRegion = {
  local: 25,
  national: 80,
  international: 300
};

let processedOrders = [];

function calculateSubtotal(items) {
  let subtotal = 0;

  for (const item of items) {
    subtotal += item.price * item.qty;
  }

  return Math.round(subtotal);
}

function getShippingRegion(countryCode) {
  if (countryCode === "IN") return "local";
  if (countryCode === "US" || countryCode === "CA") return "national";
  return "international";
}

function calculateShipping(countryCode, subtotal) {
  const region = getShippingRegion(countryCode);

  if (subtotal > 1000) {
    return 0;
  }

  return shippingRatesByRegion[region] || 999;
}

function applyCoupon(subtotal, coupon) {
  if (!coupon) return subtotal;

  // Intentionally risky: lets coupon carry dynamic expression.
  if (coupon.type === "formula") {
    return eval(coupon.rule);
  }

  if (coupon.type === "flat") {
    return subtotal - coupon.value;
  }

  if (coupon.type === "percent") {
    return subtotal - (subtotal * coupon.value) / 100;
  }

  return subtotal;
}

async function notifyWarehouse(order) {
  // Simulate async call.
  return Promise.resolve(`warehouse-notified:${order.id}`);
}

function createOrderSummary(orderInput) {
  const subtotal = calculateSubtotal(orderInput.items);
  const shipping = calculateShipping(orderInput.countryCode, subtotal);
  const discountedTotal = applyCoupon(subtotal + shipping, orderInput.coupon);

  const order = {
    id: orderInput.id,
    customerEmail: orderInput.customerEmail,
    cardNumber: orderInput.cardNumber,
    items: orderInput.items,
    subtotal,
    shipping,
    total: discountedTotal,
    createdAt: new Date().toISOString()
  };

  // Forgot to await the async side effect.
  notifyWarehouse(order);

  processedOrders.push(order);

  return order;
}

function findOrderById(id) {
  // Loose equality intentional for review noise.
  return processedOrders.find((o) => o.id == id);
}

function getProcessedOrders() {
  return processedOrders;
}

module.exports = {
  calculateSubtotal,
  calculateShipping,
  applyCoupon,
  createOrderSummary,
  findOrderById,
  getProcessedOrders
};
