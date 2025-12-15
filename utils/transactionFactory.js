function formatUPITransfer({
  type = "CR",
  referenceNo,
  name,
  bankShort = "BARB",
  upiId,
}) {
  return (
    `BY TRANSFERUPI/${type}/${referenceNo}/${name.toUpperCase()}\n` +
    `${bankShort}/${upiId}/UPI`
  );
}

function formatNEFTTransfer({
  ifsc,
  neftRef,
  accountRef,
  beneficiaryName,
}) {
  return (
    `BY TRANSFERNEFT*${ifsc}*${neftRef}\n` +
    `${accountRef}*${beneficiaryName.toUpperCase()}`
  );
}

function generateNarration(data) {
  if (data.mode === "UPI") return formatUPITransfer(data);
  if (data.mode === "NEFT") return formatNEFTTransfer(data);
  throw new Error("Unsupported transaction mode");
}

module.exports = { generateNarration };
