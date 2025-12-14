// Upload File
export const uploadFile = async (fileData: FormData) => {
  try {
    // For file uploads, we need to override the default Content-Type header
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1"
      }/files`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        },
        body: fileData,
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem("accessToken");
        window.location.href = "/auth/login";
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  } catch (error: any) {
    throw new Error(error.message || "Failed to upload file");
  }
};
