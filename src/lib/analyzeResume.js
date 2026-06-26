// Converts a File object to a base64 string (Gemini needs this for PDFs)
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Remove the "data:application/pdf;base64," prefix, keep only the base64 part
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function analyzeResume({ file, jobTitle, jobDescription, companyName }) {
  try {
    const base64Data = await fileToBase64(file);

    const prompt = `
      You are an expert ATS (Applicant Tracking System) and career coach.
      
      Analyze this resume for the following job:
      - Company: ${companyName}
      - Job Title: ${jobTitle}
      - Job Description: ${jobDescription}
      
      Give your response as a JSON object with this exact structure:
      {
        "atsScore": <number from 0 to 100>,
        "summary": "<2-3 sentence overall summary>",
        "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
        "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
        "keywords": {
          "matched": ["<keyword 1>", "<keyword 2>"],
          "missing": ["<keyword 1>", "<keyword 2>"]
        }
      }
      
      Return ONLY the JSON object. No extra text, no markdown, no backticks.
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  // Send the PDF directly to Gemini as base64
                  inline_data: {
                    mime_type: "application/pdf",
                    data: base64Data,
                  },
                },
                { text: prompt },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // Extract the text from Gemini's response
    const text = data.candidates[0].content.parts[0].text;

    // Parse the JSON that Gemini returned
    const feedback = JSON.parse(text.replace(/```json|```/g, "").trim());
    return { feedback, error: null };
  } catch (err) {
    return { feedback: null, error: `Analysis failed: ${err.message}` };
  }
}