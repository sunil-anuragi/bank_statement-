const e = require("express");

function formatUPITransfer({
  type = "CR",
  referenceNo,
  name,
  bankShort = "BARB",
  upiId,
}) {
  return (
    `UPI/${type}/${referenceNo}/${name.toUpperCase()}\n` +
    `${bankShort}/${upiId}/UPI`
  );
}

function formatNEFTTransfer({ ifsc, neftRef, accountRef, beneficiaryName }) {
  return (
    `NEFT*${ifsc}*${neftRef}\n` + `*${beneficiaryName.toUpperCase()}*Salary-`
  );
}

function formatCashDeposit({
  branchCode,
  depositRef,
  accountRef,
  depositorName,
}) {
  return (
    `CASH DEPOSIT*${branchCode}*${depositRef}\n` +
    `${accountRef}*${depositorName.toUpperCase()}`
  );
}
function formatCDMDeposit({ cdmId, depositRef, accountRef, depositorName }) {
  return (
    `CASH DEP-CDM*${cdmId}*${depositRef}\n` +
    `${accountRef}*${depositorName.toUpperCase()}`
  );
}
function formatCashWithdrawal({ branchCode, withdrawalRef, accountRef }) {
  return `CASH WITHDRAWAL*${branchCode}*${withdrawalRef}\n` + `${accountRef}`;
}
function formatEmiDeduction({ bankName, loanRef, emiNo }) {
  return `EMI DEBIT*${bankName}\n` + `${loanRef}*EMI-${emiNo}`;
}
function formatAtmSwipe({ atmId, merchantName, cardLast4 }) {
  return (
    `ATM SWIPE*${atmId}\n` + `${merchantName.toUpperCase()}*XX${cardLast4}`
  );
}
function formatAtmCashWithdrawal({ atmId, txnRef, cardLast4 }) {
  return `ATM CASH*${atmId}*${txnRef}\n` + `CARD*XX${cardLast4}`;
}
function formatUPITransaction({ upiId, refNo, name }) {
  return `UPI*${upiId}*${refNo}\n` + `${name.toUpperCase()}`;
}
function formatChequeDeposit({ chequeNo, bankName, accountRef }) {
  return `CHEQUE DEP*${bankName}\n` + `CHQ-${chequeNo}*${accountRef}`;
}
function formatInterestCredit({ period }) {
  return `INTEREST CREDIT\n${period}`;
}
function formatBankCharges({ chargeType, refNo }) {
  return `${chargeType.toUpperCase()}\n` + `REF-${refNo}`;
}

