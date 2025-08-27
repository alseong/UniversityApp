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

// Group by university and calculate averages
const universityData = {};

acceptedRecords.forEach((record) => {
  record.Schools.forEach((school) => {
    if (!universityData[school]) {
      universityData[school] = [];
    }
    universityData[school].push(record.Average);
  });
});

// Calculate average for each university and sort by competitiveness
const stats = Object.entries(universityData)
  .map(([name, grades]) => ({
    name,
    averageGrade:
      Math.round(
        (grades.reduce((sum, grade) => sum + grade, 0) / grades.length) * 10
      ) / 10,
    recordCount: grades.length,
  }))
  .filter((stat) => stat.recordCount >= 10) // Only include universities with 10+ records
  .sort((a, b) => b.averageGrade - a.averageGrade); // Sort by highest average (most competitive)

console.log(
  "🏆 MOST COMPETITIVE UNIVERSITIES (by average grade of accepted students)\n"
);
console.log(
  "Rank | University                           | Avg Grade | Records | Competitiveness"
);
console.log("-".repeat(85));

stats.forEach((university, index) => {
  const getCompetitivenessLabel = (averageGrade) => {
    if (averageGrade >= 96) return "Extremely Competitive";
    if (averageGrade >= 94) return "Highly Competitive";
    if (averageGrade >= 92) return "Very Competitive";
    if (averageGrade >= 90) return "Competitive";
    return "Moderate";
  };

  const rank = (index + 1).toString().padStart(4);
  const name = university.name.padEnd(36);
  const grade = (university.averageGrade + "%").padStart(9);
  const count = university.recordCount.toString().padStart(7);
  const level = getCompetitivenessLabel(university.averageGrade);

  console.log(`${rank} | ${name} | ${grade} | ${count} | ${level}`);
});

console.log("\n📊 Summary:");
console.log(`Total universities analyzed: ${stats.length}`);
console.log(`Total accepted student records: ${acceptedRecords.length}`);
console.log(
  `Grade range: ${Math.min(...acceptedRecords.map((r) => r.Average))}% - ${Math.max(...acceptedRecords.map((r) => r.Average))}%`
);
