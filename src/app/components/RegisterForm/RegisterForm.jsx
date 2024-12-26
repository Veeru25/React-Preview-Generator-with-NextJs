
"use client";

import { useState } from "react";
import { registerAction } from "../../serverActions/registerAction";
import { useRouter } from "next/navigation";
import styles from "./RegisterForm.module.css";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const registerDetails = { username, email, password };
    // console.log("registerDetails", registerDetails);
    await registerAction(registerDetails);
    router.push("https://react-preview-generator-with-next-js.vercel.app/login");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Register Page</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.header}>Username:</h1>
        <input
          type="text"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
        />
        <h1 className={styles.header}>Email:</h1>
        <input
          type="text"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <h1 className={styles.header}>Password:</h1>
        <input
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <hr className={styles.hr} />
        <button type="submit" className={styles.button}>
          Register
        </button>
{/*         
      <hr className={styles.hr} />
      <button type="button" onClick={redirectToLogin} className={styles.button}>Login</button> */}
      </form>
    </div>
  );
};

export default RegisterPage;
