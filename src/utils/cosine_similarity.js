import axios from "axios";

export async function callCosineSimilarityEndpoint(vector1, vector2) {
    // Make HTTP request to your endpoint
    const response = await axios.post('http://localhost:8000/calculate_similarity', { vector1, vector2 });

    // Extract similarity score and result from response
    const { similarity_score, result } = response.data;

    return { similarity_score, result };
}

export async function compare_faces(v1 , v2){
    
    const response=await axios.post("http://127.0.0.1:8000/compare_faces/" , {v1 , v2})
    // console.log(response);
    return {ress:"hiiiiiiiiii"};

}      
