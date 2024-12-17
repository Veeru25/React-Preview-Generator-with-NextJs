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

        // If an _id is provided, fetch the single document
        if (id) {
            const history = await HistoryModel.findById(id).select('-_id');;

            if (!history) {
                return new Response(JSON.stringify({ success: false, error: "History not found" }), {
                    status: 404,
                });
            }

            console.log(":", history);
            return new Response(JSON.stringify({ success: true, data: history }), { status: 200 });
        }

        // If no _id is provided, fetch all history records
        const histories = await HistoryModel.find().select('-_id');
        console.log("Histories fetched successfully:", histories);

        return new Response(JSON.stringify({ success: true, data: histories }), { status: 200 });
    } catch (error) {
        console.error("Error in GET handler:", error);
        return new Response(JSON.stringify({ success: false, error: "Internal Server Error" }), {
            status: 500,
        });
    }
};