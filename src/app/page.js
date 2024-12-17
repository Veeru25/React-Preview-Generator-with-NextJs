
import { redirect } from "next/navigation";
import { auth } from "./auth";
import Link from "next/link";
import ChatWrapper from "./components/ChatWrapper";
import SmallReactLogo from "./components/ReactLogo/SmallReactLogo";

const Home = async () => {
  
  const session = await auth();

  // console.log("session",session)   // Session fetched Here

  if (!session) {
    redirect("/login");
  }

  return (
    <>
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
        <div>
          
        <SmallReactLogo userSession={session}/>
        </div>
        
        <Link href="/api/auth/signout">
          <button
            style={{
              padding: "8px",
              width: "110px",
              backgroundColor: "black",
              color: "white",
              height:"5vh",
              borderRadius: "6px",
              cursor: "pointer",
              display:"flex",
              justifyContent:"center",
              alignItems:"center",
            }}
          >
            Logout
          </button>
        </Link>
      </header>
      <div style={{ display: "flex"  , height:"95vh"}}>
        <ChatWrapper userSession={session}/>
      </div>
    </>
  );
};
export default Home;


