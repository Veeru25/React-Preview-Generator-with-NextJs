import { redirect } from "next/navigation";
import { UserSessionProvider } from "@/app/context/UserSessionContext";
import SmallReactLogo from "@/app/components/ReactLogo/SmallReactLogo";
import Link from "next/link";
import ChatWrapper from "./components/ChatWrapper/ChatWrapper";
import { auth } from "./auth";
import { HistoryProvider } from "./context/HistoryContext";

export default async function Home() {
  const session = await auth()

  if (!session) {
    redirect("/login");
  }

  return (
    <HistoryProvider>
    <UserSessionProvider session={session}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          padding: "15px",
          paddingRight: "20px",
          backgroundColor: "#E0E0E0",
        }} >
        <div>
          <SmallReactLogo />
        </div>
        <Link href="/api/auth/signout" style={{ textDecoration: "none" }}>
          <button
            style={{
              padding: "8px",
              width: "110px",
              // backgroundColor: "black",
              // color: "white",
              backgroundColor: "#E4E4E6",
         boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
         color:"#4A4A4D",
              height: "40px",
              borderWidth:"0px",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight:"bolder"
            }}
            whilehover={{backgroundColor:"white"}}
          >
            Logout
          </button>
        </Link>
      </header>
      <div style={{ display: "flex", height: "95vh" }}>
        <ChatWrapper/>
      </div>
    </UserSessionProvider>
    </HistoryProvider>
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


