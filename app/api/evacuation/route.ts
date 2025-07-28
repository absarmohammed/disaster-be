import { NextResponse } from "next/server"
import { getEvacuationStatus, getEvacuationRoutes } from "@/lib/actions/evacuation";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const [zonesResult, routesResult, shelters] = await Promise.all([
      getEvacuationStatus(),
      getEvacuationRoutes(),
      sql`SELECT * FROM shelters ORDER BY name`,
    ]);

    if (!zonesResult.success || !routesResult.success) {
      return NextResponse.json({ error: zonesResult.error || routesResult.error }, { status: 500 });
    }

    return NextResponse.json({
      zones: zonesResult.zones,
      routes: routesResult.routes,
      shelters: shelters,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch evacuation data" }, { status: 500 });
  }
}
