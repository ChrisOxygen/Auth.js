import { auth } from "@/auth";
import VerificationResponse from "@/components/VerificationResponse";
import { redirect } from "next/navigation";

async function VerificationPage({
  searchParams,
}: {
  searchParams: Promise<{ code: string }>;
}) {
  const session = await auth();
  const isVerified = session?.user?.isVerified;
  const code = (await searchParams)?.code;

  if (!code || !session) {
    return redirect("/");
  }

  console.log("paramsRes: ", code);
  return (
    <main className="w-full h-screen grid  place-items-center px-5">
      <VerificationResponse
        isVerified={isVerified!}
        name={session?.user?.name}
        userId={session?.user?.id}
        verificationCode={code}
      />
    </main>
  );
}

export default VerificationPage;
// async function VerificationPage({
//   params,
//   searchParams,
// }: {
//   params: { slug: string };
//   searchParams: { [key: string]: string | string[] | undefined };
// }) {
//   const paramsRes = await params;

//   console.log("paramsRes: ", paramsRes);
//   return <div>VerificationPage</div>;
// }

// export default VerificationPage;
