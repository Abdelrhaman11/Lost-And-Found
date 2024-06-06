import axios from "axios";
import FormData from "form-data";
import fs from "fs";
export const predictfeature = async (files) => {
  const form = new FormData();
  files.forEach(async (file) => {
    form.append("files", fs.createReadStream(file.path), file.originalname);
  });
  const response = await axios.post("http://localhost:8000/predict", form, {
    headers: form.getHeaders(),
  });

  return response.data;
};
