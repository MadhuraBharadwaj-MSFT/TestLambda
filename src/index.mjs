import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: "us-east-2" }); // Replace with your AWS region

export const handler = async (event) => {
    console.log("Event received:", JSON.stringify(event, null, 2)); // Log the entire event for debugging

    const bucketName = 's3bucket-madhura'; // Replace with your S3 bucket name

    let message;
    // Handle cases where the message is directly in the event or in event.body
    try {
        if (event.body) {
            const body = JSON.parse(event.body); // Parse event.body
            message = body.message || 'No message provided';
        } 
    } catch (error) {
        console.log("Error parsing body:", error.message); // Log the error
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid input', details: error.message })
        };
    }

    // Define the S3 PutObject parameters
    const params = {
        Bucket: bucketName,
        Key: `messages/${Date.now()}.txt`, // Store the message as a text file with a timestamp
        Body: message,
        ContentType: 'text/plain'
    };

    try {
        // Write the message to the S3 bucket
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Message saved successfully!' })
        };
    } catch (error) {
        console.log("Error saving message to S3:", error.message); // Log the error
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error saving message', details: error.message })
        };
    }
};