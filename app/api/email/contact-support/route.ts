import { NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import EmailTemplate from "@/components/mail/email-template";
const resend = new Resend(process.env.RESEND_API_KEY || "re_disabled");

export async function POST(req: Request) {
  const { userEmail, country, name, subject, content } = await req.json();

  if (!userEmail) return Response.json("Unauthenticated", { status: 400 });

  const html = await render(
    EmailTemplate({
      userEmail,
      content,
    })
  );

  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM}`,
      to: [userEmail],
      subject: subject,
      html,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return NextResponse.json({
      message: "Successfully sent",
      data,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Error sending mail",
      error,
      success: false,
    });
  }
}
