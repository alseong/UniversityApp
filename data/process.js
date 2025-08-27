// Use this code in browser console or Node.js
const fs = require("fs");
const csvContent = fs.readFileSync(
  "/Users/minjunseong/Desktop/past_data.csv",
  "utf8"
);
const lines = csvContent.split(/\r?\n/);
const headers = lines[1].split(",").map((h) => h.trim());

const allData = [];
for (let i = 2; i < lines.length; i++) {
  const line = lines[i].trim();
  if (line === "") continue;

  const values = [];
  let current = "";
  let inQuotes = false;

  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());

  if (values.length >= headers.length) {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = values[index] || "";
    });
    allData.push(record);
  }
}

const completeJSON = {
  metadata: {
    source: "past_data.csv",
    processed_at: new Date().toISOString(),
    total_records: allData.length,
    headers: headers,
  },
  data: allData,
};

fs.writeFileSync("data_raw.json", JSON.stringify(completeJSON, null, 2));
