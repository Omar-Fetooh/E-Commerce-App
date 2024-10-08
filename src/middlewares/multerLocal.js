import multer from "multer";
import path from "path"
import fs from "fs"

import { nanoid } from "nanoid";
import { AppError } from "../utils/error.js";

export const validExtension = {
    image: ["image/png", "image/jpg", "image/jpeg"],
    pdf: ["application/pdf"],
    video: ["video/mp4", "video/mkv", "video/MOV"]
}

export const multerLocal = (customValidation = ["image/png", "image/jpg", "image/jpeg"], customPath = "Generals") => {

    const allPath = path.resolve(`uploads/${customPath}`)
    if (!fs.existsSync(allPath)) {
        fs.mkdirSync(allPath, { recursive: true })
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, allPath)
        },
        filename: function (req, file, cb) {
            cb(null, nanoid(5) + file.originalname)
        }
    })

    const fileFilter = function (req, file, cb) {
        if (customValidation.includes(file.mimetype)) {
            return cb(null, true)
        }
        cb(new AppError("file not supported", false))
    }

    const upload = multer({ storage, fileFilter })
    return upload;
}

export const multerHost = (customValidation = ["image/png", "image/jpeg"]) => {

    const storage = multer.diskStorage({})

    const fileFilter = function (req, file, cb) {
        if (customValidation.includes(file.mimetype)) {
            return cb(null, true)
        }
        cb(new AppError("file not supported", false))
    }

    const upload = multer({ storage, fileFilter })
    return upload;
}
