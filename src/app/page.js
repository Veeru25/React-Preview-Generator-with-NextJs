import { redirect } from "next/navigation";
// import { auth } from "@/app/auth"; // Adjust the import based on your structure
import { UserSessionProvider } from "@/app/context/UserSessionContext";
// import ChatWrapper from "@/app/components/ChatWrapper";
import SmallReactLogo from "@/app/components/ReactLogo/SmallReactLogo";
import Link from "next/link";
import ChatWrapper from "./components/ChatWrapper/ChatWrapper";
import { auth } from "./auth";

export default async function Home() {
  const session = await auth()

  if (!session) {
    redirect("/login");
  }

  return (
    <UserSessionProvider session={session}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          padding: "15px",
          paddingRight: "20px",
          backgroundColor: "#f0f4f8",
        }}
      >
        <div>
          <SmallReactLogo />
        </div>

        <Link href="/api/auth/signout">
          <button
            style={{
              padding: "8px",
              width: "110px",
              backgroundColor: "black",
              color: "white",
              height: "5vh",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Logout
          </button>
        </Link>
      </header>
      <div style={{ display: "flex", height: "95vh" }}>
        <ChatWrapper/>
      </div>
    </UserSessionProvider>
  );
}




// import { redirect } from "next/navigation";
// import { auth } from "./auth";
// import Link from "next/link";
// import ChatWrapper from "./components/ChatWrapper/ChatWrapper";
// import SmallReactLogo from "./components/ReactLogo/SmallReactLogo";

// const Home = async () => {
  
//   const session = await auth();

//   // console.log("session",session)   // Session fetched Here

//   if (!session) {
//     redirect("/login");
//   }

//   return (
//     <>
//       <header
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "end",
//           padding: "15px",
//           paddingRight: "20px",
//           backgroundColor:"#f0f4f8"
//         }}
//       >
//         <div>
          
//         <SmallReactLogo userSession={session}/>
//         </div>
        
//         <Link href="/api/auth/signout">
//           <button
//             style={{
//               padding: "8px",
//               width: "110px",
//               backgroundColor: "black",
//               color: "white",
//               height:"5vh",
//               borderRadius: "6px",
//               cursor: "pointer",
//               display:"flex",
//               justifyContent:"center",
//               alignItems:"center",
//             }}
//           >
//             Logout
//           </button>
//         </Link>
//       </header>
//       <div style={{ display: "flex"  , height:"95vh"}}>
//         <ChatWrapper userSession={session}/>
//       </div>
//     </>
//   );
// };
// export default Home;


