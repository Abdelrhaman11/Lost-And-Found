import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

export async function callCosineSimilarityEndpoint(vector1, vector2) {
  // Make HTTP request to your endpoint
  const response = await axios.post(
    "http://localhost:8000/calculate_similarity",
    { vector1, vector2 }
  );

  // Extract similarity score and result from response
  const { similarity_score, result } = response.data;

<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
    return { similarity_score, result };
}

export async function compare_faces(v1 , v2){
    
    const response=await axios.post("http://127.0.0.1:8000/compare_faces/" , {v1 , v2})
    // console.log(response);
    return {ress:"hiiiiiiiiii"};

}      
=======
>>>>>>> 7ead1c4808c3e6caed363896f4a24c7cc119e316
>>>>>>> 243ebd43d2b427ce4bc6231aa05c0875bd944a56
  return { similarity_score, result };
}



// Helper function to download image from a URL and save it locally
async function downloadImage(url, filepath) {
    const response = await axios({
        url,
        responseType: 'stream',
    });
    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(filepath);
        response.data.pipe(writer);
        let error = null;
        writer.on('error', err => {
            error = err;
            writer.close();
            reject(err);
        });
        writer.on('close', () => {
            if (!error) {
                resolve(filepath);
            }
        });
    });
}

export async function compare_faces(v1, v2) {
    const tempDir = './temp_images'; // Directory to store temporary images
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const personImagePath = path.join(tempDir, 'person_image.jpg');
    const verificationImagePath = path.join(tempDir, 'verification_image.jpg');

    try {
        // Download images
        await downloadImage(v1, personImagePath);
        await downloadImage(v2, verificationImagePath);

        // Prepare form data
        const formData = new FormData();
        formData.append('person_image', fs.createReadStream(personImagePath));
        formData.append('verification_image', fs.createReadStream(verificationImagePath));

        // Send POST request
        const response = await axios.post("http://127.0.0.1:8000/compare_faces/", formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        return response.data.result;
    } catch (error) {
        console.error(error);
        return { error: "Comparison failed" };
    } finally {
        // Clean up temporary files
        if (fs.existsSync(personImagePath)) {
            fs.unlinkSync(personImagePath);
        }
        if (fs.existsSync(verificationImagePath)) {
            fs.unlinkSync(verificationImagePath);
        }
    }
}
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
>>>>>>> b98f4b0be9dd7d98e5adb821b0a07b2ac7e4e7ab
>>>>>>> 7ead1c4808c3e6caed363896f4a24c7cc119e316
>>>>>>> 243ebd43d2b427ce4bc6231aa05c0875bd944a56
