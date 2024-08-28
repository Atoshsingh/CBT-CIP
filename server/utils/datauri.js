import DataUriParsr from "datauri/parser.js"
import { get } from "http";
import path from "path"

const paresr = new DataUriParsr();

const getDataUri = (file) =>{
    const extName  = path.extname(file.originalname).toString();
    return paresr.format(extName,file.buffer).content; 
}

export default getDataUri;