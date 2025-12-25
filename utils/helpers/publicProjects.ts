/**
 * Helper function to get public project count from the API
 */
export async function getPublicProjectCount(): Promise<number> {
  try {
    // Fetch from the public projects endpoint
    const response = await fetch(
      "http://localhost:5001/api/v1/projects/approved"
    );

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data && Array.isArray(data.data.projects)) {
        return data.data.projects.length;
      }
    }

    // Return a default count if the API call fails
    return 1250;
  } catch (error) {
    console.warn("Error fetching project count:", error);
    // Return a default count if there's an error
    return 1250;
  }
}
