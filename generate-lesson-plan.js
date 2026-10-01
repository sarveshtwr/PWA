const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    periods: { type: "string" },
    concepts: { type: "string" },
    learningOutcomes: { type: "string" },
    pedagogicalStrategies: { type: "string" },
    developerConcept1: { type: "string" },
    developerConcept2: { type: "string" },
    developerConcept3: { type: "string" },
    integration: { type: "string" },
    assessment: { type: "string" },
    resources: { type: "string" },
    realLifeApplications: { type: "string" },
    skills: { type: "string" },
    remedialPeriods: { type: "string" },
    remedialConcepts: { type: "string" }
  },
  required: [
    "periods","concepts","learningOutcomes","pedagogicalStrategies",
    "developerConcept1","developerConcept2","developerConcept3",
    "integration","assessment","resources","realLifeApplications",
    "skills","remedialPeriods","remedialConcepts"
  ]
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const className = String(body?.className || "").trim();
    const subject = String(body?.subject || "").trim();
    const chapter = String(body?.chapter || "").trim();

    if (!className || !subject || !chapter) {
      return json({ error: "Class, Subject and Chapter Name are required." }, 400);
    }

    const apiKey = context.env.OPENAI_API_KEY;
    if (!apiKey) {
      return json({ error: "OPENAI_API_KEY is not configured on the server." }, 500);
    }

    const prompt = `Create a school lesson plan for:
Class: ${className}
Subject: ${subject}
Chapter / Topic: ${chapter}

The teacher is a school PGT Computer Science teacher in India. Generate practical, classroom-ready content suitable for the specified class and subject. Keep the language professional and suitable for a formal school lesson-plan record.

Return content for these exact fields:
1. periods: reasonable number of periods required, as a number or short text
2. concepts: key concepts/content to be taught
3. learningOutcomes: NCERT-aligned learning outcomes, written as clear points
4. pedagogicalStrategies: teaching-learning strategies and classroom activities
5. developerConcept1: lesson plan developer concept 1
6. developerConcept2: lesson plan developer concept 2
7. developerConcept3: lesson plan developer concept 3
8. integration: integration with other school subjects
9. assessment: assessment methods/item formats
10. resources: digital and physical resources
11. realLifeApplications: real-life applications
12. skills: 21st Century Skills / Value Education / Vocational Skills
13. remedialPeriods: reasonable remedial periods, if needed
14. remedialConcepts: concepts that may need remedial teaching

Use concise points separated by new lines. Do not include markdown headings, commentary, or explanations outside the requested fields.`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-5.6-luna",
        input: prompt,
        text: {
          format: {
            type: "json_schema",
            name: "lesson_plan",
            strict: true,
            schema: SCHEMA
          }
        }
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return json({
        error: result?.error?.message || "OpenAI API request failed."
      }, response.status);
    }

    let output = result?.output_text;
    if (!output && Array.isArray(result?.output)) {
      output = result.output
        .flatMap(item => item?.content || [])
        .map(item => item?.text || "")
        .join("");
    }

    if (!output) {
      return json({ error: "The AI returned no lesson-plan content." }, 502);
    }

    let lessonPlan;
    try {
      lessonPlan = JSON.parse(output);
    } catch {
      return json({ error: "The AI response could not be parsed as lesson-plan JSON." }, 502);
    }

    return json({ lessonPlan });
  } catch (error) {
    return json({ error: error?.message || "Unexpected server error." }, 500);
  }
}
