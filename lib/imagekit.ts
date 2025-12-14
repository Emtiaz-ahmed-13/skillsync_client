// Only initialize ImageKit on the server side
const getImageKit = () => {
  if (typeof window === "undefined") {
    // Server-side only
    const ImageKit = require("imagekit").default;
    
    return new ImageKit({
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
    });
  }
  
  // Return null on client-side
  return null;
};

export default getImageKit;