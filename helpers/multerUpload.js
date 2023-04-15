import multer from "multer";
import { file } from "../constants/constants.js";

export const upload = multer({
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "text/plain") {
      return cb(new Error("Invalid file format. Only text files are allowed"));
    }
    cb(null, true);
  },
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 },
}).single(file.queryName);
