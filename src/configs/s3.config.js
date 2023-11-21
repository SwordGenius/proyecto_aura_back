const dotenv = require("dotenv");
dotenv.config();
const {S3Client} = require('@aws-sdk/client-s3');
const {fromEnv} = require('@aws-sdk/credential-provider-env');

const s3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: fromEnv()
});

module.exports = {s3};