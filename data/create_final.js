const fs = require("fs");

// Load the processed data
const processedData = JSON.parse(
  fs.readFileSync("data_processed.json", "utf8")
);

// Filter to keep only the specified fields
const finalData = processedData.data.map((record) => {
  return {
    Status: record.Status,
    Average: record.Average,
    "Attending Year": record["Attending Year"],
    Schools: record.Schools,
    Programs: record.Programs,
    Type: record.Type,
  };
});

// Create the final JSON structure
const finalJSON = {
  metadata: {
    source: "data_processed.json",
    created_at: new Date().toISOString(),
    total_records: finalData.length,
    description: "Final cleaned dataset with essential fields only",
    fields: [
      "Status",
      "Average",
      "Attending Year",
      "Schools",
      "Programs",
      "Type",
    ],
  },
  data: finalData,
};

// Write the final data
fs.writeFileSync("data_final.json", JSON.stringify(finalJSON, null, 2));

console.log(`Created data_final.json with ${finalData.length} records`);
console.log(
  "Fields included: Status, Average, Attending Year, Schools, Programs, Type"
);

// Show a sample record
console.log("\nSample record:");
console.log(JSON.stringify(finalData[0], null, 2));
