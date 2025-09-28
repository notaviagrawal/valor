import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { image, selectedProduct } = await request.json();

    if (!image || !selectedProduct) {
      return NextResponse.json(
        { error: 'Image and selected product are required' },
        { status: 400 }
      );
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Convert base64 image to format expected by Gemini
    const imageData = image.split(',')[1]; // Remove data:image/jpeg;base64, prefix

    // Create the prompt
    const prompt = `Analyze the attached image. The user has pre-selected '${selectedProduct}'.

1. Verify if the primary product in the image is indeed ${selectedProduct}.
2. Extract the price from any visible price tag or label.
3. Return the result as a JSON object with two keys: 'product_name' (string) and 'price' (number).

If you cannot clearly identify the product or price, return null for the unclear values.`;

    // Prepare the image part
    const imagePart = {
      inlineData: {
        data: imageData,
        mimeType: 'image/jpeg'
      }
    };

    // Generate content
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    let extractedData;
    try {
      // Clean the response text to extract JSON
      const jsonMatch = text.match(/\{.*\}/s);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.error('Raw response:', text);
      
      // Fallback: return the selected product with a default price
      extractedData = {
        product_name: selectedProduct,
        price: 0.00
      };
    }

    // Validate the extracted data
    if (!extractedData.product_name || typeof extractedData.price !== 'number') {
      extractedData = {
        product_name: selectedProduct,
        price: 0.00
      };
    }

    return NextResponse.json(extractedData);

  } catch (error) {
    console.error('Error processing image with Gemini:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}
