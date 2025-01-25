import AuthForm from "@/components/AuthForm";
import { Suspense } from "react";

function SignInPage() {
  return (
    <div className="text-white grid h-full place-items-center ">
      <Suspense fallback={<div>Loading...</div>}>
        <AuthForm formType="sign in" />
      </Suspense>
    </div>
  );
}

export default SignInPage;
