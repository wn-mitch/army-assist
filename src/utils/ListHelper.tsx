import React  from "react";
import QRCode from "react-qr-code";
import LZstring from "lz-string";

const formatDate = (dateString: string) => {
  const date = new Date(parseInt(dateString, 10));
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

const linkBuilder = (text: string) => {
  const compressionString = LZstring.compressToEncodedURIComponent(text);
  const baseURL = "http://armyassist.xyz/"
  // const baseURL = "http://192.168.86.20:5173/";
  // const baseURL = "https://list-management.40k-army-assist.pages.dev/";
  // const baseURL = "http://localhost:5173/";
  return `${baseURL}${compressionString}`;
}

const qrCode = (text: string) => {
  const shareString = linkBuilder(text)
  if (shareString.length > 2953) {
    return (
      <span className="text-black text-center flex-1">
        This list is too long to share as a QR code! Is this a real list? If so,
        please let the dev know!
      </span>
    );
  } else {
    return <QRCode value={shareString} className="w-full h-full" />;
  }
};

export { formatDate, linkBuilder, qrCode };
