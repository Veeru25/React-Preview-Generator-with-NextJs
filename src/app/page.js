// "use client"

import { redirect } from "next/navigation";
import { auth } from "./auth";
import Link from "next/link";
import History from "./components/History";
import Chats from "./components/Chats";
import ChatWrapper from "./components/ChatWrapper";

const Home = async () => {
  const session = await auth();
  console.log(session)
  // console.log( "sessionEmail",sessionEmail)
  if (!session) {
    redirect("/login");
  }
  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          padding: "15px",
          paddingRight: "20px",
          backgroundColor:"#f0f4f8"
        }}
      >
        <p> </p>
        <Link href="/api/auth/signout">
          <button
            style={{
              padding: "8px",
              width: "110px",
              backgroundColor: "black",
              color: "white",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </Link>
      </header>
      <div style={{ display: "flex" }}>
        <ChatWrapper userSession={session}/>
      </div>
    </div>
  );
};
export default Home;


