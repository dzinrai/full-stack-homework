'use server';

import sql from '@/app/lib/db';

export async function addGrade(formData: FormData) {
  try {
    const classValue = formData.get('class') as string;
    const gradeValue = parseInt(formData.get('grade') as string, 10);

    const validClasses = ['Math', 'Science', 'History'];
    if (!validClasses.includes(classValue)) {
      throw new Error('Class must be one of: Math, Science, History');
    }

    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 100) {
      throw new Error('Grade must be between 0 and 100');
    }

    const query = 'INSERT INTO "Grade" (id, class, grade) VALUES (gen_random_uuid(), $1, $2) RETURNING *';
    await sql.unsafe(query, [classValue, gradeValue]);
    
    return { success: true };
  } catch (error: any) {
    console.error('Error adding grade:', error);
    return { success: false, error: error.message || 'Failed to add grade' };
  }
} 