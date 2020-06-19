import config from 'config';
import { S3 } from 'aws-sdk';
import multer, { memoryStorage } from 'multer';
import Utility from './Utility';

const { maxUploadFileSize } = config.get('general');
const { secret, key, bucket, region } = config.get('s3');
const allowedFileExt = ['image/png', 'image/bmp', 'image/jpeg', 'image/gif', 'image/tiff'];

const s3 = new S3({
  accessKeyId: key,
  secretAccessKey: secret,
  region,
});

export const uploadFile = multer({
  storage: memoryStorage(),
  fileFilter: async (_req, file, callback) => {
    const type = file.mimetype;
    if (!type) return callback(new Error('File upload type is undefined!'));

    if (allowedFileExt.indexOf(type) <= -1) {
      return callback(new Error('File type not allowed, please upload image!'));
    }
    callback(null, true);
  },
  limits: {
    fileSize: maxUploadFileSize,
  },
});

export const streamFileToS3 = (buffer: Buffer, filename: string) => {
  return new Promise((resolve, reject) => {
    const fileExt = filename.split('.').pop();
    const name = [Utility.generateID(), fileExt].join('.');

    s3.upload({ Bucket: bucket, Key: name, Body: buffer }, (err, data) => {
      if (err) return reject(new Error(err.message));
      resolve(data);
    });
  });
};
