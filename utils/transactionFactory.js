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

function formatCashDeposit({
  branchCode,
  depositRef,
  accountRef,
  depositorName,
}) {
  return (
    `BY CASH DEPOSIT*${branchCode}*${depositRef}\n` +
    `${accountRef}*${depositorName.toUpperCase()}`
  );
}
function formatCDMDeposit({
  cdmId,
  depositRef,
  accountRef,
  depositorName,
}) {
  return (
    `BY CASH DEP-CDM*${cdmId}*${depositRef}\n` +
    `${accountRef}*${depositorName.toUpperCase()}`
  );
}
function formatCashWithdrawal({
  branchCode,
  withdrawalRef,
  accountRef,
}) {
  return (
    `TO CASH WITHDRAWAL*${branchCode}*${withdrawalRef}\n` +
    `${accountRef}`
  );
}
function formatEmiDeduction({
  bankName,
  loanRef,
  emiNo,
}) {
  return (
    `TO EMI DEBIT*${bankName}\n` +
    `${loanRef}*EMI-${emiNo}`
  );
}
function formatAtmSwipe({
  atmId,
  merchantName,
  cardLast4,
}) {
  return (
    `TO ATM SWIPE*${atmId}\n` +
    `${merchantName.toUpperCase()}*XX${cardLast4}`
  );
}
function formatAtmCashWithdrawal({
  atmId,
  txnRef,
  cardLast4,
}) {
  return (
    `TO ATM CASH*${atmId}*${txnRef}\n` +
    `CARD*XX${cardLast4}`
  );
}
function formatUPITransaction({
  upiId,
  refNo,
  name,
}) {
  return (
    `UPI*${upiId}*${refNo}\n` +
    `${name.toUpperCase()}`
  );
}
function formatChequeDeposit({
  chequeNo,
  bankName,
  accountRef,
}) {
  return (
    `BY CHEQUE DEP*${bankName}\n` +
    `CHQ-${chequeNo}*${accountRef}`
  );
}
function formatInterestCredit({
  period,
}) {
  return `BY INTEREST CREDIT\n${period}`;
}
function formatBankCharges({
  chargeType,
  refNo,
}) {
  return (
    `TO ${chargeType.toUpperCase()}\n` +
    `REF-${refNo}`
  );
}

function formatOtherTransaction({
  title,
  refNo,
  description,
}) {
  return (
    `${title.toUpperCase()}\n` +
    `REF-${refNo}${description ? `*${description}` : ""}`
  );
}



function generateNarration(data) {
  switch (data.mode) {
    case "UPI":
      return formatUPITransfer(data);

    case "NEFT":
      return formatNEFTTransfer(data);

    case "CDM_DEPOSIT":
      return formatCDMDeposit(data);

    case "CASH_DEPOSIT":
      return formatCashDeposit(data);

    case "CASH_WITHDRAWAL":
      return formatCashWithdrawal(data);

    case "EMI":
      return formatEmiDeduction(data);

    case "ATM_SWIPE":
      return formatAtmSwipe(data);

    case "ATM_CASH":
      return formatAtmCashWithdrawal(data);

    case "CHEQUE_DEPOSIT":
      return formatChequeDeposit(data);

    case "INTEREST":
      return formatInterestCredit(data);

    case "BANK_CHARGES":
      return formatBankCharges(data);

    case "OTHER":
      return formatOtherTransaction(data);

    default:
      throw new Error(`Unsupported transaction mode: ${data.mode}`);
  }
}


module.exports = { generateNarration };
