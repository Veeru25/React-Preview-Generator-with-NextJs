'use client';

import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { motion, AnimatePresence } from "framer-motion";
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import { useRouter } from 'next/router';
import Markdown from 'markdown-to-jsx';
import ClipLoader from 'react-spinners/ClipLoader';
import { Tooltip, CircularProgress , Modal } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add'; // Plus icon
import NearMeIcon from '@mui/icons-material/NearMe';
import { useSearchParams } from 'next/navigation';
import styles from './chats.module.css';
import { useUserSession } from '@/app/context/UserSessionContext';
import { useHistoryContext } from '@/app/context/HistoryContext';

export default function Chats({ historyData , setHistoryData }) {

  const session = useUserSession()
  const { setHistoryLength } = useHistoryContext()
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedHistory, setSavedHistory] = useState([]);
  const searchParams = useSearchParams();
  const [initialHistory, setInitialHistory] = useState([]);

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
  useEffect(() => {
    setHistoryLength(history.length);
  }, [history, setHistoryLength]);

  useEffect(() => {
    const query = Object.fromEntries(searchParams.entries());

    if (query?.id) {
      const endPoint = `https://react-preview-generator-with-next-js.vercel.app/api/history?id=${query?.id}`;

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
          setInitialHistory(parsedHistory); 
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
      const response = await fetch('https://react-preview-generator-with-next-js.vercel.app/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history: updatedHistory }),
      });

      const data = await response.json();
      const resObj = {
        role: 'model',
        parts: [{ text: data.message }],
      };

      const finalHistory = [...updatedHistory, resObj];
      setHistory(finalHistory);

      const userId = session?.user?.id; 
      const chatName = finalHistory[0]?.parts[0]?.text || "Untitled Chat";

      const isNewChat = history.length === 0;
      
      const historyResponse = await fetch('https://react-preview-generator-with-next-js.vercel.app/api/history', {
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

  // const handleInput = (e) => {
  //   setInput(e.target.value);
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
              style={{display:"flex",justifyContent:"center",alignItems:"center"}}
            >
              {/* &#x2398; */}
              <ContentCopyIcon style={{ fontSize: "18px" }}/>
            </button>
          </Tooltip>
        </div>
        <SyntaxHighlighter language="jsx"
         style={vs}
        // style={dracula} 
         className={styles.codeBlock}>
          {code}
        </SyntaxHighlighter>
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
            <ClipLoader color="#4A4A4D" size={15} />
            <span className={styles.spanLoading}>...Loading</span>
          </motion.div>
        )}
      </motion.div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }} className={styles.header} >
        <input
          type="text"
          value={input}
          // onChange={handleInput}
          onChange={(e)=>setInput(e.target.value)}
          placeholder="Ask Here..."
          // variants={inputVariants}
          initial="initial"
          // animate="animate"
          // whileFocus="focus"

          style={{
            color:"#4A4A4D",
            backgroundColor:"#f5f5f5",
            // backgroundColor: "#E4E4E6",
            width: "85%",
            marginRight: "20px",
            padding: "10px 15px",
            borderRadius: "10px",
            border: "0px solid #4A4A4D",
            fontSize: "16px",
            outline: "none",
            // transition: "border-color 0.3s ease",
          }}
          // onFocus={(e) => (e.target.style.borderColor = "#61dafb")}
          // onBlur={(e) => (e.target.style.borderColor = "#ccc")}
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
            backgroundColor: "#4A4A4D",
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
