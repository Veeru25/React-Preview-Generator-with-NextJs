import DBConnection from "@/app/utils/config/db";
import HistoryModel from "@/app/utils/models/History";


export const POST = async (req) => {
    console.log("API route accessed: POST");

    try {
        // Ensure a database connection
        await DBConnection;
        console.log("Database connection successful");

        // Parse the request body
        const body = await req.json();
        const { userId, chatName, messages } = body;

        // Validate the required fields
        if (!userId || !messages || !Array.isArray(messages)) {
            console.log("Validation failed");
            return new Response(
                JSON.stringify({ error: "Invalid input. userId and messages are required." }),
                { status: 400 }
            );
        }

        // Create a new history document
        
        const newHistory = new HistoryModel({
            userId,
            chatName: chatName || "Untitled Chat",
            messages,
        });

        // Save the document to the database
        const savedHistory = await newHistory.save();
        // console.log("History saved successfully:", savedHistory);

        return new Response(JSON.stringify({ success: true, data: savedHistory }), { status: 201 });
    } catch (error) {
        console.error("Error in POST handler:", error);
        return new Response(JSON.stringify({ success: false, error: "Internal Server Error" }), {
            status: 500,
        });
    }
};


export const GET = async (req) => {
    console.log("API route accessed: GET");

    try {
        // Extract query parameters from the request URL
        const url = new URL(req.url);
        const { searchParams } = url;
        const id = searchParams.get('id'); // Optional query parameter
        const userId = searchParams.get('userId'); // Optional query parameter for userId filtering
        console.log("userId",userId)

        // Ensure a database connection
        await DBConnection;
        console.log("Database connection successful");

        if (id) {
            // Fetch a single document by ID
            const history = await HistoryModel.findById(id);

            if (!history) {
                return new Response(JSON.stringify({ success: false, error: "History not found", data: "History not found" }), {
                    status: 404,
                });
            }

            return new Response(JSON.stringify({ success: true, data: history.toObject() }), { status: 200 });
        }

        // Fetch all history records
        let histories = (await HistoryModel.find({userId}));

        console.log("Fetched histories:", histories);

   

        // Log filtered histories
        console.log("Filtered histories:", histories);

        // Transform documents into plain objects
        const transformedHistories = histories.map((doc) => doc.toObject());

        return new Response(JSON.stringify({ success: true, data: transformedHistories }), { status: 200 });
    } catch (error) {
        console.error("Error in GET handler:", error);
        return new Response(JSON.stringify({ success: false, error: "Internal Server Error" }), {
            status: 500,
        });
    }
};



export const DELETE = async (req) => {
    console.log("API route accessed: DELETE");

    try {
        const body = await req.json();
        const { id, userId } = body;

        if (!userId || !id) {
            return new Response(
                JSON.stringify({ success: false, error: "userId and chatId are required" }),
                { status: 400 }
            );
        }

        await DBConnection;
        console.log("Database connection successful");

        // Find and delete the history document based on userId and chatId
        const deletedHistory = await HistoryModel.findOneAndDelete({
            _id: id,
            userId: userId,
        });

        if (!deletedHistory) {
            return new Response(
                JSON.stringify({ success: false, error: "Chat not found or not owned by user" }),
                { status: 404 }
            );
        }

        return new Response(JSON.stringify({ success: true, message: "Chat deleted successfully" }), { status: 200 });
    } catch (error) {
        console.error("Error in DELETE handler:", error);
        return new Response(JSON.stringify({ success: false, error: "Internal Server Error" }), { status: 500 });
    }
};

export const PUT = async (req) => {
    console.log("API route accessed: PUT");

    try {
        const body = await req.json();
        const { userId, chatName, messages } = body;

        if (!userId || !messages || !Array.isArray(messages)) {
            return new Response(
                JSON.stringify({ success: false, error: "Invalid input. userId and messages are required." }),
                { status: 400 }
            );
        }

        await DBConnection;
        console.log("Database connection successful");

        // Find an existing document or create a new one
        const existingHistory = await HistoryModel.findOneAndUpdate(
            { userId, chatName },
            { userId, chatName, messages },
            { new: true, upsert: true }
        );

        return new Response(JSON.stringify({ success: true, data: existingHistory }), { status: 200 });
    } catch (error) {
        console.error("Error in PUT handler:", error);
        return new Response(JSON.stringify({ success: false, error: "Internal Server Error" }), { status: 500 });
    }
};


// export const GET = async (req) => {
//     console.log("API route accessed: GET");

//     try {
//         // Extract _id from the request URL
//         const url = new URL(req.url);
//         const { searchParams } = url;
//         console.log("searchParams",searchParams)
//         const id = searchParams.get('id');  // Assuming the _id is passed as a query parameter

    
//         // Ensure a database connection
//         await DBConnection;
//         console.log("Database connection successful");
        

//         if (id) {
//             // Fetch the single document
//             const history = await HistoryModel.findById(id);


//             if (!history) {
//                 return new Response(JSON.stringify({ success: false, error: "History not found"  , data: "History not found" }), {
//                     status: 404,
//                 });
//             }

//             // console.log("History fetched successfully:", history);
//             return new Response(JSON.stringify({ success: true, data: history.toObject() }), { status: 200 });
//         }

//         // Fetch all history records
//         const histories = await HistoryModel.find(id);
        
//         console.log("histories",histories)

//         // Transform the response to remove any remaining _id fields
//         const transformedHistories = histories.map((doc) => doc.toObject());
//         console.log("transformedHistories",transformedHistories)
//         // console.log("Histories fetched successfully:", transformedHistories);

//         return new Response(JSON.stringify({ success: true, data: transformedHistories }), { status: 200 });
//     } catch (error) {
//         console.error("Error in GET handler:", error);
//         return new Response(JSON.stringify({ success: false, error: "Internal Server Error" }), {
//             status: 500,
//         });
//     }
// };

// export const PUT = async (req) => {

//     console.log("API route accessed: PUT");

//     try {
//         // Ensure a database connection
//         await DBConnection;
//         console.log("Database connection successful");

//         // Parse the request body
//         const body = await req.json();
//         const { id, userId, chatName, messages } = body;

//         // Validate the required fields
//         if (!id || !userId || !messages || !Array.isArray(messages)) {
//             console.log("Validation failed");
//             return new Response(
//                 JSON.stringify({ error: "Invalid input. id, userId, and messages are required." }),
//                 { status: 400 }
//             );
//         }

//         // Find the history document by id and userId
//         const history = await HistoryModel.findOne({ id, userId });

//         if (!history) {
//             return new Response(
//                 JSON.stringify({ success: false, error: "History not found or not owned by user" }),
//                 { status: 404 }
//             );
//         }

//         // Update the fields (chatName and messages)
//         history.chatName =  history.chatName;  // Only update if provided
//         history.messages = messages; // Always update messages

//         // Save the updated document
//         const updatedHistory = await history.save();

//         console.log("History updated successfully:", updatedHistory);

//         return new Response(
//             JSON.stringify({ success: true, data: updatedHistory.toObject() }),
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("Error in PUT handler:", error);
//         return new Response(
//             JSON.stringify({ success: false, error: "Internal Server Error" }),
//             { status: 500 }
//         );
//     }
// };
