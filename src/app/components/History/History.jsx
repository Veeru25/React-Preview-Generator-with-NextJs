"use client";

import Link from "next/link";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUserSession } from "@/app/context/UserSessionContext";
import { useHistoryContext } from "@/app/context/HistoryContext";
import { useRouter } from 'next/navigation'

const History = ({ historyData }) => {
  const router= useRouter()
  // console.log("router",router)+
  const session = useUserSession();
  const { historyLength } = useHistoryContext()
  console.log("historyLength",historyLength)

  const [updatedHistoryAfterDeletion, setupdatedHistoryAfterDeletion] =
    useState(historyData);
  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  const handleGetSingleHistoryDocument = (id, userId) => {
    console.log(id, "id");
    console.log(userId, "userId");
  };

  const onNewChat = () => {
    localStorage.clear();
    window.location.href = "/";
    // router.push("/")
  };

  const handleDeleteHistory = async (id, userId) => {
    try {
      const response = await fetch(`https://react-preview-generator-with-next-js.vercel.app/api/history/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, userId }),
      });

      const data = await response.json();
      if (data.success) {
        window.location.href = "/";
        setupdatedHistoryAfterDeletion(...historyData);
        localStorage.clear();
      } else {
        alert("Failed to delete chat.");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("An error occurred while deleting the chat.");
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3, ease: "easeIn" } },
  };
   const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  return (
    
    <div style={{backgroundColor:"#E0E0E0", width: "20vw"}}><div
    style={{
      color:"#4A4A4D",
      height: "95vh",
      border: "1px",
      borderColor: "blue",
      textAlign: "center",
      // backgroundColor: "#707073",
      backgroundColor: "#f5f5f5",
      paddingTop: "10px",
      paddingBottom: "10px",
      boxShadow:"rgba(0, 0, 0, 0.1)",
      borderRadius:"20px"
    }}
  >
    {historyLength !== 0 && (
      <motion.button
        style={{
          cursor: "pointer",
          width: "90%",
          marginTop: "5px",
          marginBottom: "5px",
          height: "35px",
          borderRadius: "8px",
          borderColor:"white",
          borderWidth: "0px",
         
          backgroundColor: "#E4E4E6",
      //  backgroundColor: "#f5f5f5",
      //  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
       color:"#4A4A4D",
       marginBottom:"15px",
         
          // color: "white",
        }}
        whileHover={{
          backgroundColor: "white",
          // color: "black",
          borderColor: "white",
          border:"1px solid black"
        }}
        whileTap={{ scale: 0.95 }}
        onClick={onNewChat}
      >
        NEW CHAT
      </motion.button>
    )}
    <p style={{ color: "white" ,
      color:"#4A4A4D" , fontWeight:"bold" , fontSize : "20px" }}>--- History ---</p>

    <motion.ul
      style={{ listStyle: "none", margin: "10px" }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {[...historyData].reverse().map((history) => (
          <motion.li
            key={history._id}
            style={{ display: "flex" ,marginTop:"15px"}}
            variants={itemVariants}
            exit={{ opacity: 0, y: -20 }}
          >
            
            <Link href={`/?id=${history._id}`}>
              <motion.button
                style={{
                  width: "240px",
                  height: "30px",
                  margin: "5px",
                  padding: "4px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  textAlign: "left",
                  paddingLeft: "7px",
                  color:"#4A4A4D",
                  // backgroundColor:"#B9B9BB",
       backgroundColor: "#f5f5f5",
       boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  // color:"#fff",
                  borderWidth:"0px",
                  // color: search === history._id ? "black" : "white",
                  backgroundColor : search === history._id ? "#4A4A4D" : "#f5f5f5",
                  color : search === history._id ? "#fff" : "#4A4A4D",
                  // border:
                  //   search === history._id
                  //     ? "2px solid #61dafb"
                  //     : "1px solid white",
                }}
                whilehover={{
                  scale: 1.05,
                  backgroundColor: search !== history._id ?  "rgb(217 214 214)" : null,
                  // boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  handleGetSingleHistoryDocument(history._id, history.userId)
                }
              >
                {history?.chatName}......
              </motion.button>
            </Link>

            <Tooltip title="Delete chat" arrow>
              <motion.button
                onClick={() =>
                  handleDeleteHistory(history._id, history.userId)
                }
                style={{
                  width: "35px",
                  height: "30px",
                  margin: "5px",
                  padding: "4px",
                  borderRadius: "5px",
                  borderWidth: "0px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  // color:"#4A4A4D",
                  // backgroundColor:"#B9B9BB"
                  // backgroundColor: "#f5f5f5",
                  backgroundColor : search === history._id ? "#4A4A4D" : "#f5f5f5",
                  color : search === history._id ? "#fff" : "#4A4A4D",
                }} 
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <DeleteIcon />
              </motion.button>
            </Tooltip>
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  </div></div>
  );
};

export default History;



// "use client";

// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { useRouter } from 'next/navigation'
// import DeleteIcon from "@mui/icons-material/Delete";
// import { Tooltip } from "@mui/material";
// import { useSearchParams } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import { useUserSession } from "@/app/context/UserSessionContext";
// import { useHistoryContext } from "@/app/context/HistoryContext";

// const History = ({ historyData }) => {
//   const router = useRouter()
//   console.log("router",router)
//   const session = useUserSession();
//   const { historyLength } = useHistoryContext();
//   const [updatedHistory, setUpdatedHistory] = useState(historyData);
//   const searchParams = useSearchParams();
//   const search = searchParams.get("id");

//   const handleGetSingleHistoryDocument = (id, userId) => {
//     console.log(id, "id");
//     console.log(userId, "userId");
//   };

//   const onNewChat = () => {
//     window.location.href = "/";
//     localStorage.clear();
//     // router.push("/")
//     // localStorage.removeItem('chatHistory');
//   };

//   const handleDeleteHistory = async (id, userId) => {
//     try {
//       const response = await fetch(`/api/history/`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ id, userId }),
//       });

//       const data = await response.json();
//       if (data.success) {
//         await localStorage.clear();
//         // Update the state after successful deletion
//         setUpdatedHistory(updatedHistory.filter(item => item._id !== id));
        
//       } else {
//         alert("Failed to delete chat.");
//       }
//     } catch (error) {
//       console.error("Error deleting chat:", error);
//       alert("An error occurred while deleting the chat.");
//     }
//   };

//   useEffect(() => {
//     setUpdatedHistory(historyData);
//   }, [historyData]);

//   const containerVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
//     exit: { opacity: 0, y: -50, transition: { duration: 0.3, ease: "easeIn" } },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, x: -20 },
//     visible: (i) => ({
//       opacity: 1,
//       x: 0,
//       transition: { delay: i * 0.1, duration: 0.4 },
//     }),
//   };

//   return (
//     <div style={{ backgroundColor: "#E0E0E0", width: "20vw" }}>
//       <div
//         style={{
//           color: "#4A4A4D",
//           height: "95vh",
//           border: "1px",
//           borderColor: "blue",
//           textAlign: "center",
//           backgroundColor: "#f5f5f5",
//           paddingTop: "10px",
//           paddingBottom: "10px",
//           boxShadow: "rgba(0, 0, 0, 0.1)",
//           borderRadius: "20px",
//         }}
//       >
//         {historyLength !== 0 && (
//           <motion.button
//             style={{
//               cursor: "pointer",
//               width: "90%",
//               marginTop: "5px",
//               marginBottom: "5px",
//               height: "35px",
//               borderRadius: "8px",
//               borderColor: "white",
//               borderWidth: "0px",
//               backgroundColor: "#E4E4E6",
//               color: "#4A4A4D",
//               marginBottom: "15px",
//             }}
//             whileHover={{
//               backgroundColor: "white",
//               borderColor: "white",
//               border: "1px solid black",
//             }}
//             whileTap={{ scale: 0.95 }}
//             onClick={onNewChat}
//           >
//             NEW CHAT
//           </motion.button>
//         )}
//         <p style={{ color: "#4A4A4D", fontWeight: "bold", fontSize: "20px" }}>
//           --- History ---
//         </p>
//         <motion.ul
//           style={{ listStyle: "none",
//           margin: "10px",
//           overflowY: "scroll",  // Enables vertical scrolling
//           scrollbarWidth: "none",  // For Firefox to hide scrollbar
//           msOverflowStyle: "none",   }}
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           <AnimatePresence>
//             {updatedHistory.reverse().map((history, index) => (
//               <motion.li
//                 key={history._id}
//                 style={{ display: "flex", marginTop: "15px" }}
//                 variants={itemVariants}
//                 exit={{ opacity: 0, y: -20 }}
//               >
//                 <Link href={`/?id=${history._id}`}>
//                   <motion.button
//                     style={{
//                       width: "240px",
//                       height: "30px",
//                       margin: "5px",
//                       padding: "4px",
//                       borderWidth:"0px",
//                       borderRadius: "5px",
//                       cursor: "pointer",
//                       textAlign: "left",
//                       paddingLeft: "7px",
//                       color: "#4A4A4D",
//                       boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
//                       backgroundColor:
//                       search === history._id ? "#4A4A4D" : "#f5f5f5",
//                       color: search === history._id ? "#fff" : "#4A4A4D",
//                     }}
//                     whileHover={{
//                       scale: 1.05,
//                     }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() =>
//                       handleGetSingleHistoryDocument(history._id, history.userId)
//                     }
//                   >
//                     {history?.chatName}......
//                   </motion.button>
//                 </Link>

//                 <Tooltip title="Delete chat" arrow>
//                   <motion.button
//                     onClick={() => handleDeleteHistory(history._id, history.userId)}
//                     style={{
//                       width: "35px",
//                       height: "30px",
//                       margin: "5px",
//                       padding: "4px",
//                       borderRadius: "5px",
//                       borderWidth: "0px",
//                       display: "flex",
//                       justifyContent: "center",
//                       alignItems: "center",
//                       cursor: "pointer",
//                       boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
//                       backgroundColor:
//                         search === history._id ? "#4A4A4D" : "#f5f5f5",
//                       color: search === history._id ? "#fff" : "#4A4A4D",
//                     }}
//                     whileHover={{
//                       scale: 1.05,
//                       boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
//                     }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <DeleteIcon />
//                   </motion.button>
//                 </Tooltip>
//               </motion.li>
//             ))}
//           </AnimatePresence>
//         </motion.ul>
//       </div>
//     </div>
//   );
// };

// export default History;



// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import DeleteIcon from "@mui/icons-material/Delete";
// // import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
// import { Tooltip } from "@mui/material";
// import { useSearchParams } from 'next/navigation'
// import IconButton from '@mui/material/IconButton';
// import { useUserSession } from "@/app/context/UserSessionContext";

// const History = ({ historyData  }) => {
//     const session = useUserSession()
    
//     const [updatedHistoryAfterDeletion, setupdatedHistoryAfterDeletion] = useState(historyData);
//     const searchParams = useSearchParams()
//     console.log("searchParams",searchParams)
//     const search = searchParams.get('id')
//     console.log("search",search)
//     console.log("historyData",historyData)

//     const handleGetSingleHistoryDocument = (id, userId) => {
//         console.log(id,"id");
//         console.log(userId, "userId");
//     };

//     console.log("userSession",session)

//     const onNewChat = () => {
//         // setHistory([]);
//         // setInput('');
//         localStorage.clear();
//         window.location.href = '/';
//       };

//     const handleDeleteHistory = async (id, userId) => {
//         try {
//             const response = await fetch(`/api/history/`, {
//                 method: "DELETE",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ id, userId }),
//             });

//             const data = await response.json();
//             if (data.success) {
//                 // alert("Chat deleted successfully!");
//                 window.location.href = "/";
//                 setupdatedHistoryAfterDeletion(...historyData);
//                 localStorage.clear();
//             } else {
//                 alert("Failed to delete chat.");
//             }
//         } catch (error) {
//             console.error("Error deleting chat:", error);
//             alert("An error occurred while deleting the chat.");
//         }
//     };

//     return (
//         <div
//             style={{
//                 width: "20vw",
//                 height: "93vh",
//                 border: "1px",
//                 borderColor: "blue",
//                 textAlign: "center",
//                 backgroundColor: "black",
//                 borderRadius: "10px",
//                 paddingTop: "10px",
//                 paddingBottom: "10px",
//             }}
//         >
            
//             {search !== null && <button style={{cursor:"pointer",width:"90%", marginTop:"5px",marginBottom:"5px" , height:"35px", borderRadius:"5px" ,borderWidth:"1px"}} 
//             onMouseEnter={(e) => {
//                 e.target.style.backgroundColor = "white";
//                 e.target.style.color = "black";
//                 e.target.style.borderColor="white"
                
//             }}
//             onMouseLeave={(e) => {
//                 e.target.style.backgroundColor = "black";
//                 e.target.style.color = "white";
//             }}
//             onClick={onNewChat}> NEW CHAT </button>}
//             <p style={{ color: "white" }}>History</p>

//             <ul style={{ listStyle: "none", margin: "10px" }}>
//                 {[...historyData].reverse().map((history) => (
//                     <li key={history._id} style={{ display: "flex" }}>
//                         <Link href={`/?id=${history._id}`}>
//                             <button
//                                 style={{
//                                     width: "240px",
//                                     height: "30px",
//                                     margin: "5px",
//                                     padding: "4px",
//                                     borderRadius: "5px",
//                                     // borderWidth: "1px",
//                                     cursor: "pointer",
//                                     textAlign: "left",
//                                     paddingLeft: "7px",
//                                     color: "white",
//                                     // backgroundColor: "black",
//                                     // border: "1px solid white",
//                                     // transition: "all 0.3s ease",
//                                     color: search === history._id ? "black" : "white",
//                                     backgroundColor: search === history._id ? "white" : "black",
//                                     border: search === history._id ? "2px solid #61dafb" : "1px solid white",
//                                 }}
//                                 onClick={() =>
//                                     handleGetSingleHistoryDocument(history._id, history.userId)
//                                 }
//                                 // onMouseEnter={(e) => {
//                                 //     e.target.style.backgroundColor = "white";
//                                 //     e.target.style.color = "black";
//                                 // }}
//                                 // onMouseLeave={(e) => {
//                                 //     e.target.style.backgroundColor = "black";
//                                 //     e.target.style.color = "white";
//                                 // }}
//                             >
//                                 {history?.chatName}......
//                             </button>
//                         </Link>

//                         <Tooltip title="Delete chat" arrow>
//                             <button
//                                 onClick={() =>
//                                     handleDeleteHistory(history._id, history.userId)
//                                 }
//                                 style={{
//                                     width: "35px",
//                                     height: "30px",
//                                     margin: "5px",
//                                     padding: "4px",
//                                     borderRadius: "5px",
//                                     borderWidth: "1px",
//                                     display: "flex",
//                                     justifyContent: "center",
//                                     alignItems: "center",
//                                     cursor: "pointer",
//                                     backgroundColor: "white",
                                    
//                                 }}
//                             >
//                                 {/* <MoreHorizIcon/> */}
                               
//                                 <DeleteIcon />
                                
//                             </button>
//                         </Tooltip>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default History;
