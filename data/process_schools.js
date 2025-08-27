const fs = require("fs");

// Load the raw data
const rawData = JSON.parse(fs.readFileSync("data_raw.json", "utf8"));

// School name normalization mapping
const schoolNormalizations = {
  // University of Waterloo variations
  "university of waterloo": "University of Waterloo",
  waterloo: "University of Waterloo",
  uwaterloo: "University of Waterloo",
  uw: "University of Waterloo",

  // University of Toronto St. George (main campus)
  "university of toronto": "University of Toronto St. George",
  uoft: "University of Toronto St. George",
  utsg: "University of Toronto St. George",
  "uoft st george": "University of Toronto St. George",
  "university of toronto st george": "University of Toronto St. George",
  "uoft st. george": "University of Toronto St. George",
  "university of toronto - st george campus":
    "University of Toronto St. George",
  "university of toronto (st. george)": "University of Toronto St. George",
  "university of toronto st. george": "University of Toronto St. George",
  toronto: "University of Toronto St. George",

  // University of Toronto Scarborough
  "uoft scarborough": "University of Toronto Scarborough",
  "university of toronto scarborough": "University of Toronto Scarborough",
  utsc: "University of Toronto Scarborough",
  "university of toronto - scarborough campus":
    "University of Toronto Scarborough",
  "u of t scarborough": "University of Toronto Scarborough",
  "uoft utsc": "University of Toronto Scarborough",

  // University of Toronto Mississauga
  "uoft mississauga": "University of Toronto Mississauga",
  "university of toronto mississauga": "University of Toronto Mississauga",
  utm: "University of Toronto Mississauga",
  "u of t mississauga": "University of Toronto Mississauga",
  "uoft utm": "University of Toronto Mississauga",

  // McMaster variations
  mcmaster: "McMaster University",
  "mcmaster university": "McMaster University",
  mac: "McMaster University",

  // Western variations
  western: "Western University",
  "western university": "Western University",
  uwo: "Western University",
  "university of western ontario": "Western University",

  // Queen's variations
  queens: "Queen's University",
  "queen's": "Queen's University",
  "queens university": "Queen's University",
  "queen's university": "Queen's University",

  // York variations
  york: "York University",
  "york university": "York University",
  yorku: "York University",

  // Ryerson/TMU variations
  ryerson: "Toronto Metropolitan University",
  tmu: "Toronto Metropolitan University",
  "toronto metropolitan university": "Toronto Metropolitan University",
  "ryerson university": "Toronto Metropolitan University",

  // Laurier variations
  laurier: "Wilfrid Laurier University",
  "wilfrid laurier": "Wilfrid Laurier University",
  "wilfrid laurier university": "Wilfrid Laurier University",
  wlu: "Wilfrid Laurier University",

  // Carleton variations
  carleton: "Carleton University",
  "carleton university": "Carleton University",

  // University of Ottawa variations
  "university of ottawa": "University of Ottawa",
  uottawa: "University of Ottawa",
  ottawa: "University of Ottawa",

  // McGill variations
  mcgill: "McGill University",
  "mcgill university": "McGill University",

  // Other common variations
  brock: "Brock University",
  "brock university": "Brock University",
  guelph: "University of Guelph",
  "university of guelph": "University of Guelph",
  concordia: "Concordia University",
  "concordia university": "Concordia University",
};

