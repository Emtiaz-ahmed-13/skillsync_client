export async function getPublicProjectCount(): Promise<number> {
  try {
    const response = await fetch(
      "http://localhost:5001/api/v1/projects/approved"
    );

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data && Array.isArray(data.data.projects)) {
        return data.data.projects.length;
      }
    }
    return 1250;
  } catch (error) {
    console.warn("Error fetching project count:", error);
    return 1250;
  }
}
