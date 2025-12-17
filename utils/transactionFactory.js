const e = require("express");

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
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
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
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  });

}


function generateRandomTransaction(date) {
  const isUPI = Math.random() < 0.75; // 🔥 75% UPI
  const isCredit = Math.random() < 0.4; // 40% credit

  if (isUPI) {
    return {
      date: date,
      narration: formatUPITransfer({
        type: isCredit ? "CR" : "DR",
        referenceNo: Math.floor(100000000000 + Math.random() * 900000000000),
        name: randomFrom(names),
        bankShort: randomFrom(banks),
        upiId: `${randomFrom(names).toLowerCase().replace(" ", "")}@${randomFrom(upiIds)}`,
      }),
      chequeNo: Math.floor(100000 + Math.random() * 900000).toString(),
      withdrawal: isCredit ? "" : randomAmount(),
      credit: isCredit ? randomAmount() : "",
    };
  }

  // 🔹 NEFT (less frequent)
  return {
     date: date,
    narration: formatNEFTTransfer({
      ifsc: "HDFC0001234",
      neftRef: "NEFT" + Math.floor(10000 + Math.random() * 90000),
      accountRef: Math.floor(10000000 + Math.random() * 90000000),
      beneficiaryName: randomFrom(names),
    }),
    chequeNo: "NEFT" + Math.floor(100000 + Math.random() * 900000),
    withdrawal: "",
    credit: randomAmount(5000, 25000),
  };
}


module.exports = { generateNarration,parseDateDMY,generateRandomTransaction,generateStatementDates};
