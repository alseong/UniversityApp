// Utility to provide university and program data
import universityData from '../../data/data.json'

export interface UniversityData {
  unique_schools: string[]
  unique_programs: string[]
  summary: {
    total_schools: number
    total_programs: number
  }
}

// Type for the actual imported data structure
interface ImportedData {
  metadata?: any
  schools?: string[]
  programs?: string[]
  unique_schools?: string[]
  unique_programs?: string[]
  summary?: {
    total_schools: number
    total_programs: number
  }
}

const data = universityData as ImportedData

export function getUniversityData(): UniversityData {
  // Try both possible structures
  const schools = data.unique_schools || data.schools || []
  const programs = data.unique_programs || data.programs || []
  
  return {
    unique_schools: schools,
    unique_programs: programs,
    summary: data.summary || { total_schools: schools.length, total_programs: programs.length }
  }
}

export function getUniversityNames(): string[] {
  console.log('Available data keys:', Object.keys(data)) // Debug log
  console.log('Schools data:', data.unique_schools || data.schools) // Debug log
  return data.unique_schools || data.schools || []
}

export function getProgramNames(): string[] {
  console.log('Programs data:', data.unique_programs || data.programs) // Debug log
  return data.unique_programs || data.programs || []
} 