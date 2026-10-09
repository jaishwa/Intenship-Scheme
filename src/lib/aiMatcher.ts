/**
 * FutureFit AI Matching Engine
 * Computes internship match scores using keyword-based similarity + weighted factors.
 *
 * Weight distribution:
 *   Skill similarity  50%
 *   CGPA              20%
 *   Department match  10%
 *   Interest match    20%
 */

/** Normalise a string, string array, or nullable value into a unique lowercase set of clean tokens */
const normalise = (arr: any): string[] => {
  if (!arr) return [];
  if (typeof arr === 'string') {
    return arr.split(',').map((s) => s.toLowerCase().trim()).filter(Boolean);
  }
  if (Array.isArray(arr)) {
    return [...new Set(arr.flatMap((s: any) => {
      if (typeof s === 'string') {
        return s.includes(',') ? s.split(',').map(x => x.toLowerCase().trim()) : [s.toLowerCase().trim()];
      }
      return [];
    }))].filter(Boolean);
  }
  return [];
};

/** 
 * Computes skill coverage ratio.
 * Checks if required skills are found within student skills (handles multi-word skills).
 */
function computeSkillScore(studentSkills: string[], requiredSkills: string[]): number {
  const sSkills = normalise(studentSkills);
  const rSkills = normalise(requiredSkills);
  if (rSkills.length === 0) return 1.0;

  let matchedCount = 0;
  for (const req of rSkills) {
    const isMatched = sSkills.some(stud => 
      stud === req || 
      stud.includes(req) || 
      req.includes(stud) ||
      stud.split(/\s+/).includes(req)
    );
    if (isMatched) {
      matchedCount++;
    }
  }
  return matchedCount / rSkills.length;
}

/** Determines if the student's department matches the internship's track */
function isDepartmentCompatible(studentDept: string, internshipDept: string): boolean {
  const s = studentDept.toLowerCase().trim();
  const i = internshipDept.toLowerCase().trim();
  if (s === i) return true;
  if (!s || !i) return false;

  // Tech / Engineering mappings
  const techDepts = ['computer science', 'cse', 'it', 'information technology', 'software engineering', 'computer engineering', 'mca', 'bca', 'technology'];
  const techInterns = ['engineering', 'ai', 'software', 'tech', 'development', 'developer'];
  
  const isTechStudent = techDepts.some(d => s.includes(d) || d.includes(s));
  const isTechIntern = techInterns.some(d => i.includes(d) || i.includes(s));
  if (isTechStudent && isTechIntern) return true;

  // Business / Management mappings
  const businessDepts = ['business', 'mba', 'bba', 'management', 'finance', 'marketing', 'sales'];
  const businessInterns = ['product', 'business', 'marketing', 'sales', 'hr', 'human resources'];
  
  const isBusinessStudent = businessDepts.some(d => s.includes(d) || d.includes(s));
  const isBusinessIntern = businessInterns.some(d => i.includes(d) || i.includes(s));
  if (isBusinessStudent && isBusinessIntern) return true;

  return false;
}

export interface StudentProfile {
  skills: string[];
  cgpa: number;          // 0–10
  department: string;
  interests: string[];
}

export interface InternshipProfile {
  required_skills: string[];
  department: string;
}

/**
 * Returns a match score between 0 and 100.
 */
export function computeMatchScore(
  student: StudentProfile,
  internship: InternshipProfile,
): number {
  // 1. Skill similarity (50%)
  const skillScore = computeSkillScore(student.skills, internship.required_skills);

  // 2. CGPA score (20%) – normalised 0–1 assuming max CGPA is 10
  const cgpaScore = Math.min(student.cgpa / 10, 1);

  // 3. Department match (10%)
  const deptScore = isDepartmentCompatible(student.department, internship.department) ? 1.0 : 0.0;

  // 4. Interest match (20%) – overlap ratio with fallback
  const normSkills = normalise(internship.required_skills);
  const normInterests = normalise(student.interests);
  
  let interestOverlap = 1.0;
  if (normInterests.length > 0) {
    const matchedInterests = normInterests.filter((i) => normSkills.includes(i)).length;
    interestOverlap = normSkills.length === 0 ? 1.0 : matchedInterests / normSkills.length;
    
    // Add a baseline if they match the department compatibility
    if (interestOverlap < 0.5 && isDepartmentCompatible(student.department, internship.department)) {
      interestOverlap = 0.7;
    }
  } else {
    // Fallback if interests are not filled
    interestOverlap = isDepartmentCompatible(student.department, internship.department) ? 1.0 : 0.7;
  }

  const raw =
    skillScore * 0.5 +
    cgpaScore * 0.2 +
    deptScore * 0.1 +
    interestOverlap * 0.2;

  return Math.round(Math.min(raw * 100, 100));
}

/** Returns score colour class */
export function scoreColor(score: number): string {
  if (score >= 80) return '#22c55e'; // green
  if (score >= 60) return '#f59e0b'; // amber
  if (score >= 40) return '#f97316'; // orange
  return '#ef4444';                  // red
}

/** Returns a skill-gap array: skills required by internship but not in student profile */
export function skillGap(student: StudentProfile, internship: InternshipProfile): string[] {
  const normStudentSkills = new Set(normalise(student.skills));
  return normalise(internship.required_skills).filter((s) => {
    // Check if the skill is matched by substring check
    const isMatched = [...normStudentSkills].some(stud => 
      stud === s || 
      stud.includes(s) || 
      s.includes(stud) ||
      stud.split(/\s+/).includes(s)
    );
    return !isMatched;
  });
}
