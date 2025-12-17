const express = require("express");
const path = require("path");
const hbs = require("hbs");
const puppeteer = require("puppeteer");
const {
  generateNarration,
  parseDateDMY,
  generateRandomTransaction,
  generateSequentialDates,
} = require("./utils/transactionFactory");
const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("statement", {
    logoUrl: "/logo.png",
    watermarkurl: "/watermark.png",
    accountName: "Savings Account",
    accountNumber: "1234567890",
    customerName: "Rahul Sharma",
    ifsc: "KOTL0001234",
    period: "01 Aug 2025 - 31 Aug 2025",
    openingBalance: 25000,
  });
});

app.post("/api/statement", (req, res) => {
  const {
    accountName,
    accountNumber,
    customerName,
    ifsc,
    fromDate,
    toDate,
    salary,
  } = req.body;

  const start = new Date(fromDate);
  const end = new Date(toDate);

  let balance = Number(salary);
  const dates = generateSequentialDates(start, end, 50);

  const autoTransactions = dates.map((date) => generateRandomTransaction(date));

  const filteredTxns = autoTransactions.filter((txn) => {
    const txnDate = txn.date;
    return txnDate >= start && txnDate <= end;
  });

  const statementTxns = filteredTxns.map((txn) => {
    const debit = Number(txn.withdrawal || 0);
    const credit = Number(txn.credit || 0);

    balance = balance - debit + credit;

    return {
      ...txn,
      balance: balance.toFixed(2),
    };
  });

  res.json({
    accountName,
    accountNumber,
    customerName,
    ifsc,
    period: `${fromDate} - ${toDate}`,
    salary: salary,
    closingBalance: balance.toFixed(2),
    transactions: statementTxns,
  });
});

// PDF DOWNLOAD
app.get("/download-pdf", async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`http://localhost:${PORT}`, {
    waitUntil: "networkidle0",
  });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment; filename=kotal-bank-statement.pdf",
  });

  res.send(pdf);
});

// start server
app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
});
