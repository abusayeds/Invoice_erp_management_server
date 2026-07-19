/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Request } from "express";
import createHttpError from "http-errors";
import multer, { FileFilterCallback } from "multer";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import { max_file_size, UPLOAD_FOLDER } from "../config";
const UPLOAD_PATH = UPLOAD_FOLDER || "public/files";
const MAX_FILE_SIZE = Number(max_file_size) || 5 * 1024 * 1024;

// Public URL prefix for uploaded files. `express.static("public")` serves the `public`
// folder at the site root, so e.g. `public/files` is reachable at `/files`.
export const UPLOAD_URL_PREFIX =
  "/" + UPLOAD_PATH.replace(/\\/g, "/").replace(/^public\/?/, "").replace(/\/$/, "");

const ALLOWED_FILE_TYPES = [
  ".jpg",
  ".jpeg",
  ".png",
  ".xlsx",
  ".xls",
  ".csv",
  ".pdf",
  ".doc",
  ".docx",
  ".mp3",
  ".wav",
  ".ogg",
  ".mp4",
  ".avi",
  ".mov",
  ".mkv",
  ".webm",
  ".svg",
];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create the upload folder (e.g. public/files) on the fly if it doesn't exist yet.
    fs.mkdirSync(UPLOAD_PATH, { recursive: true });
    cb(null, UPLOAD_PATH);
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) {

    const fileName = uuidv4() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const extName = path.extname(file.originalname).toLocaleLowerCase();
  const isAllowedFileType = ALLOWED_FILE_TYPES.includes(extName);
  if (!isAllowedFileType) {
    return cb(createHttpError(400, "File type not allowed"));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

export default upload;
