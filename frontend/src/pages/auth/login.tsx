"use client";

import Head from "next/head";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import LoginForm from "../../components/LoginForm";

export default function LoginPage() {
  useAuthRedirect();
  return (
    <>
      <Head>
        <title>Login - My Learning Platform</title>
      </Head>
      <LoginForm />
    </>
  );
}
