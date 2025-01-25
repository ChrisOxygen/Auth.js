import ResetPasswordEmail from "@/emails/resetPasswordEmail";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  console.log("Email Reset PW");
  try {
    const { name, passwordResetLink, email } = await req.json();
    const { data, error } = await resend.emails.send({
      from: "Chris <chris@authtester.xyz>",
      to: [email],
      subject: "Reset password",
      react: ResetPasswordEmail({
        name,
        passwordResetLink,
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
