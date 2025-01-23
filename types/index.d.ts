declare interface SignUpDetails {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

declare interface SignInDetails {
  email: string;
  password: string;
}

declare type ErrorWithMessageAndStatus = {
  message: string;
  status: number;
  field?: string;
} & Error;
