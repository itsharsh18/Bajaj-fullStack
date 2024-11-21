const express = require('express');
const cors = require('cors'); // Import CORS middleware

const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;


app.use(bodyParser.json());
app.use(cors());

function isPrime(num) {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

function processFile(fileB64) {
    if (!fileB64) return { file_valid: false, file_mime_type: null, file_size_kb: null };

    try {
        const buffer = Buffer.from(fileB64, 'base64');
        const mimeType = "unknown"; // Placeholder MIME type
        const sizeKB = (buffer.length / 1024).toFixed(2);

        return { file_valid: true, file_mime_type: mimeType, file_size_kb: sizeKB };
    } catch (err) {
        return { file_valid: false, file_mime_type: null, file_size_kb: null };
    }
}


// POST Endpoint
app.post('/bfhl', (req, res) => {
    try {
        const { data, file_b64 } = req.body;
        const userId = "john_doe_17091999";
        const email = "john@xyz.com";
        const rollNumber = "ABCD123";

        if (!Array.isArray(data)) {
            return res.status(400).json({ is_success: false, message: "Invalid data format" });
        }

        // Separate numbers and alphabets
        const numbers = data.filter(item => /^[0-9]+$/.test(item));
        const alphabets = data.filter(item => /^[a-zA-Z]+$/.test(item));

        // Highest lowercase letter
        const lowercases = alphabets.filter(item => /^[a-z]+$/.test(item));
        const highestLowercase = lowercases.length > 0 ? [lowercases.sort().pop()] : [];

        // Prime number check
        const isPrimeFound = numbers.some(num => isPrime(parseInt(num)));

        // File processing
        const fileDetails = processFile(file_b64);

        res.status(200).json({
            is_success: true,
            user_id: userId,
            email: email,
            roll_number: rollNumber,
            numbers,
            alphabets,
            highest_lowercase_alphabet: highestLowercase,
            is_prime_found: isPrimeFound,
            ...fileDetails
        });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ is_success: false, message: "Internal Server Error" });
    }
});

// GET Endpoint
app.get('/bfhl', (req, res) => {    
    res.status(200).json({ operation_code: 1 });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
