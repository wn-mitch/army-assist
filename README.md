# Import Regex's

<[:\.\-\w\d\s;#\\+()\.,\[\]_="/]+>([:\.\-\w\d\s;#\\+()\.,\[\]_='"]+)</[\w]+>

 Clean up the files after importing from Wahapedia

<[:\.\-\w\d\s;#\\+()\.,\[\]_="/]+>

 Remove Tags


 ## State Storage
 If you want to convert a JSON state into a short text string that can be easily imported/exported as a save state, you can encode it using Base64 or another encoding method like LZString for better compression.
Example: Encoding and Decoding a JSON Save State

// Import LZString for better compression (npm install lz-string if needed)
import LZString from 'lz-string';

// Function to encode JSON state to a short string
function encodeState(state) {
    const jsonString = JSON.stringify(state);
    return LZString.compressToBase64(jsonString); // Compressed Base64 string
}

// Function to decode a short string back to JSON state
function decodeState(encodedString) {
    const jsonString = LZString.decompressFromBase64(encodedString);
    return JSON.parse(jsonString);
}

// Example usage:
const gameState = { level: 5, score: 1200, items: ["sword", "shield"] };

const shortCode = encodeState(gameState);
console.log("Encoded:", shortCode);

const restoredState = decodeState(shortCode);
console.log("Decoded:", restoredState);

Why Use Compression?

    Base64 alone is safe but can make the string longer.
    LZString helps reduce the string size while keeping it readable.

Would you like an even more optimized approach, such as using URL-safe encoding?
