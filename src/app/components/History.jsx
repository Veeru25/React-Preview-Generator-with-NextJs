import Link from "next/link";

const History = ({ historyData }) => {
    
    const handleGetSingleHistoryDocument = (id) => {
        console.log(id)
    }

    return (
        <div style={{ width: "20vw", height: "100vh", border: "1px", borderColor: "blue", textAlign: "center", backgroundColor: "grey" , borderRadius:"10px", paddingTop:"10px" , paddingBottom:"10px"}}>
            <p>History</p>
           
            <ul style={{listStyle: 'none' , margin :"10px"  }}>
                {historyData.map((history) => (
                    <li key={history._id} onClick={() => handleGetSingleHistoryDocument(history._id)}>
                        <Link href={`/?id=${history._id}`}>
                        <button style={{width:"240px", height:"30px" , margin:"5px", padding:"4px" , borderRadius:"5px" ,borderWidth:"1px"  , cursor:"pointer" , textAlign:"left" , paddingLeft:"7px"}}>
                        {history?.chatName}......
                        </button>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default History;
