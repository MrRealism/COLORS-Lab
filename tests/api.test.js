const API_BASE_URL = process.env.API_BASE_URL || "http://127.0.0.1:8080/api";

describe("SearchColors.php integration test", () => {
  test("returns JSON with expected response shape", async () => {
    const response = await fetch(`${API_BASE_URL}/SearchColors.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        search: "",
        userId: 1
      })
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toMatch(/application\/json/i);

    const data = await response.json();
    expect(typeof data).toBe("object");
    expect(data).not.toBeNull();
    expect(typeof data.error).toBe("string");

    if (Array.isArray(data.results)) {
      data.results.forEach((item) => {
        expect(typeof item).toBe("string");
      });
    } else {
      expect(data).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          firstName: expect.any(String),
          lastName: expect.any(String),
          error: expect.any(String)
        })
      );
    }
  });
});
