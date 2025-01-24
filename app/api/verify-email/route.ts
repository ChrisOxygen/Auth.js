import VerificationEmail from "@/emails/VerificationEmail";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, verificationLink, email } = await req.json();
    const { data, error } = await resend.emails.send({
      from: "Chris <chris@authtester.xyz>",
      to: [email],
      subject: "Verify your email",
      react: VerificationEmail({
        name,
        verificationLink,
      }),
    });

    if (error) {
      console.error("error inside API", error);
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