// Program name normalization mapping
const programNormalizations = {
  // Computer Science variations
  "computer science": "Computer Science",
  cs: "Computer Science",
  "computer science co-op": "Computer Science",
  "computer science (co-op)": "Computer Science",
  computing: "Computer Science",
  "comp sci": "Computer Science",
  "computer sci": "Computer Science",

  // Software Engineering
  "software engineering": "Software Engineering",
  "software engineering (co-op)": "Software Engineering",
  se: "Software Engineering",
  "software eng": "Software Engineering",

  // Computer Engineering
  "computer engineering": "Computer Engineering",
  "computer engineering + pey co-op": "Computer Engineering",
  "computer eng": "Computer Engineering",
  ce: "Computer Engineering",

  // Electrical Engineering
  "electrical engineering": "Electrical Engineering",
  "electrical eng": "Electrical Engineering",
  ee: "Electrical Engineering",
  "elec eng": "Electrical Engineering",

  // Mechanical Engineering
  "mechanical engineering": "Mechanical Engineering",
  "mech eng": "Mechanical Engineering",
  "mechanical eng": "Mechanical Engineering",
  "honours mechanical engineering": "Mechanical Engineering",

  // Civil Engineering
  "civil engineering": "Civil Engineering",
  "civil eng": "Civil Engineering",

  // Biomedical Engineering
  "biomedical engineering": "Biomedical Engineering",
  "biomedical eng": "Biomedical Engineering",
  "biomed eng": "Biomedical Engineering",
  bioeng: "Biomedical Engineering",

  // Chemical Engineering
  "chemical engineering": "Chemical Engineering",
  "chem eng": "Chemical Engineering",
  "honours chemical engineering (co-op)": "Chemical Engineering",

  // Engineering Science
  "engineering science": "Engineering Science",
  engsci: "Engineering Science",
  "eng sci": "Engineering Science",

  // General Engineering
  engineering: "Engineering",
  "engineering 1": "Engineering",
  "engineering i": "Engineering",
  "track 1 eng": "Engineering",

  // Business/Commerce variations
  commerce: "Commerce",
  bba: "Business Administration",
  "business administration": "Business Administration",
  "rotman commerce": "Commerce",
  "smith commerce": "Commerce",
  "ivey aeo": "Business Administration",
  "schulich bba": "Business Administration",
  business: "Business Administration",

  // Life Sciences variations
  "life sciences": "Life Sciences",
  "life science": "Life Sciences",
  "biomedical sciences": "Life Sciences",
  "biomed sciences": "Life Sciences",

  // Health Sciences variations
  "health sciences": "Health Sciences",
  "health science": "Health Sciences",

  // Mathematics variations
  math: "Mathematics",
  mathematics: "Mathematics",
  "math & phys": "Mathematics and Physics",
  "mathematics and physics": "Mathematics and Physics",

  // Science variations
  science: "Science",
  "general science": "Science",
  sciences: "Science",

  // Medical Sciences
  "medical sciences": "Medical Sciences",
  "medical sciences (co-op)": "Medical Sciences",
  "med sci": "Medical Sciences",

  // Management Engineering
  "management engineering": "Management Engineering",
  "management eng": "Management Engineering",

  // Mechatronics Engineering
  "mechatronics engineering": "Mechatronics Engineering",
  mechatronics: "Mechatronics Engineering",
  tron: "Mechatronics Engineering",

  // Materials Engineering
  "materials engineering": "Materials Engineering",
  "materials eng": "Materials Engineering",

  // Aerospace Engineering
  "aerospace engineering": "Aerospace Engineering",
  "aerospace eng": "Aerospace Engineering",

  // Other specific programs
  kinesiology: "Kinesiology",
  "kinesiology and physical education": "Kinesiology",
  nursing: "Nursing",
  psychology: "Psychology",
  "political science": "Political Science",
};

function normalizeSchoolName(schoolName) {
  if (!schoolName) return "";

  const normalized = schoolName.toLowerCase().trim();
  return schoolNormalizations[normalized] || schoolName.trim();
}

function normalizeProgramName(programName) {
  if (!programName) return "";

  const normalized = programName.toLowerCase().trim();
  return programNormalizations[normalized] || programName.trim();
}

function normalizeStatus(status) {
  if (!status) return "";

  const normalized = status.toLowerCase().trim();

  const statusMap = {
    accepted: "Accepted",
    rejected: "Rejected",
    deferred: "Deferred",
    waitlisted: "Waitlisted",
    waitlist: "Waitlisted",
  };

  return statusMap[normalized] || status.trim();
}

function normalizeType(type) {
  if (!type) return "";

  const cleaned = type.toLowerCase().trim();

  // Handle various 101 formats
  if (
    cleaned === "101" ||
    cleaned === "domestic" ||
    cleaned === "domestic applicant"
  ) {
    return "101";
  }

  // Handle various 105 formats (international)
  if (cleaned.includes("105") || cleaned.includes("international")) {
    if (cleaned.includes("105d")) return "105D";
    if (cleaned.includes("105f")) return "105F";
    return "105";
  }

  // Handle joke entries or invalid data
  if (cleaned === "harvey specter" || cleaned === "prefer not to say") {
    return "";
  }

  return type.trim();
}

function normalizeAverage(average) {
  if (!average) return null;

  const original = average.trim();
  const lower = original.toLowerCase();

  // Handle special cases
  if (lower === "idk" || lower === "n/a" || lower === "") {
    return null;
  }

  // Extract first numeric value from any format
  const numMatch = original.match(/(\d+(?:\.\d+)?)/);
  if (numMatch) {
    return parseFloat(numMatch[1]);
  }

  // Fallback for unparseable values
  return null;
}

