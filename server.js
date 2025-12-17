const express = require("express");
const path = require("path");
const hbs = require("hbs");
const puppeteer = require("puppeteer");
const { generateNarration } = require("./utils/transactionFactory");

const app = express();
const PORT = 3000;

// view engine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// static files (logo)
app.use(express.static(path.join(__dirname, "public")));

// HOME (Preview in browser)
app.get("/", (req, res) => {
  res.render("statement", {
    logoUrl: "/logo.png",
    watermarkurl: "/background.png",
    accountName: "Savings Account",
    accountNumber: "1234567890",
    customerName: "Rahul Sharma",
    ifsc: "KOTL0001234",
    period: "01 Aug 2025 - 31 Aug 2025",
    openingBalance: 25000,

    transactions: [
      {
        date: "01-08-2025",
        narration: generateNarration({
          mode: "UPI",
          type: "CR",
          referenceNo: "521379237095",
          name: "Shah Vij",
          bankShort: "BARB",
          upiId: "rajkumar95",
        }),
        chequeNo: "482931",
        withdrawal: "",
        credit: "2500.00",
      },     
      {
        date: "02-08-2025",
        narration: generateNarration({
          mode: "UPI",
          type: "DR",
          referenceNo: "782345987234",
          name: "Rohit Kumar",
          bankShort: "SBI",
          upiId: "rohit@upi",
        }),
        chequeNo: "739284",
        withdrawal: "1800.00",
        credit: "",
      },
      {
        date: "03-08-2025",
        narration: generateNarration({
          mode: "NEFT",
          ifsc: "UTIB0003877",
          neftRef: "AXISP007",
          accountRef: "37844961",
          beneficiaryName: "Iyyappan Enterpr",
        }),
        chequeNo: "NEFT893421",
        withdrawal: "",
        credit: "30000.00",
      },
      {
        date: "04-08-2025",
        narration: generateNarration({
          mode: "UPI",
          type: "DR",
          referenceNo: "993421234111",
          name: "Swiggy Order",
          bankShort: "HDFC",
          upiId: "swiggy@hdfc",
        }),
        chequeNo: "665421",
        withdrawal: "650.00",
        credit: "",
      },
      {
        date: "05-08-2025",
        narration: generateNarration({
          mode: "UPI",
          type: "DR",
          referenceNo: "663421111987",
          name: "Zomato",
          bankShort: "ICICI",
          upiId: "zomato@icici",
        }),
        chequeNo: "884212",
        withdrawal: "820.00",
        credit: "",
      },
      {
        date: "06-08-2025",
        narration: generateNarration({
          mode: "UPI",
          type: "CR",
          referenceNo: "234567891234",
          name: "Amit Sharma",
          bankShort: "PNB",
          upiId: "amit@pnb",
        }),
        chequeNo: "129884",
        withdrawal: "",
        credit: "4200.00",
      },
      {
        date: "07-08-2025",
        narration: generateNarration({
          mode: "UPI",
          type: "DR",
          referenceNo: "873421222333",
          name: "Petrol Pump",
          bankShort: "SBI",
          upiId: "fuel@sbi",
        }),
        chequeNo: "998721",
        withdrawal: "3000.00",
        credit: "",
      },
      {
        date: "08-08-2025",
        narration: generateNarration({
          mode: "UPI",
          type: "DR",
          referenceNo: "111223344556",
          name: "Amazon Pay",
          bankShort: "HDFC",
          upiId: "amazon@hdfc",
        }),
        chequeNo: "774321",
        withdrawal: "5400.00",
        credit: "",
      },
      {
        date: "09-08-2025",
        narration: generateNarration({
          mode: "UPI",
          type: "CR",
          referenceNo: "888777666555",
          name: "Refund Amazon",
          bankShort: "HDFC",
          upiId: "refund@hdfc",
        }),
        chequeNo: "221984",
        withdrawal: "",
        credit: "1200.00",
      },
      {
        date: "10-08-2025",
        narration: generateNarration({
          mode: "UPI",
          type: "DR",
          referenceNo: "999888777666",
          name: "Electricity Bill",
          bankShort: "SBI",
          upiId: "power@sbi",
        }),
        chequeNo: "883210",
        withdrawal: "2400.00",
        credit: "",
      },
      {
        date: "11-08-2025",
        narration: generateNarration({
          mode: "NEFT",
          ifsc: "HDFC0001234",
          neftRef: "HDFCNEFT01",
          accountRef: "99887766",
          beneficiaryName: "ABC Pvt Ltd",
        }),
        chequeNo: "NEFT554321",
        withdrawal: "",
        credit: "15000.00",
      },
      {
        date: "12-08-2025",
        narration: generateNarration({
          mode: "UPI",
          type: "DR",
          referenceNo: "554433221100",
          name: "Flipkart",
          bankShort: "ICICI",
          upiId: "flipkart@icici",
        }),
        chequeNo: "334219",
        withdrawal: "7600.00",
        credit: "",
      },
      {
        date: "13-08-2025",
        narration: generateNarration({
          mode: "UPI",
          type: "CR",
          referenceNo: "333222111000",
          name: "Friend Transfer",
          bankShort: "AXIS",
          upiId: "friend@axis",
        }),
        chequeNo: "665430",
        withdrawal: "",
        credit: "5000.00",
      },
      {
        date: "14-08-2025",
        narration: generateNarration({
          mode: "UPI",
          type: "DR",
          referenceNo: "121212121212",
          name: "Medical Store",
          bankShort: "SBI",
          upiId: "medical@sbi",
        }),
        chequeNo: "992134",
        withdrawal: "1350.00",
        credit: "",
      },
      {
        date: "15-08-2025",
        narration: generateNarration({
          mode: "NEFT",
          ifsc: "ICIC0004321",
          neftRef: "ICICNEFT09",
          accountRef: "66554433",
          beneficiaryName: "XYZ Logistics",
        }),
        chequeNo: "NEFT782199",
        withdrawal: "",
        credit: "22000.00",
      },
      {
        date: "16-08-2025",
        narration: generateNarration({
          mode: "UPI",
          type: "DR",
          referenceNo: "787878787878",
          name: "Restaurant",
          bankShort: "HDFC",
          upiId: "food@hdfc",
        }),
        chequeNo: "441230",
        withdrawal: "2100.00",
        credit: "",
      },
      {
        date: "17-08-2025",
        narration: generateNarration({
          mode: "UPI",
          type: "CR",
          referenceNo: "909090909090",
          name: "Bonus Credit",
          bankShort: "SBI",
          upiId: "bonus@sbi",
        }),
        chequeNo: "887654",
        withdrawal: "",
        credit: "8000.00",
      },
      {
        date: "18-08-2025",
        narration: generateNarration({
          mode: "UPI",
          type: "DR",
          referenceNo: "343434343434",
          name: "Internet Bill",
          bankShort: "ACT",
          upiId: "internet@act",
        }),
        chequeNo: "229981",
        withdrawal: "999.00",
        credit: "",
      },
      {
        date: "19-08-2025",
        narration: generateNarration({
          mode: "UPI",
          type: "CR",
          referenceNo: "565656565656",
          name: "Cashback",
          bankShort: "PAYTM",
          upiId: "cashback@paytm",
        }),
        chequeNo: "334567",
        withdrawal: "",
        credit: "350.00",
      },
      {
        date: "20-08-2025",
        narration: generateNarration({
          mode: "UPI",
          type: "DR",
          referenceNo: "787654321987",
          name: "Grocery Store",
          bankShort: "SBI",
          upiId: "grocery@sbi",
        }),
        chequeNo: "774455",
        withdrawal: "4200.00",
        credit: "",
      },
    ],
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
