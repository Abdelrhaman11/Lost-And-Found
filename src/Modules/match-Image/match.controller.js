import { imageModel } from "../../../DB/models/image.mode.js";
import { postModel } from "../../../DB/models/post.model.js";
import { compare_faces } from "../../utils/cosine_similarity.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const matchImage=asyncHandler(async(req,res,next)=>{


    const lastImages= await imageModel.find({createdBy:req.user._id})

    const last=lastImages.length-1;    
    const result = lastImages[last].images.map((image)=>{
        return {url:image.url}
    })
        // console.log(...result);
        // const jsonString1 = JSON.stringify(result);
        // const binaryData1 = Buffer.from(jsonString1);


    const images= await imageModel.find();

   let urls =images.map((image) => {
         return(image.images.map((img) => {
            return({url: img.url});
        }))
    });





   for(let i=0 ; i<=urls.length ; i++)
    {
// const jsonString = JSON.stringify(urls[0]);
// const binaryData = Buffer.from(jsonString);
        // const resultMatch=compare_faces(binaryData , binaryData1)
        const resultMatch=compare_faces(urls[i] , result)
        console.log(resultMatch);
        if(resultMatch.includes("same"))
            {

                return res.json({message:"match"})

            }
        

    }

// let x;
// const imageUrl1='https://res.cloudinary.com/dtykqby6b/image/upload/v1718117907/LostAndFound/posts/IoMaFW7Lr38Xo0o8gmQL1/e0qf1wrpg0ffm2p3w1zb.jpg'
// const imageUrl2='https://res.cloudinary.com/dtykqby6b/image/upload/v1718117910/LostAndFound/posts/IoMaFW7Lr38Xo0o8gmQL1/s488zltnz38xjbcjwkki.jpg'
// compare_faces(imageUrl1, imageUrl2).then(result => {
//     console.log(result);
//     x=result
// });

    return res.json({message:"Not-Match" , x  })


})