import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export interface Volunteer {
  id?: string;
  name: string;
  contact: string;
  skills: string;
  availability: string;
}

export async function getVolunteers() {
  try {
    const volunteers = await sql`SELECT * FROM volunteers ORDER BY name`;
    return { success: true, volunteers };
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    return { success: false, error: "Failed to fetch volunteers" };
  }
}

export async function addVolunteer(data: Volunteer) {
  try {
    const volunteer = await sql`
      INSERT INTO volunteers (name, contact, skills, availability)
      VALUES (${data.name}, ${data.contact}, ${data.skills}, ${data.availability})
      RETURNING *
    `;
    return { success: true, volunteer: volunteer[0] };
  } catch (error) {
    console.error("Error adding volunteer:", error);
    return { success: false, error: "Failed to add volunteer" };
  }
}

export async function updateVolunteer(id: string, data: Partial<Volunteer>) {
  try {
    const fields = [];
    const values = [id];
    let idx = 2;
    for (const key of Object.keys(data)) {
      fields.push(`${key} = $${idx}`);
      values.push((data as any)[key]);
      idx++;
    }
    if (fields.length === 0) throw new Error("No fields to update");
    const setClause = fields.join(", ");
    const updated = await sql`
      UPDATE volunteers SET ${sql.unsafe(setClause)} WHERE id = $1 RETURNING *
    `.apply(null, values);
    return { success: true, volunteer: updated[0] };
  } catch (error) {
    console.error("Error updating volunteer:", error);
    return { success: false, error: "Failed to update volunteer" };
  }
}

export async function deleteVolunteer(id: string) {
  try {
    await sql`DELETE FROM volunteers WHERE id = ${id}`;
    return { success: true };
  } catch (error) {
    console.error("Error deleting volunteer:", error);
    return { success: false, error: "Failed to delete volunteer" };
  }
} 