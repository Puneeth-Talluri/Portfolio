import { NextResponse } from "next/server";
import { Resend } from "resend";
import ContactEmail from "@/components/email/ContactEmail";
const HARDCODED_RESEND_API_KEY = "re_bRLh5TTD_B7yMZzFWv1Y1LJTMc3vYV1vX";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const apiKey =
      HARDCODED_RESEND_API_KEY !== "YOUR_RESEND_API_KEY" ? HARDCODED_RESEND_API_KEY : process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing Resend API key" }, { status: 500 });
    }
    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: "talluripuneeth@gmail.com",
      subject: `Contact Form Message from ${name}`,
      react: ContactEmail({ name, email, message }) as React.ReactElement,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ id: data?.id }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Unexpected error" }, { status: 500 });
  }
}
