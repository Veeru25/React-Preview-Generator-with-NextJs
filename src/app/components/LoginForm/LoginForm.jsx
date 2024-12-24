
"use client";

import { useState } from "react";
import { loginAction } from "../../serverActions/loginAction";
import { useRouter } from "next/navigation";
import styles from "./LoginForm.module.css";

const LoginPage =  () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginDetails = { email, password };
    // console.log("loginDetails", loginDetails);
    await loginAction(loginDetails);
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Login Page</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="email" className={styles.labelInput}>Email : </label>
        <input
          type="text"
          name="email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <label htmlFor="password" className={styles.labelInput}>Password : </label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <hr className={styles.hr} />
        <button type="submit" className={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
