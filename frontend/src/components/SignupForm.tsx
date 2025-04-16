"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupApi } from "../helper/api";
import styles from "../styles/SignupForm.module.scss";
import { AxiosError } from "axios";

const signupSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
    isInstructor: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const [error, setError] = useState("");

  const onSubmit = async (data: SignupFormData) => {
    try {
      const transformedPayload = {
        username: data.username,
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword, // ✅ ADD THIS
        isInstructor: data.isInstructor,    
      };

      const response = await signupApi.signUp(transformedPayload);
      console.log(response.data);
      router.push("/auth/login");
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const message = axiosError.response?.data?.message;
      setError(
        message ?? "Signup failed. Please check your details and try again.",
      );
    }
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Sign Up</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              {...register("username")}
              className={styles.formInput}
            />
            {errors.username && (
              <p className={styles.errorMessage}>{errors.username.message}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className={styles.formInput}
            />
            {errors.name && (
              <p className={styles.errorMessage}>{errors.name.message}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              className={styles.formInput}
            />
            {errors.email && (
              <p className={styles.errorMessage}>{errors.email.message}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              className={styles.formInput}
            />
            {errors.password && (
              <p className={styles.errorMessage}>{errors.password.message}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword")}
              className={styles.formInput}
            />
            {errors.confirmPassword && (
              <p className={styles.errorMessage}>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div
            className={styles.formGroup}
            style={{ display: "flex", alignItems: "center" }}
          >
            <input
              type="checkbox"
              id="isInstructor"
              {...register("isInstructor")}
              style={{ marginRight: "0.5rem" }}
            />
            <label htmlFor="isInstructor">I am an instructor</label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className={styles.signupMessage}>
          Already have an account?{" "}
          <Link href="/auth/login" className={styles.signupLink}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
