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
        console.log("History saved successfully:", savedHistory);

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
        // Extract _id from the request URL
        const url = new URL(req.url);
        const { searchParams } = url;
        const id = searchParams.get('id');  // Assuming the _id is passed as a query parameter

        // Ensure a database connection
        await DBConnection;
        console.log("Database connection successful");

        if (id) {
            // Fetch the single document
            const history = await HistoryModel.findById(id);

            if (!history) {
                return new Response(JSON.stringify({ success: false, error: "History not found" }), {
                    status: 404,
                });
            }

            console.log("History fetched successfully:", history);
            return new Response(JSON.stringify({ success: true, data: history.toObject() }), { status: 200 });
        }

        // Fetch all history records
        const histories = await HistoryModel.find();

        // Transform the response to remove any remaining _id fields
        const transformedHistories = histories.map((doc) => doc.toObject());
        // console.log("Histories fetched successfully:", transformedHistories);

        return new Response(JSON.stringify({ success: true, data: transformedHistories }), { status: 200 });
    } catch (error) {
        console.error("Error in GET handler:", error);
        return new Response(JSON.stringify({ success: false, error: "Internal Server Error" }), {
            status: 500,
        });
    }
};
