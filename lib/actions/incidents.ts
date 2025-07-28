import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export interface Incident {
  id?: string;
  type: string;
  location: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  reported_at?: string;
}

export async function getIncidents() {
  try {
    const incidents = await sql`SELECT * FROM incidents ORDER BY reported_at DESC`;
    return { success: true, incidents };
  } catch (error) {
    console.error("Error fetching incidents:", error);
    return { success: false, error: "Failed to fetch incidents" };
  }
}

export async function addIncident(data: Incident) {
  try {
    const incident = await sql`
      INSERT INTO incidents (type, location, description, severity, reported_at)
      VALUES (${data.type}, ${data.location}, ${data.description}, ${data.severity}, NOW())
      RETURNING *
    `;
    return { success: true, incident: incident[0] };
  } catch (error) {
    console.error("Error adding incident:", error);
    return { success: false, error: "Failed to add incident" };
  }
}

export async function updateIncident(id: string, data: Partial<Incident>) {
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
      UPDATE incidents SET ${sql.unsafe(setClause)} WHERE id = $1 RETURNING *
    `.apply(null, values);
    return { success: true, incident: updated[0] };
  } catch (error) {
    console.error("Error updating incident:", error);
    return { success: false, error: "Failed to update incident" };
  }
}

export async function deleteIncident(id: string) {
  try {
    await sql`DELETE FROM incidents WHERE id = ${id}`;
    return { success: true };
  } catch (error) {
    console.error("Error deleting incident:", error);
    return { success: false, error: "Failed to delete incident" };
  }
} 