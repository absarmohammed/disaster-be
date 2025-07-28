import { NextRequest, NextResponse } from "next/server";
import {
  getIncidents,
  addIncident,
  updateIncident,
  deleteIncident,
} from "@/lib/actions/incidents";

export async function GET() {
  const result = await getIncidents();
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ incidents: result.incidents });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const result = await addIncident(data);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ incident: result.incident });
}

export async function PUT(request: NextRequest) {
  const { id, ...data } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Missing incident id" }, { status: 400 });
  }
  const result = await updateIncident(id, data);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ incident: result.incident });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Missing incident id" }, { status: 400 });
  }
  const result = await deleteIncident(id);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ success: true });
} 