function parseSchools(schoolString) {
  if (!schoolString) return [];

  // Split by common delimiters
  const schools = schoolString
    .split(/[,&+]|(?:\s+and\s+)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map(normalizeSchoolName);

  // Remove duplicates while preserving order
  return [...new Set(schools)];
}

function parsePrograms(programString) {
  if (!programString) return [];

  // Split by common delimiters for programs
  const programs = programString
    .split(/[,&+]|(?:\s+and\s+)|(?:\s*\/\s*)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map(normalizeProgramName);

  // Remove duplicates while preserving order
  return [...new Set(programs)];
}

// Process the data
const processedData = rawData.data.map((record) => {
  const processedRecord = { ...record };

  // Convert School string to normalized array
  processedRecord.Schools = parseSchools(record.School);

  // Convert Program string to normalized array
  processedRecord.Programs = parsePrograms(record.Program);

  // Normalize Status
  processedRecord.Status = normalizeStatus(record.Status);

  // Normalize Type
  processedRecord.Type = normalizeType(record["Type (101/105)"]);

  // Normalize Average (extract numeric value)
  processedRecord.Average = normalizeAverage(record.Average);

  // Keep originals for reference during development
  processedRecord.OriginalSchool = record.School;
  processedRecord.OriginalProgram = record.Program;
  processedRecord.OriginalType = record["Type (101/105)"];
  processedRecord.OriginalAverage = record.Average;

  // Remove the old fields
  delete processedRecord.School;
  delete processedRecord.Program;
  delete processedRecord["Type (101/105)"];

  return processedRecord;
});

// Create the processed JSON
const processedJSON = {
  metadata: {
    source: "data_raw.json",
    processed_at: new Date().toISOString(),
    total_records: processedData.length,
    processing_notes:
      "Schools, Programs, Status, Type, and Average normalized and cleaned",
    original_headers: rawData.metadata.headers,
  },
  data: processedData,
};

// Write the processed data
fs.writeFileSync("data_processed.json", JSON.stringify(processedJSON, null, 2));

console.log(`Processed ${processedData.length} records`);
console.log("All field normalization complete!");

// Generate a summary of school normalizations
const schoolCounts = {};
processedData.forEach((record) => {
  record.Schools.forEach((school) => {
    schoolCounts[school] = (schoolCounts[school] || 0) + 1;
  });
});

console.log("\nTop 15 normalized schools:");
Object.entries(schoolCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15)
  .forEach(([school, count]) => {
    console.log(`${count.toString().padStart(4)}: ${school}`);
  });

// Generate a summary of program normalizations
const programCounts = {};
processedData.forEach((record) => {
  record.Programs.forEach((program) => {
    programCounts[program] = (programCounts[program] || 0) + 1;
  });
});

console.log("\nTop 15 normalized programs:");
Object.entries(programCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15)
  .forEach(([program, count]) => {
    console.log(`${count.toString().padStart(4)}: ${program}`);
  });

// Generate summary of status normalization
const statusCounts = {};
processedData.forEach((record) => {
  const status = record.Status || "Unknown";
  statusCounts[status] = (statusCounts[status] || 0) + 1;
});

console.log("\nStatus distribution:");
Object.entries(statusCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([status, count]) => {
    console.log(`${count.toString().padStart(4)}: ${status}`);
  });

// Generate summary of type normalization
const typeCounts = {};
processedData.forEach((record) => {
  const type = record.Type || "Unknown";
  typeCounts[type] = (typeCounts[type] || 0) + 1;
});

console.log("\nType distribution:");
Object.entries(typeCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([type, count]) => {
    console.log(`${count.toString().padStart(4)}: ${type}`);
  });

// Generate summary of average statistics
const numericAverages = [];
let nullAverages = 0;

processedData.forEach((record) => {
  if (record.Average !== null) {
    numericAverages.push(record.Average);
  } else {
    nullAverages++;
  }
});

console.log("\nAverage statistics:");
console.log(
  `${numericAverages.length.toString().padStart(4)}: Records with numeric averages`
);
console.log(
  `${nullAverages.toString().padStart(4)}: Records with missing/invalid averages`
);

if (numericAverages.length > 0) {
  const avg =
    numericAverages.reduce((a, b) => a + b, 0) / numericAverages.length;
  const min = Math.min(...numericAverages);
  const max = Math.max(...numericAverages);

  console.log(`\nNumeric average statistics:`);
  console.log(`  Mean: ${avg.toFixed(2)}`);
  console.log(`  Min: ${min}`);
  console.log(`  Max: ${max}`);
}
