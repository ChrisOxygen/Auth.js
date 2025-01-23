import AuthForm from "@/components/AuthForm";

function SignUpPage() {
  return (
    <div className="text-white grid h-full place-items-center ">
      <AuthForm formType="sign up" />
    </div>
  );
}

export default SignUpPage;
