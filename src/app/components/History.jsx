"use client";

import Link from "next/link";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";

const History = ({ historyData }) => {
    
    const [updatedHistoryAfterDeletion, setupdatedHistoryAfterDeletion] = useState(historyData);

    const handleGetSingleHistoryDocument = (id, userId) => {
        console.log(id);
        console.log(userId, "userId");
    };

    const handleDeleteHistory = async (id, userId) => {
        try {
            const response = await fetch(`/api/history/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, userId }),
            });

            const data = await response.json();
            if (data.success) {
                alert("Chat deleted successfully!");
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

    return (
        <div
            style={{
                width: "20vw",
                height: "93vh",
                border: "1px",
                borderColor: "blue",
                textAlign: "center",
                backgroundColor: "black",
                borderRadius: "10px",
                paddingTop: "10px",
                paddingBottom: "10px",
            }}
        >
            <p style={{ color: "white" }}>History</p>

            <ul style={{ listStyle: "none", margin: "10px" }}>
                {historyData.map((history) => (
                    <li key={history._id} style={{ display: "flex" }}>
                        <Link href={`/?id=${history._id}`}>
                            <button
                                style={{
                                    width: "240px",
                                    height: "30px",
                                    margin: "5px",
                                    padding: "4px",
                                    borderRadius: "5px",
                                    borderWidth: "1px",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    paddingLeft: "7px",
                                    color: "white",
                                    backgroundColor: "black",
                                    border: "1px solid white",
                                    transition: "all 0.3s ease",
                                }}
                                onClick={() =>
                                    handleGetSingleHistoryDocument(history._id, history.userId)
                                }
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = "white";
                                    e.target.style.color = "black";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = "black";
                                    e.target.style.color = "white";
                                }}
                            >
                                {history?.chatName}......
                            </button>
                        </Link>

                        <Tooltip title="Delete chat" arrow>
                            <button
                                onClick={() =>
                                    handleDeleteHistory(history._id, history.userId)
                                }
                                style={{
                                    width: "35px",
                                    height: "30px",
                                    margin: "5px",
                                    padding: "4px",
                                    borderRadius: "5px",
                                    borderWidth: "1px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    backgroundColor: "white",
                                }}
                            >
                                <DeleteIcon />
                            </button>
                        </Tooltip>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default History;




// "use client"

// import Link from "next/link";
// import { useState } from "react";
// import DeleteIcon from '@mui/icons-material/Delete';
// import { TextField, Modal, Tooltip, CircularProgress } from '@mui/material';

// const History = ({ historyData }) => {
//     const [updatedHistoryAfterDeletion,setupdatedHistoryAfterDeletion] = useState(historyData)
//     const handleGetSingleHistoryDocument = (id, userId) => {
//         console.log(id);
//         console.log(userId, "userId");
//     };

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
//                 alert("Chat deleted successfully!");
//                 window.location.href = '/';
//                 setupdatedHistoryAfterDeletion(...historyData)
//                 localStorage.clear()
//                 // Optionally, you can trigger a refresh or update the UI to remove the deleted chat.
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
//             <p style={{ color: "white" }}>History</p>

//             <ul style={{ listStyle: "none", margin: "10px" }}>
//                 {historyData.map((history) => (
//                     <li key={history._id} style={{display:"flex"}}>
//                         <Link href={`/?id=${history._id}`}>
                           
//                             <button
//     style={{
//         width: "240px",
//         height: "30px",
//         margin: "5px",
//         padding: "4px",
//         borderRadius: "5px",
//         borderWidth: "1px",
//         cursor: "pointer",
//         textAlign: "left",
//         paddingLeft: "7px",
//         color: "white",  // Initial text color
//         backgroundColor: "black",  // Initial background color
//         border: "1px solid white", // Border color for the initial state
//         transition: "all 0.3s ease",  // Smooth transition for hover effect
//     }}
//     onClick={() =>
//         handleGetSingleHistoryDocument(
//             history._id,
//             history.userId
//         )
//     }
//     onMouseEnter={(e) => {
//         e.target.style.backgroundColor = "white";  // On hover: change background color
//         e.target.style.color = "black";  // On hover: change text color
//     }}
//     onMouseLeave={(e) => {
//         e.target.style.backgroundColor = "black";  // Revert background color when hover ends
//         e.target.style.color = "white";  // Revert text color when hover ends
//     }}
// >
//     {history?.chatName}......
// </button>

//                         </Link>
                        
//  <Tooltip title="Delete chat" arrow>
//             <button
//                             onClick={() =>
//                                 handleDeleteHistory(history._id, history.userId)
//                             }
//                             style={{
//                                 width: "35px",
//                                 height: "30px",
//                                 margin: "5px",
//                                 padding: "4px",
//                                 borderRadius: "5px",
//                                 borderWidth: "1px",
//                                 display:"flex",
//                                 justifyContent:"center",
//                                 alignItems:"center",
//                                 cursor: "pointer",
//                                 backgroundColor: "white",
//                                 // color: "black",
//                             }}
//                         >
//                             <DeleteIcon/>
//                         </button>
//           </Tooltip>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default History;




// WIthout delete button


// import Link from "next/link";

// const History = ({ historyData }) => {
    
//     const handleGetSingleHistoryDocument = (id , userId) => {
//         console.log(id)
//         console.log(userId , "userId")
//     }

//     return (
//         <div style={{ width: "20vw", height: "93vh", border: "1px", borderColor: "blue", textAlign: "center", backgroundColor: "black" , borderRadius:"10px", paddingTop:"10px" , paddingBottom:"10px"}}>
//             <p style={{color:"white"}}>History</p>
           
//             <ul style={{listStyle: 'none' , margin :"10px"  }}>
//                 {historyData.map((history) => (
//                     <li key={history._id} onClick={() => handleGetSingleHistoryDocument(history._id , history.userId)}>
//                         <Link href={`/?id=${history._id}`}>
//                         <button style={{width:"240px", height:"30px" , margin:"5px", padding:"4px" , borderRadius:"5px" ,borderWidth:"1px"  , cursor:"pointer" , textAlign:"left" , paddingLeft:"7px"}}>
//                         {history?.chatName}......
//                         </button>
//                         </Link>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }

// export default History;














//Previous 



// "use client"
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// const History = ({ historyData }) => {
//     const router = useRouter();

//     const handleGetSingleHistoryDocument = (id) => {
//         console.log(id);
//     };

//     const handleDeleteHistoryDocument = async (id) => {
//         try {
//             const response = await fetch(`/api/history?id=${id}`, {
//                 method: 'DELETE',
//             });

//             const result = await response.json();

//             if (result.success) {
//                 // Redirect to home after deletion
//                 router.push('/');
//             } else {
//                 alert("Failed to delete history.");
//             }
//         } catch (error) {
//             console.error("Error deleting history:", error);
//             alert("An error occurred while deleting the history.");
//         }
//     };

//     return (
//         <div style={{ width: "20vw", height: "100vh", border: "1px", borderColor: "blue", textAlign: "center", backgroundColor: "grey", borderRadius: "10px", paddingTop: "10px", paddingBottom: "10px" }}>
//             <p>History</p>

//             <ul style={{ listStyle: 'none', margin: "10px" }}>
//                 {historyData.map((history) => (
//                     <li key={history._id} onClick={() => handleGetSingleHistoryDocument(history._id)}>
//                         <Link href={`/?id=${history._id}`}>
//                             <button style={{ width: "240px", height: "30px", margin: "5px", padding: "4px", borderRadius: "5px", borderWidth: "1px", cursor: "pointer", textAlign: "left", paddingLeft: "7px" }}>
//                                 {history?.chatName}......
//                             </button>
//                         </Link>
//                         {/* Delete Button */}
//                         <button
//                             onClick={(e) => {
//                                 e.stopPropagation(); // Prevent the click from triggering the history link
//                                 handleDeleteHistoryDocument(history._id);
//                             }}
//                             style={{
//                                 marginLeft: "10px",
//                                 width: "80px",
//                                 height: "30px",
//                                 backgroundColor: "red",
//                                 color: "white",
//                                 borderRadius: "5px",
//                                 cursor: "pointer",
//                             }}
//                         >
//                             Delete
//                         </button>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default History;
