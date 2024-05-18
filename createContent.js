const { GoogleGenerativeAI } = require("@google/generative-ai");
const env = require('dotenv').config();
const fs = require("node:fs");
const axios = require("axios");
const FormData = require("form-data");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const keywords = ["health consultancy", "healthcare"]

/* START: FUNCTION TO GENERATE TEXT CONTENT OF BLOG */
async function generateTextContent() {
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
    const prompt = `Write a blog about ${keywords.join(',')} to improve SEO.`

    console.log(prompt)
  
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log(text);
  }
/* END: FUNCTION TO GENERATE TEXT CONTENT OF BLOG */
  
generateTextContent(); 

/* START: FUNCTION TO GENERATE IMAGE CONTENT OF BLOG */
async function generateImageContent() {
    const formData = {
      prompt: `${keywords.join(' and ')}`,
      output_format: "jpeg"
    };

    const response = await axios.postForm(
      `https://api.stability.ai/v2beta/stable-image/generate/sd3`,
      axios.toFormData(formData, new FormData()),
      {
        validateStatus: undefined,
        responseType: "arraybuffer",
        headers: { 
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`, 
          Accept: "image/*" 
        },
      },
    );

    if(response.status === 200) {
      fs.writeFileSync(`./assets/img/${keywords.join('and')}.jpeg`, Buffer.from(response.data));
    } else {
      throw new Error(`${response.status}: ${response.data.toString()}`);
    }
}

/* END: FUNCTION TO GENERATE IMAGE CONTENT OF BLOG */

generateImageContent()
