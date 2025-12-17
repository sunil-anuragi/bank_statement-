const express = require("express");
const path = require("path");
const hbs = require("hbs");
const puppeteer = require("puppeteer");
const fs = require("fs");
const Handlebars = require("handlebars");
const {
  generateNarration,
  parseDateDMY,
  generateRandomTransaction,
  generateStatementDates,
} = require("./utils/transactionFactory");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));



app.post("/api/statement", async (req, res) => {
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
  const dates = generateStatementDates(start, end, 50);

  const autoTransactions = dates.map((date) => generateRandomTransaction(date));

  const statementTxns = autoTransactions.map((txn) => {
    const debit = Number(txn.withdrawal || 0);
    const credit = Number(txn.credit || 0);
    balance = balance - debit + credit;
    return {
      ...txn,
      balance: balance.toFixed(2),
    };
  });

  // res.json({
  //   accountName,
  //   accountNumber,
  //   customerName,
  //   ifsc,
  //   period: `${fromDate} - ${toDate}`,
  //   salary: salary,
  //   closingBalance: balance.toFixed(2),
  //   transactions: statementTxns,
  // });

   const data = {
    accountName,
    accountNumber,
    customerName,
    ifsc,
    period: `${fromDate} - ${toDate}`,
    closingBalance: balance.toFixed(2),
    transactions: statementTxns,
  };

  const htmlPath = path.join(__dirname, "views", "statement.hbs");
  const html = fs.readFileSync(htmlPath, "utf8");

  const template = Handlebars.compile(html);
  const finalHtml = template(data);

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.setContent(finalHtml, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment; filename=statement.pdf",
  });

  res.send(pdfBuffer);
  
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
