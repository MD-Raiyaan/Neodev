import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export async function POST(req:NextRequest) {
  const { url, port } = await req.json();

  // notify inngest that the project server is ready
  await inngest.send({
    name: "app/server-ready",
    data: { url, port },
  });

  return NextResponse.json({ ok: true, message: "Server marked ready" });
}
