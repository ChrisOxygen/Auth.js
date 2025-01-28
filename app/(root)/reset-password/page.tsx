import ResetPasswordResponse from "@/components/ResetPasswordResponse";
import { redirect } from "next/navigation";

async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ code: string }>;
}) {
  const code = (await searchParams)?.code;

  if (!code) {
    return redirect("/sign-in");
  }

  console.log("paramsRes: ", code);
  return <ResetPasswordResponse verificationCode={code} />;
}

export default ResetPasswordPage;
