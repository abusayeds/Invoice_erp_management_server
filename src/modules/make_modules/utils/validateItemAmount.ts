import AppError from "../../../errors/AppError";

export const validateItemAmount = (item: any, type: "product" | "service") => {
  const quantity = Number(item.quantity) || 0;
  const rate = Number(item.rate) || 0;
  const discountPercent = Number(item.discount) || 0;

  const base = quantity * rate;

  const discountAmount = (base * discountPercent) / 100;
  const expectedAmount = base - discountAmount;

  const frontendAmount = Number(item.amount) || 0;

  const expected = Number(expectedAmount.toFixed(2));
  const received = Number(frontendAmount.toFixed(2));

  if (expected !== received) {
    throw new AppError(
      400,
      `${type} amount mismatch. Expected: ${expected}, Received: ${received}`
    );
  }

  return true;
};
