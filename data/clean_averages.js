#!/usr/bin/env node

/**
 * Clean Averages Script
 *
 * Converts the "Average" field from strings to numbers in data_fully_processed.json
 * Handles edge cases like empty strings, non-numeric values, etc.
 */

const fs = require("fs");
const path = require("path");

function cleanAverages() {
  console.log("🧹 Starting average field cleanup...");

  const inputFile = "data_fully_processed.json";
  const backupFile = "data_fully_processed_backup.json";

  try {
    // Read the data
    console.log("📖 Loading data from", inputFile);
    const data = JSON.parse(fs.readFileSync(inputFile, "utf8"));

    // Create backup
    console.log("💾 Creating backup as", backupFile);
    fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));

    // Track conversion statistics
    let stats = {
      total: 0,
      converted: 0,
      already_numeric: 0,
      empty_string: 0,
      invalid: 0,
      null_undefined: 0,
    };

    // Process each record
    console.log("⚙️  Processing records...");
    data.data.forEach((record, index) => {
      stats.total++;

      const original = record.Average;

      // Handle different cases
      if (original === null || original === undefined) {
        record.Average = null;
        stats.null_undefined++;
      } else if (typeof original === "number") {
        // Already a number, keep as is
        stats.already_numeric++;
      } else if (original === "" || original === " ") {
        // Empty string, set to null
        record.Average = null;
        stats.empty_string++;
      } else if (typeof original === "string") {
        // Try to convert string to number
        const trimmed = original.trim();
        const parsed = parseFloat(trimmed);

        if (!isNaN(parsed) && isFinite(parsed)) {
          // Valid number
          record.Average = parsed;
          stats.converted++;
        } else {
          // Invalid number, set to null and log
          console.log(
            `⚠️  Invalid average at record ${index + 1}: "${original}"`
          );
          record.Average = null;
          stats.invalid++;
        }
      } else {
        // Unexpected type
        console.log(
          `⚠️  Unexpected type at record ${index + 1}: ${typeof original} = "${original}"`
        );
        record.Average = null;
        stats.invalid++;
      }
    });

    // Update metadata
    data.metadata.last_updated = new Date().toISOString();
    data.metadata.processing_notes = data.metadata.processing_notes || [];
    data.metadata.processing_notes.push({
      timestamp: new Date().toISOString(),
      operation: "average_field_cleanup",
      description: "Converted Average field from strings to numbers",
      stats: stats,
    });

    // Save the cleaned data
    console.log("💾 Saving cleaned data...");
    fs.writeFileSync(inputFile, JSON.stringify(data, null, 2));

    // Print statistics
    console.log("\n📊 AVERAGE FIELD CLEANUP RESULTS:");
    console.log("=====================================");
    console.log(`Total records:           ${stats.total.toLocaleString()}`);
    console.log(`Converted from string:   ${stats.converted.toLocaleString()}`);
    console.log(
      `Already numeric:         ${stats.already_numeric.toLocaleString()}`
    );
    console.log(
      `Empty strings → null:    ${stats.empty_string.toLocaleString()}`
    );
    console.log(`Invalid values → null:   ${stats.invalid.toLocaleString()}`);
    console.log(
      `Null/undefined:          ${stats.null_undefined.toLocaleString()}`
    );

    const validAverages = stats.converted + stats.already_numeric;
    const invalidAverages =
      stats.empty_string + stats.invalid + stats.null_undefined;

    console.log("\n📈 SUMMARY:");
    console.log(
      `Valid numeric averages:  ${validAverages.toLocaleString()} (${((validAverages / stats.total) * 100).toFixed(1)}%)`
    );
    console.log(
      `Missing/invalid:         ${invalidAverages.toLocaleString()} (${((invalidAverages / stats.total) * 100).toFixed(1)}%)`
    );

    console.log("\n✅ Average field cleanup completed successfully!");
    console.log(`📁 Backup saved as: ${backupFile}`);
    console.log(`📁 Updated file: ${inputFile}`);
  } catch (error) {
    console.error("❌ Error during average cleanup:", error.message);
    process.exit(1);
  }
}

// Run the cleanup
cleanAverages();
