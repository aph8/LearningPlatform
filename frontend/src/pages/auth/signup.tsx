"use client";

import Head from "next/head";
import SignupForm from "../../components/SignupForm";

export default function SignupPage() {
  return (
    <>
      <Head>
        <title>Signup - My Learning Platform</title>
      </Head>
      <SignupForm />
    </>
  );
}
