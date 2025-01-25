import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  name?: string;
  passwordResetLink?: string;
}

export const ResetPasswordEmail = ({
  name,

  passwordResetLink,
}: ResetPasswordEmailProps) => {
  const previewText = `Hello ${name}, Reset your password.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid text-center border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <h3 className="font-bold text-xl uppercase">Auth.js</h3>
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 mb-[30px] mx-0">
              Password Reset
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello {name},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Reset your password by clicking the button below.
            </Text>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={passwordResetLink}
              >
                Reset Password
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{" "}
              <Link
                href={passwordResetLink}
                className="text-blue-600 no-underline"
              >
                {passwordResetLink}
              </Link>
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              THis link will expire in 10 minutes.
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This verification email was intended for{" "}
              <span className="text-black">{name}</span>. If you were not
              expecting this verification, you can ignore this email. If you are
              concerned about your accounts safety, please get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ResetPasswordEmail;
