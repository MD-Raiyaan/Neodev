import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export async function POST() {

 // fire an event that kicks off the setup process
  const res=await inngest.send({
    name: "app/server-setup",
  });

  console.log("res from inngest : ",res);

  return NextResponse.json({ ok: true, message: "Setup started" });
}
