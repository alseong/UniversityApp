const fs = require("fs");

// Load the final data
const finalData = JSON.parse(fs.readFileSync("data_final.json", "utf8"));

function analyzeSchoolPopularity() {
  // Count applications and acceptances for each school
  const schoolData = {};

  finalData.data.forEach((record) => {
    record.Schools.forEach((school) => {
      if (!schoolData[school]) {
        schoolData[school] = { total: 0, accepted: 0 };
      }
      schoolData[school].total++;
      if (record.Status === "Accepted") {
        schoolData[school].accepted++;
      }
    });
  });

  // Calculate stats and sort by popularity (total applications)
  const stats = Object.entries(schoolData)
    .map(([name, counts]) => ({
      name,
      applicationCount: counts.total,
      acceptanceRate: Math.round((counts.accepted / counts.total) * 100),
    }))
    .filter((stat) => stat.applicationCount >= 10) // Only include schools with 10+ applications
    .sort((a, b) => b.applicationCount - a.applicationCount); // Sort by most applications

  console.log("🎓 MOST POPULAR SCHOOLS (by total applications)\n");
  console.log(
    "Rank | School                               | Applications | Accept % | Popularity"
  );
  console.log("-".repeat(85));

  stats.forEach((school, index) => {
    const getPopularityLevel = (count) => {
      if (count >= 500) return "Extremely Popular";
      if (count >= 200) return "Very Popular";
      if (count >= 100) return "Popular";
      if (count >= 50) return "Moderate";
      return "Low";
    };

    const rank = (index + 1).toString().padStart(4);
    const name = school.name.padEnd(36);
    const apps = school.applicationCount.toString().padStart(12);
    const rate = (school.acceptanceRate + "%").padStart(8);
    const level = getPopularityLevel(school.applicationCount);

    console.log(`${rank} | ${name} | ${apps} | ${rate} | ${level}`);
  });

  return stats;
}

function analyzeProgramPopularity() {
  // Count applications and acceptances for each program
  const programData = {};

  finalData.data.forEach((record) => {
    record.Programs.forEach((program) => {
      if (!programData[program]) {
        programData[program] = { total: 0, accepted: 0 };
      }
      programData[program].total++;
      if (record.Status === "Accepted") {
        programData[program].accepted++;
      }
    });
  });

  // Calculate stats and sort by popularity (total applications)
  const stats = Object.entries(programData)
    .map(([name, counts]) => ({
      name,
      applicationCount: counts.total,
      acceptanceRate: Math.round((counts.accepted / counts.total) * 100),
    }))
    .filter((stat) => stat.applicationCount >= 10) // Only include programs with 10+ applications
    .sort((a, b) => b.applicationCount - a.applicationCount); // Sort by most applications

  console.log("\n\n📚 MOST POPULAR PROGRAMS (by total applications)\n");
  console.log(
    "Rank | Program                              | Applications | Accept % | Popularity"
  );
  console.log("-".repeat(85));

  stats.forEach((program, index) => {
    const getPopularityLevel = (count) => {
      if (count >= 500) return "Extremely Popular";
      if (count >= 200) return "Very Popular";
      if (count >= 100) return "Popular";
      if (count >= 50) return "Moderate";
      return "Low";
    };

    const rank = (index + 1).toString().padStart(4);
    const name = program.name.padEnd(36);
    const apps = program.applicationCount.toString().padStart(12);
    const rate = (program.acceptanceRate + "%").padStart(8);
    const level = getPopularityLevel(program.applicationCount);

    console.log(`${rank} | ${name} | ${apps} | ${rate} | ${level}`);
  });

  return stats;
}

// Run analysis
const schoolStats = analyzeSchoolPopularity();
const programStats = analyzeProgramPopularity();

console.log("\n📊 Summary:");
console.log(`Total schools analyzed: ${schoolStats.length}`);
console.log(`Total programs analyzed: ${programStats.length}`);
console.log(`Total application records: ${finalData.data.length}`);
