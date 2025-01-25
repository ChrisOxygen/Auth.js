import AuthForm from "@/components/AuthForm";
import { Suspense } from "react";

function SignUpPage() {
  return (
    <div className="text-white grid h-full place-items-center ">
      <Suspense fallback={<div>Loading...</div>}>
        <AuthForm formType="sign up" />
      </Suspense>
    </div>
  );
}

export default SignUpPage;