function formatOtherTransaction({ title, refNo, description }) {
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

function parseDateDMY(dateStr) {
  const [dd, mm, yyyy] = dateStr.split("-");
  return new Date(`${yyyy}-${mm}-${dd}`);
}

const names = [
  "Rahul Kumar",
  "Amit Sharma",
  "Zomato",
  "Amazon Pay",
  "Swiggy",
  "Flipkart",
  "Electricity Bill",
  "Petrol Pump",
];

const banks = ["SBI", "HDFC", "ICICI", "AXIS", "PNB"];
const upiIds = ["paytm", "phonepe", "googlepay", "amazonpay"];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomAmount(min = 100, max = 8000) {
  return (Math.floor(Math.random() * (max - min + 1)) + min).toFixed(2);
}

function randomDateBetween(start, end) {
  const d = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return d.toISOString().slice(0, 10).split("-").reverse().join("-");
}

function formatDateDMY(date) {
  const d = date instanceof Date ? date : new Date(date);

  if (isNaN(d)) {
    throw new Error("Invalid date passed to formatDateDMY");
  }

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
}

function generateStatementDates(startDate, endDate, count) {
  const startTime = new Date(startDate).getTime();
  const endTime = new Date(endDate).getTime();

  if (count <= 1) {
    return [new Date(startTime).toISOString().split("T")[0]];
  }
  const gap = Math.floor((endTime - startTime) / (count - 1));

  return Array.from({ length: count }, (_, i) => {
    const date = new Date(startTime + gap * i);
    return formatDate(date);
    // return date.toISOString().split("T")[0]; // YYYY-MM-DD
  });
}
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

function isSalaryDate(date, salaryDay) {
  const d = new Date(date);
  return d.getDate() === salaryDay;
}
let salaryNEFTDone = false;
let emiDone = false;
let bankChargeCount = 0;

function resetStatementFlags() {
  salaryNEFTDone = false;
  emiDone = false;
  bankChargeCount = 0;
}

const salaryDoneForMonth = {};
const salaryDayForMonth = {};

function getRandomSalaryDay(monthKey) {
  if (!salaryDayForMonth[monthKey]) {
    salaryDayForMonth[monthKey] = Math.floor(Math.random() * 10) + 1;
  }
  return salaryDayForMonth[monthKey];
}

function getMonthKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${d.getMonth() + 1}`; // e.g. 2025-1
}

function isSalaryDate(date, salaryDay) {
  return new Date(date).getDate() === salaryDay;
}

function generateRandomTransaction(
  date,
  salary = 50000,
  // salaryDay = 6,
  bankName = "HDFC BANK",
  salaryRefName = "ABC PRIVATE LIMITED"
) {
  const r = Math.random();
  const monthKey = getMonthKey(date);
  console.log("Month Key:", monthKey);
  const salaryDay = getRandomSalaryDay(monthKey);

  // ✅ SALARY CREDIT (once per month)
  if (!salaryDoneForMonth[monthKey] && isSalaryDate(date, salaryDay)) {
    salaryDoneForMonth[monthKey] = true;

    return {
      date,
      narration: formatNEFTTransfer({
        ifsc: "SBIN" + Math.floor(100000 + Math.random() * 900000),
        neftRef: "HDFC" + Math.floor(100000 + Math.random() * 900000),

        // accountRef: Math.floor(1000000000000 + Math.random() * 9000000000000),
        beneficiaryName: bankName,
      }),
      chequeNo: "NEFT",
      withdrawal: "",
      credit: salary,
    };
  }

  if (!emiDone && r < 0.1) {
    emiDone = true;

    return {
      date,
      narration: formatEmiDeduction({
        bankName: "HDFC BANK",
        loanRef:
          "HL" + Math.floor(1000000000000 + Math.random() * 9000000000000),
        emiNo: Math.floor(1 + Math.random() * 36),
      }),
      chequeNo: "",
      withdrawal: randomAmount(8000, 20000),
      credit: "",
    };
  }

  if (bankChargeCount < 2 && r < 0.15) {
    bankChargeCount++;
    return {
      date,
      narration: "BANK CHARGES",
      chequeNo: "",
      withdrawal: randomAmount(50, 500),
      credit: "",
    };
  }

  if (r < 0.25) {
    return {
      date,
      narration: formatCDMDeposit({
        cdmId: "CDM" + Math.floor(100 + Math.random() * 900),
        depositRef: Math.floor(100000 + Math.random() * 900000),
        accountRef: Math.floor(10000000 + Math.random() * 90000000),
        depositorName: randomFrom(names),
      }),
      chequeNo: "",
      withdrawal: "",
      credit: randomAmount(2000, 15000),
    };
  }

  if (r < 0.35) {
    return {
      date,
      narration: formatAtmCashWithdrawal({
        atmId: "ATM" + Math.floor(1000 + Math.random() * 9000),
        txnRef: Math.floor(100000 + Math.random() * 900000),
        cardLast4: Math.floor(1000 + Math.random() * 9000),
      }),
      chequeNo: "",
      withdrawal: randomAmount(1000, 10000),
      credit: "",
    };
  }

  const isCredit = Math.random() < 0.4;

  return {
    date,
    narration: formatUPITransfer({
      type: isCredit ? "CR" : "DR",
      referenceNo: Math.floor(100000000000 + Math.random() * 900000000000),
      name: randomFrom(names),
      bankShort: randomFrom(banks),
      upiId: `${randomFrom(names).toLowerCase().replace(" ", "")}@${randomFrom(
        upiIds
      )}`,
    }),
    chequeNo: Math.floor(
      1000000000000 + Math.random() * 9000000000000
    ).toString(),
    withdrawal: isCredit ? "" : randomAmount(100, 5000),
    credit: isCredit ? randomAmount(100, 8000) : "",
  };
}

module.exports = {
  generateNarration,
  parseDateDMY,
  generateRandomTransaction,
  generateStatementDates,
  resetStatementFlags,
};
