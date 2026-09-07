import busboy from "busboy";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));


const UPLOAD_DIR = path.join(__dirname, "../../public/uploads");


if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_FILE_SIZE = 5 * 1024 * 1024; 


export function parseUpload(req, res, next) {
  const contentType = req.headers["content-type"] ?? "";

  
  if (!contentType.includes("multipart/form-data")) {
    return next();
  }

  const bb = busboy({ headers: req.headers, limits: { fileSize: MAX_FILE_SIZE } });

  const fields = {};
  let fileError = null;
  let savedFilename = null;
  let writeStream = null;

  bb.on("field", (name, value) => {
    fields[name] = value;
  });

  bb.on("file", (fieldname, fileStream, info) => {
    const { mimeType } = info;


    if (fieldname !== "image") {
      fileStream.resume(); 
      return;
    }

    if (!ALLOWED_MIME.has(mimeType)) {
      fileStream.resume();
      fileError = new Error("Only JPEG, PNG, WEBP, or GIF images are allowed");
      fileError.statusCode = 400;
      return;
    }

    const ext = mimeType.split("/")[1].replace("jpeg", "jpg");
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, filename);

    writeStream = fs.createWriteStream(filePath);
    savedFilename = filename;

    let bytesWritten = 0;
    let truncated = false;

    fileStream.on("data", (chunk) => {
      bytesWritten += chunk.length;
      if (bytesWritten > MAX_FILE_SIZE) {
        truncated = true;
        fileStream.destroy();
        writeStream.destroy();
        fs.unlink(filePath, () => {});
        fileError = new Error("Image file exceeds 5 MB limit");
        fileError.statusCode = 400;
      }
    });

    fileStream.on("limit", () => {
      truncated = true;
      writeStream.destroy();
      fs.unlink(filePath, () => {});
      fileError = new Error("Image file exceeds 5 MB limit");
      fileError.statusCode = 400;
    });

    fileStream.pipe(writeStream);
  });

  bb.on("finish", () => {
    if (fileError) return next(fileError);

    
    req.body = { ...req.body, ...fields };

    if (savedFilename) {
      req.uploadedImageUrl = `/uploads/${savedFilename}`;
    }

    next();
  });

  bb.on("error", (err) => {
    err.statusCode = 400;
    next(err);
  });

  req.pipe(bb);
}
