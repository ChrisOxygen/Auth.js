import AuthForm from "@/components/AuthForm";

function SignInPage() {
  return (
    <div className="text-white grid h-full place-items-center ">
      <AuthForm formType="sign in" />
    </div>
  );
}

export default SignInPage;
