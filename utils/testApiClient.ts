import apiClient from "./apiClient";

// Test the API client
export const testApiClient = async () => {
  try {
    console.log("Testing API client...");

    // Test GET request
    const getResponse = await apiClient.get("/test");
    console.log("GET response:", getResponse);

    // Test POST request
    const postResponse = await apiClient.post("/test", { test: "data" });
    console.log("POST response:", postResponse);

    // Test PUT request
    const putResponse = await apiClient.put("/test/1", { test: "updated" });
    console.log("PUT response:", putResponse);

    // Test DELETE request
    const deleteResponse = await apiClient.delete("/test/1");
    console.log("DELETE response:", deleteResponse);

    console.log("API client tests completed successfully!");
  } catch (error) {
    console.error("API client test failed:", error);
  }
};
