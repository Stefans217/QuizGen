import OpenAI from "openai";

async function main() {
    const openai = new OpenAI();
    const completion = await openai.chat.completions.create({
        model: "gpt-o3-mini",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
                role: "user",
                content: "Write a haiku about recursion in programming.",
            },
        ],
        store: true,
    });

    console.log(completion.choices[0].message);
}

main();