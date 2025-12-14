import { NextRequest } from "next/server";

// Helper function to initialize ImageKit only on server side
const getImageKit = () => {
  if (typeof window === "undefined") {
    // Dynamically import ImageKit only on server side
    const ImageKit = require("imagekit");
    // Check if it's the default export or named export
    const ImageKitConstructor = ImageKit.default || ImageKit;

    return new ImageKitConstructor({
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
    });
  }
  return null;
};

export async function POST(request: NextRequest) {
  try {
    // Check if ImageKit is properly configured
    if (
      !process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
      !process.env.IMAGEKIT_PRIVATE_KEY ||
      !process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
    ) {
      return new Response(
        JSON.stringify({
          error: "ImageKit not configured",
          message: "Missing ImageKit environment variables",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const imagekit = getImageKit();
    if (!imagekit) {
      return new Response(
        JSON.stringify({
          error: "ImageKit initialization failed",
          message: "Could not initialize ImageKit on server",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const projectId = formData.get("projectId") as string | null;
    const fileName = formData.get("fileName") as string | null;
    const folder = formData.get("folder") as string | null;

    if (!file || !projectId || !fileName || !folder) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          message: "File, projectId, fileName, and folder are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Convert File to Buffer for ImageKit
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to ImageKit
    const response = await imagekit.upload({
      file: buffer,
      fileName: fileName,
      folder: folder,
    });

    return new Response(
      JSON.stringify({
        success: true,
        fileId: response.fileId,
        url: response.url,
        thumbnailUrl: response.thumbnailUrl,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Upload error:", error);
    return new Response(
      JSON.stringify({
        error: "Upload failed",
        message: error.message || "An error occurred during upload",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Disable bodyParser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};
