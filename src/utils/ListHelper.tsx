import React from "react";
import QRCode from "react-qr-code";
import * as pako from "pako";

const formatDate = (dateString: string) => {
    const date = new Date(parseInt(dateString, 10));
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

const linkBuilder = (text: string) => {
    // Compress the text using gzip
    const compressed = pako.gzip(text);
    // Convert to base64 for URL safety
    const compressionString = btoa(String.fromCharCode(...compressed));
    // const baseURL = "http://armyassist.xyz/";
    // const baseURL = "http://192.168.86.20:5173/";
    // const baseURL = "https://list-management.40k-army-assist.pages.dev/";
    const baseURL = "http://localhost:5173/";
    const fullURL = `${baseURL}${compressionString}`;
    return fullURL;
};

const decompressFromURL = (compressedString: string) => {
    try {
        // Convert base64 back to binary
        const binaryString = atob(compressedString);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        // Decompress using pako
        const decompressed = pako.ungzip(bytes, { to: "string" });
        return decompressed;
    } catch (error) {
        console.error("Failed to decompress data:", error);
        return null;
    }
};

const qrCode = (text: string) => {
    const shareString = linkBuilder(text);
    if (shareString.length > 2953) {
        return (
            <span className="text-black text-center flex-1">
                This list is too long to share as a QR code! Is this a real
                list? If so, please let the dev know!
            </span>
        );
    } else {
        return <QRCode value={shareString} className="w-full h-full" />;
    }
};

export { formatDate, linkBuilder, qrCode, decompressFromURL };
