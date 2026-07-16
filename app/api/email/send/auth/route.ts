import { Resend } from "resend";
import { render } from "@react-email/render";
import EmailTemplate from "@/components/mail/email-template";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/db/mongoose";
import { Chat, Ticket } from "@/db/models";
import { getToken } from "next-auth/jwt";

const resend = new Resend(process.env.RESEND_API_KEY || "re_disabled");

export async function POST(req: NextRequest) {
  await connectDB();

  const token = await getToken({ req });
  const values = await req.json();
  const content = values.content;
  const ticketId = values.ticketId;
  const role = values.role;
  const userEmail =
    role == "user" ? "deepanshupokhriyal07@gmail.com" : values.userEmail;

  if (!userEmail) return Response.json("Unauthenticated", { status: 400 });

  const html = await render(
    EmailTemplate({
      userEmail,
      content,
    }),
  );

  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM}`,
      to: [userEmail],
      subject: "Tulsiveda Website - [Customer Support]",
      html,
    });

    if (error) {
      console.log("@@@@@@@@@@@@ERROR", error);
      return Response.json({ error }, { status: 500 });
    }
    const mailId = data.id;
    console.log(mailId, typeof mailId);
    const response = await Chat.create({
      _id: mailId,
      ticketId: ticketId,
      userEmail: values.userEmail,
      content: content,
      role: role,
    });

    const update = await Ticket.findByIdAndUpdate(ticketId, {
      status: "pending",
    });

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
