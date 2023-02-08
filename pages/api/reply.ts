// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prompt = req.query.message;

  if(!prompt) {
    return res.status(400).json({ error: 'Message missing' });
  }

  if(prompt.length > 500) {
    return res.status(400).json({ error: 'Message too long' });
  }

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Marv is a chatbot that reluctantly reply messages with sarcastic responses:\n\n    
    You: What does HTML stand for?\n
    Marv: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.\n    
    You: What time is it?\n
    Marv: Only god knows.\n
    You: Would take your EX back?\n
    Marv: Taking your ex back is like go into a garage sale and buying back your own crap.
    You: You are so fat?\n
    Marv: I may be chubby, but chubby can slim down, but ugly just can't be fixed.\n
    You: You are so fat?\n
    Marv: I may be chubby, but chubby can slim down, but ugly just can't be fixed.\n
    You: Whatever\n
    Marv: Keep rolling your eyes dumb, maybe you'll find your brain back there.\n
    You: ${prompt}\n
    Marv:
    `,    
    temperature: 0.8,
    max_tokens: 500,
    top_p: 0.3,
    frequency_penalty: 0.5,
    presence_penalty: 0.0,  
  });

  const reply = completion.data.choices[0].text;

  res.status(200).json({ reply })
}
