import { NextRequest, NextResponse } from "next/server";
import {
  getVolunteers,
  addVolunteer,
  updateVolunteer,
  deleteVolunteer,
} from "@/lib/actions/volunteers";

export async function GET() {
  const result = await getVolunteers();
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ volunteers: result.volunteers });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const result = await addVolunteer(data);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ volunteer: result.volunteer });
}

export async function PUT(request: NextRequest) {
  const { id, ...data } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Missing volunteer id" }, { status: 400 });
  }
  const result = await updateVolunteer(id, data);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ volunteer: result.volunteer });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Missing volunteer id" }, { status: 400 });
  }
  const result = await deleteVolunteer(id);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ success: true });
} 