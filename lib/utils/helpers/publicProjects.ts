export async function getPublicProjectCount(): Promise<number> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/approved`
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
