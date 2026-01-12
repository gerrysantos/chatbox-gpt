require("dotenv").config();
const axios = require("axios");

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

async function testAI() {
  try {
    const res = await axios.post(
      "https://router.huggingface.co/models/gpt2",
      { inputs: "Hello AI", options: { wait_for_model: true } },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

testAI();
