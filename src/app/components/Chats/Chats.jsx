

'use client';

import React, { useState, useEffect } from 'react';
import { motion , AnimatePresence } from "framer-motion";
// import { useRouter } from 'next/router';
import Markdown from 'markdown-to-jsx';
import ClipLoader from 'react-spinners/ClipLoader';
import { TextField, Modal, Tooltip, CircularProgress } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add'; // Plus icon
import NearMeIcon from '@mui/icons-material/NearMe';
import { useSearchParams } from 'next/navigation';
import styles from './chats.module.css';
import { useUserSession } from '@/app/context/UserSessionContext';

export default function Chats({ historyData, setHistoryData }) {

  const session = useUserSession()

  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedHistory, setSavedHistory] = useState([]);
  const searchParams = useSearchParams();
  const [initialHistory, setInitialHistory] = useState([]);


  const inputVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
    focus: { scale: 1.05, transition: { duration: 0.3 } },
  };

  // Animation variants for the button
  const buttonVariants = {
    hover: { scale: 1.1, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)" },
    tap: { scale: 0.95 },
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3, ease: "easeIn" } },
  };
   const messageVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };
  // const containerVariants = {
  //   hidden: { opacity: 0, y: 50 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: {
  //       duration: 0.5,
  //       ease: "easeOut",
  //       staggerChildren: 0.1,
  //     },
  //   },
  // };
 
  // const messageVariants = {
  //   hidden: { opacity: 0, scale: 0.8 },
  //   visible: (i) => ({
  //     opacity: 1,
  //     scale: 1,
  //     transition: { type: "spring", stiffness: 100, damping: 10, delay: i * 0.1 },
  //   }),
  // };

  const toggleTab = () => setIsTabOpen((prev) => !prev);

  


  useEffect(() => {
    const query = Object.fromEntries(searchParams.entries());

    if (query?.id) {
      const endPoint = `http://localhost:3000/api/history?id=${query?.id}`;

      fetch(endPoint)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((res) => {
          const fetchedMessages = res?.data?.messages || [];
          setHistory(fetchedMessages);
          setInitialHistory(fetchedMessages); // Save the initial state
        })
        .catch((error) => {
          console.error('Error fetching chat history:', error);
        });
    } else {
      const storedHistory = localStorage.getItem('chatHistory');

      if (storedHistory) {
        try {
          const parsedHistory = JSON.parse(storedHistory);
          setSavedHistory(parsedHistory);
          setHistory(parsedHistory);
          setInitialHistory(parsedHistory); // Save the initial state
        } catch (error) {
          console.error('Error parsing chat history:', error);
        }
      }
    }
  }, [searchParams]);


  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(history));
    }
  }, [history]);

  // const onSend = async () => {
  //   if (!input.trim()) return;


  //   const userObj = {
  //     role: 'user',
  //     parts: [{ text: input }],
  //   };

  //   const historyWithoutId = history.map(item => {
  //     const { _id, parts, ...rest } = item;
  //     const updatedParts = parts.map(part => {
  //       const { _id, ...restPart } = part;
  //       return restPart;
  //     });

  //     return { ...rest, parts: updatedParts };
  //   });

  //   const updatedHistory = [...historyWithoutId, userObj];
  //   setHistory(updatedHistory);
  //   setInput('');
  //   setLoading(true);

  //   try {
  //     const response = await fetch('/api/chat', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ message: input, history: updatedHistory }),
  //     });

  //     const data = await response.json();
  //     const resObj = {
  //       role: 'model',
  //       parts: [{ text: data.message }],
  //     };

  //     const newHistory = [...updatedHistory, resObj];
  //     setHistory(newHistory);

  //     // Save the updated history to /api/history
  //     const userId = await userSession?.user?.id;

  //     try {
  //       const saveResponse = await fetch('/api/history/', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           userId,
  //           chatName: newHistory[0]?.parts[0]?.text || "Untitled Chat",
  //           messages: newHistory,
  //         }),
  //       });

  //       if (!saveResponse.ok) {
  //         throw new Error(`Error: ${saveResponse.status}`);
  //       }

  //       const saveData = await saveResponse.json();
  //       console.log("Chat saved successfully:", saveData);

  //       setHistoryData(prevData => [
  //         ...prevData,
  //         {
  //           "_id": saveData?.data?._id,
  //           "chatName": newHistory[0]?.parts[0]?.text || "Untitled Chat",
  //         },
  //       ]);
  //     } catch (error) {
  //       console.error("Error saving chat history:", error);
  //     }

  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  //   setLoading(false);
  // };



  //first
  // const onSend = async () => {
  //   if (!input.trim()) return;

  //   const userObj = {
  //     role: 'user',
  //     parts: [{ text: input }],
  //   };

  //   // console.log(history)

  //   const historyWithoutId = history.map(item => {
  //     // Remove the _id from the main object and from each part in the parts array
  //     const { _id, parts, ...rest } = item;
  //     const updatedParts = parts.map(part => {
  //       const { _id, ...restPart } = part;
  //       return restPart;  // Return the part without the _id
  //     });

  //     return { ...rest, parts: updatedParts };  // Return the item without the _id and with updated parts
  //   });

  //   // console.log(historyWithoutId);

  //   const updatedHistory = [...historyWithoutId, userObj];
  //   setHistory(updatedHistory);
  //   setInput('');
  //   setLoading(true);

  //   try {
  //     const response = await fetch('/api/chat', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ message: input, history: updatedHistory }),
  //     });

  //     const data = await response.json();
  //     const resObj = {
  //       role: 'model',
  //       parts: [{ text: data.message }],
  //     };

  //     setHistory((prevState) => [...prevState, resObj]);

  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  //   setLoading(false);
  // };


  // second


  // const onSend = async () => {
  //   if (!input.trim()) return;

  //   const userObj = {
  //     role: 'user',
  //     parts: [{ text: input }],
  //   };

  //   const historyWithoutId = history.map(item => {
  //     const { _id, parts, ...rest } = item;
  //     const updatedParts = parts.map(part => {
  //       const { _id, ...restPart } = part;
  //       return restPart;
  //     });

  //     return { ...rest, parts: updatedParts };
  //   });

  //   const updatedHistory = [...historyWithoutId, userObj];
  //   setHistory(updatedHistory);
  //   setInput('');
  //   setLoading(true);

  //   try {
  //     const response = await fetch('/api/chat', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ message: input, history: updatedHistory }),
  //     });

  //     const data = await response.json();
  //     const resObj = {
  //       role: 'model',
  //       parts: [{ text: data.message }],
  //     };

  //     const newHistory = [...updatedHistory, resObj];
  //     setHistory(newHistory);

  //     // Save or update the chat history
  //     const userId = await userSession?.user?.id;

  //     try {
  //       // Check if chat is already saved by checking chat name or other criteria
  //       console.log(historyData.chatName)
  //       const existingChat = historyData.find(chat => chat.chatName === newHistory[0]?.parts[0]?.text);

  //       if (existingChat) {
  //         // If the chat already exists, update the messages
  //         const updateResponse = await fetch(`/api/history/${existingChat._id}`, {
  //           method: 'PUT',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({
  //             userId,
  //             chatName: newHistory[0]?.parts[0]?.text,
  //             messages: newHistory,
  //           }),
  //         });

  //         if (!updateResponse.ok) {
  //           throw new Error(`Error: ${updateResponse.status}`);
  //         }

  //         const updateData = await updateResponse.json();
  //         console.log("Chat updated successfully:", updateData);

  //         // Optionally, update the historyData to reflect changes
  //         setHistoryData(prevData =>
  //           prevData.map(chat =>
  //             chat._id === existingChat._id ? { ...chat, chatName: newHistory[0]?.parts[0]?.text } : chat
  //           )
  //         );
  //       } else {
  //         // If the chat doesn't exist, create a new one
  //         const saveResponse = await fetch('/api/history/', {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({
  //             userId,
  //             chatName: newHistory[0]?.parts[0]?.text || "Untitled Chat",
  //             messages: newHistory,
  //           }),
  //         });

  //         if (!saveResponse.ok) {
  //           throw new Error(`Error: ${saveResponse.status}`);
  //         }

  //         const saveData = await saveResponse.json();
  //         console.log("Chat saved successfully:", saveData);

  //         setHistoryData(prevData => [
  //           ...prevData,
  //           {
  //             "_id": saveData?.data?._id,
  //             "chatName": newHistory[0]?.parts[0]?.text || "Untitled Chat",
  //           },
  //         ]);
  //       }
  //     } catch (error) {
  //       console.error("Error saving or updating chat history:", error);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  //   setLoading(false);
  // };

  const onSend = async () => {
    if (!input.trim()) return;

    const userObj = {
      role: 'user',
      parts: [{ text: input }],
    };

    const historyWithoutId = history.map(item => {
      const { _id, parts, ...rest } = item;
      const updatedParts = parts.map(part => {
        const { _id, ...restPart } = part;
        return restPart;
      });
      return { ...rest, parts: updatedParts };
    });

    const updatedHistory = [...historyWithoutId, userObj];
    setHistory(updatedHistory);
    setInput('');
    setLoading(true);

    try {
      // Send the message to the chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history: updatedHistory }),
      });

      const data = await response.json();
      const resObj = {
        role: 'model',
        parts: [{ text: data.message }],
      };

      // Update the history with the model's response
      const finalHistory = [...updatedHistory, resObj];
      setHistory(finalHistory);

      const userId = session?.user?.id; // Assuming `userSession` is defined elsewhere
      const chatName = finalHistory[0]?.parts[0]?.text || "Untitled Chat";

      // Determine whether to create or update the history
      const isNewChat = history.length === 0;

      const historyResponse = await fetch('/api/history/', {
        method: isNewChat ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, chatName, messages: finalHistory }),
      });

      const historyData = await historyResponse.json();

      if (historyData.success) {
        setHistoryData(prevData => [
          ...prevData.filter(item => item._id !== historyData.data._id), // Remove duplicate entries
          {
            _id: historyData.data._id,
            chatName,
          },
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };


  const handleInput = (e) => {
    setInput(e.target.value);
  };

  // const onNewChat = async () => {


  //   const userId = await userSession?.user?.id;

  //   // Check if any changes are made to the history
  //   if (!isHistoryChanged(initialHistory, history)) {
  //     console.log("No changes detected. Skipping save operation.");
  //     setHistory([]); // Clear the current history
  //     setInput("");
  //     localStorage.clear()
  //     window.location.href = '/';
  //     return;
  //   }


  //   try {
  //     const response = await fetch('/api/history/', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         userId, // Replace with the current user's ID
  //         chatName: history[0]?.parts[0]?.text || "Untitled Chat", // Customize the chat name
  //         messages: history, // The chat history array
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Error: ${response.status}`);
  //     }

  //     const data = await response.json();

  //     console.log("Chat saved successfully:", data);

  //     setHistory([]);
  //     setInput("");
  //     setLoading(false);
  //     localStorage.removeItem('chatHistory');

  //     setHistoryData(prevData => [
  //       ...prevData,
  //       {
  //         "_id": data?.data?._id,
  //         "chatName": history[0]?.parts[0]?.text || "Untitled Chat",
  //       },
  //     ]);

  //     window.location.href = '/';

  //   } catch (error) {
  //     console.error("Error saving chat:", error);
  //     alert("Failed to save chat. Please try again.");
  //   }
  // };




  // const isHistoryChanged =  (initial, current) => {
  //   return JSON.stringify(initial) !== JSON.stringify(current);
  // };



  const CodeWithPreview = ({ code }) => {
    const [openModal, setOpenModal] = useState(false);
    const [iframeContent, setIframeContent] = useState('');
    const [loadingPreview, setLoadingPreview] = useState(true);

    const handlePreviewToggle = () => {
      setOpenModal(!openModal);
      setLoadingPreview(true);
    };

    useEffect(() => {
      const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>React Preview</title>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script type="text/babel">
          ${code}
          ReactDOM.createRoot(document.getElementById('root')).render(<App />);
        </script>
      </body>
      </html>
    `;
      setIframeContent(htmlTemplate);
    }, [code]);

    return (
      <div className={styles.codeBox}>
        <div className={styles.buttonContainer}>
          <Tooltip title="Copy Code" arrow>
            <button
              className={styles.copyButton}
              onClick={() => navigator.clipboard.writeText(code)}
            >
              &#x2398;
            </button>
          </Tooltip>
        </div>

        <pre>
          <code>{code}</code>
        </pre>
        <div className={styles.previewButtonContainer}>
          <button className={styles.previewButton} onClick={handlePreviewToggle}>
            {openModal ? 'Close Preview' : 'Preview Output'}
          </button>
        </div>
        <Modal
          open={openModal}
          onClose={handlePreviewToggle}
          className={styles.modalContainer}
        >
          <div className={styles.modalContent}>
            <p className={styles.modalHeader}>Preview Output</p>

            {loadingPreview && <CircularProgress className={styles.modalLoading} />}

            <iframe
              title="output-preview"
              srcDoc={iframeContent}
              sandbox="allow-scripts allow-same-origin"
              className={`${styles.modalIframe} ${!loadingPreview ? styles.loaded : ''}`}
              onLoad={() => setLoadingPreview(false)}
            ></iframe>
          </div>
        </Modal>
      </div>
    );
  };


  return (
    <div className={styles.container}>

      {/* <div
        className={`${styles.chatHistory} ${history.length > 0 ? styles.chatHistoryWithPadding : ''}`}>
        {history.map((el, index) => (
          <div key={index} className={styles.messageContainer}>
            <div
              className={`${styles.chatMessage} ${el.role === 'user' ? styles.userMessage : styles.gptMessage
                }`}
            >
              {el?.parts?.map((part, i) => {
                const text = part?.text;
                const segments = text?.split(/(```[\s\S]*?```)/g);

                return segments?.map((segment, j) => {
                  if (segment?.startsWith('```') && segment?.endsWith('```')) {
                    const codeWithMetadata = segment?.slice(3, -3);
                    const [type, ...codeLines] = codeWithMetadata?.split('\n');
                    const code = codeLines?.join('\n');
                    return (
                      <div key={`${i}-${j}`}>
                        <div variant="caption" color="#000">
                          TYPE : {type}
                        </div>
                        <CodeWithPreview key={`${i}-${j}`} code={code} />
                      </div>
                    );
                  } else {
                    return (
                      <Markdown className={styles.explainContainer} key={`${i}-${j}`}>
                        {segment}
                      </Markdown>
                    );
                  }
                });
              })}
            </div>
          </div>
        ))}
        {loading && (
          <div>
            <ClipLoader color="#4A90E2" size={15} />
            <span className={styles.spanLoading}>...Loading</span>
          </div>
        )}
      </div> */}

      <motion.div
        
        className={`${styles.chatHistory} ${history.length > 0 ? styles.chatHistoryWithPadding : ""
          }`}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        {history.map((el, index) => (
          <motion.div
            key={index}
            className={styles.messageContainer}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={messageVariants}
          >
            <div
              className={`${styles.chatMessage} ${el.role === "user" ? styles.userMessage : styles.gptMessage
                }`}
            >
              {el?.parts?.map((part, i) => {
                const text = part?.text;
                const segments = text?.split(/(```[\s\S]*?```)/g);

                return segments?.map((segment, j) => {
                  if (segment?.startsWith("```") && segment?.endsWith("```")) {
                    const codeWithMetadata = segment?.slice(3, -3);
                    const [type, ...codeLines] = codeWithMetadata?.split("\n");
                    const code = codeLines?.join("\n");
                    return (
                      <motion.div key={`${i}-${j}`} variants={messageVariants}>
                        <div variant="caption" color="#000">
                          TYPE : {type}
                        </div>
                        <CodeWithPreview key={`${i}-${j}`} code={code} />
                      </motion.div>
                    );
                  } else {
                    return (
                      <Markdown
                        className={styles.explainContainer}
                        key={`${i}-${j}`}
                      >
                        {segment}
                      </Markdown>
                    );
                  }
                });
              })}
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ClipLoader color="#4A90E2" size={15} />
            <span className={styles.spanLoading}>...Loading</span>
          </motion.div>
        )}
      </motion.div>





      <div  style={{ display: "flex", alignItems: "center", gap: "10px" }} className={styles.header} >

        


<motion.input
        type="text"
        value={input}
        onChange={handleInput}
        placeholder="Ask Here..."
        variants={inputVariants}
        initial="initial"
        animate="animate"
        whileFocus="focus"
        style={{
          width: "900px", // Set the desired width here
          marginRight:"20px",
          padding: "10px 15px",
          borderRadius: "5px",
          border: "1px solid #61dafb",
          fontSize: "16px",
          outline: "none",
          transition: "border-color 0.3s ease",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#61dafb")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />

      {/* Send Button */}
      {/* <Tooltip title="Send" arrow> */}
        <motion.button
          className="send-btn"
          onClick={onSend}
          aria-label="Send a message"
          disabled={loading}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          style={{
            padding: "10px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#61dafb",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
          }}
        >
          {loading ? <ClipLoader color="#fff" size={20} /> : <NearMeIcon />}
        </motion.button>
      {/* </Tooltip> */}


        {/* ---------crt */}
        {/* <TextField
          className={styles.inputField}
          variant="outlined"
          label="Ask Here..."
          value={input}
          onChange={handleInput}
        />

        <Tooltip title="Send" arrow>
          <button
            className={styles.sendBtn}
            variant="contained"
            size="large"
            onClick={onSend}
            aria-label="Send a message"
            disabled={loading}
          >
            {loading ? <ClipLoader color="#fff" size={20} /> : <NearMeIcon />}

          </button> 
        </Tooltip>*/}

        
      </div>

    </div>
  );
}

