const fs = require("fs");

// Load the final data
const finalData = JSON.parse(fs.readFileSync("data_final.json", "utf8"));

// Filter for accepted students with valid percentage grades (50-100)
const acceptedRecords = finalData.data.filter(
  (record) =>
    record.Status === "Accepted" &&
    record.Average !== null &&
    typeof record.Average === "number" &&
    record.Average >= 50 &&
    record.Average <= 100
);

// Group by program and calculate averages
const programData = {};

acceptedRecords.forEach((record) => {
  record.Programs.forEach((program) => {
    if (!programData[program]) {
      programData[program] = [];
    }
    programData[program].push(record.Average);
  });
});

// Calculate average for each program and sort by competitiveness
const stats = Object.entries(programData)
  .map(([name, grades]) => ({
    name,
    averageGrade:
      Math.round(
        (grades.reduce((sum, grade) => sum + grade, 0) / grades.length) * 10
      ) / 10,
    recordCount: grades.length,
  }))
  .filter((stat) => stat.recordCount >= 10) // Only include programs with 10+ records
  .sort((a, b) => b.averageGrade - a.averageGrade); // Sort by highest average (most competitive)

console.log(
  "📚 MOST COMPETITIVE PROGRAMS (by average grade of accepted students)\n"
);
console.log(
  "Rank | Program                              | Avg Grade | Records | Competitiveness"
);
console.log("-".repeat(85));

stats.forEach((program, index) => {
  const getCompetitivenessLabel = (averageGrade) => {
    if (averageGrade >= 96) return "Extremely Competitive";
    if (averageGrade >= 94) return "Highly Competitive";
    if (averageGrade >= 92) return "Very Competitive";
    if (averageGrade >= 90) return "Competitive";
    return "Moderate";
  };

  const rank = (index + 1).toString().padStart(4);
  const name = program.name.padEnd(36);
  const grade = (program.averageGrade + "%").padStart(9);
  const count = program.recordCount.toString().padStart(7);
  const level = getCompetitivenessLabel(program.averageGrade);

  console.log(`${rank} | ${name} | ${grade} | ${count} | ${level}`);
});

console.log("\n📊 Summary:");
console.log(`Total programs analyzed: ${stats.length}`);
console.log(`Total accepted student records: ${acceptedRecords.length}`);
