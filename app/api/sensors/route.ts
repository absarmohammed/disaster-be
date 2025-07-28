import { NextResponse } from "next/server"
import { getSensorStatus } from "@/lib/actions/sensors"
import { getSensorReadings } from "@/lib/actions/sensors";

export async function GET() {
  try {
    const result = await getSensorStatus()

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ sensors: result.sensors })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to fetch sensors" }, { status: 500 })
  }
}

export async function GET_readings() {
  try {
    const result = await getSensorReadings();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ readings: result.readings });
  } catch (error) {
    console.error("API Error (readings):", error);
    return NextResponse.json({ error: "Failed to fetch sensor readings" }, { status: 500 });
  }
}
