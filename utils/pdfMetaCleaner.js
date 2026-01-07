const fs = require("fs/promises");
const path = require("path");
const os = require("os");
const { exiftool } = require("exiftool-vendored");
const crypto = require("crypto");

async function removeTitleCreator(pdfBuffer) {
  // ✅ cross-platform temp directory
  const tempDir = os.tmpdir();

  const tempFile = path.join(
    tempDir,
    `${crypto.randomUUID()}.pdf`
  );

  try {
    // 1️⃣ write buffer → temp file
    await fs.writeFile(tempFile, pdfBuffer);

    // 2️⃣ remove ONLY Title & Creator
    await exiftool.write(
      tempFile,
      { Title: null, Creator: null,Producer: "iText 2.0.4 (by lowagie.com)"},
      ["-overwrite_original"]
    );

    // 3️⃣ read cleaned PDF
    return await fs.readFile(tempFile);
  } finally {
    // 4️⃣ cleanup
    await fs.unlink(tempFile).catch(() => {});
  }
}

module.exports = { removeTitleCreator };
