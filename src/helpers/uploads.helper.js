const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const {PutObjectCommand, GetObjectCommand} = require('@aws-sdk/client-s3');
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner');
const {s3} = require("../configs/s3.config");

const uploadFile = async (file) => {
    const stream = fs.createReadStream(file.tempFilePath);
    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: stream,
        Key: file.name
    }
    const command = new PutObjectCommand(uploadParams);
    const result = await s3.send(command);
    if (result.$metadata.httpStatusCode !== 200) {
        throw new Error("No se pudo subir el archivo");
    }
    fs.unlink(file.tempFilePath, (err) => {
        if (err) {
            throw new Error("No se pudo eliminar el archivo temporal");
        }
    });

    return result;
}

const getURL = async (file) => {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.name
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 * 24 * 7 });
    if (!url) {
        throw new Error("No se pudo obtener el URL");
    }
    return url;
}
module.exports = {uploadFile, getURL}