import Busboy from 'busboy';
import onFinished from 'on-finished';
import appendField from 'append-field';
import { Request, Response, NextFunction } from 'express';
import config from 'config';
import concat from 'concat-stream';
import { S3 } from 'aws-sdk';
import { ObjectSchema } from '@hapi/joi';
import Utility from '../Utils/Utility';

const { secret, key, bucket, region, maxUploadFileSize } = config.get('s3');

const allowedFileExt = ['image/png', 'image/bmp', 'image/jpeg', 'image/gif', 'image/tiff'];

/**
 * @class UploadMiddleware
 * @developer Oyewole Abayomi Samuel
 */
class UploadMiddleware {
  options: UploadConfig;
  request: Request;
  response: Response;
  nextFnc: NextFunction;
  busboy: Busboy; // NodeJS.WritableStream
  isFieldsValid: boolean;
  s3: S3;

  constructor(options: UploadConfig, req: Request, res: Response, next: NextFunction) {
    this.request = req;
    this.response = res;
    this.nextFnc = next;
    this.options = options;
    this.isFieldsValid = false;

    this.request.body = Object.create(null);

    this.s3 = new S3({
      accessKeyId: key,
      secretAccessKey: secret,
      region,
    });

    if (this.request.method === 'POST') {
      // 10MB size limit, I abort upload if file is over 6MB limit
      this.busboy = new Busboy({
        headers: this.request.headers,
        limits: {
          fileSize: maxUploadFileSize,
          files: +this.options.maxFiles,
        },
      });

      this.busboy.on('field', (fieldname, val, _fieldnameTruncated, _valTruncated) => {
        appendField(this.request.body, fieldname, val);
      });

      this.busboy.on('file', async (_fieldname, fileStream, filename, _encoding, mimetype) => {
        try {
          if (!filename) return fileStream.resume();

          if (!this.isFieldsValid) this.validateInputFields();

          // validate minetype
          if (allowedFileExt.indexOf(mimetype) <= -1) {
            this.done(new Error('Invalid file type, check API doc for approved extensions'), false);
          }

          fileStream.on('limit', () => {
            this.done(
              new Error('File exceeds the maximum file-size, check doc for size limit'),
              false
            );
          });

          const fileExt = filename.split('.').pop();
          const fileName = [Utility.generateID(), fileExt].join('.');

          const getFileBuffer = () =>
            new Promise((resolve, reject) => {
              fileStream.pipe(
                concat({ encoding: 'buffer' }, (buffer) => {
                  this.streamFileToS3(buffer, fileName, (err, data) =>
                    err ? reject(new Error(err)) : resolve(data)
                  );
                })
              );
            });

          const response = await getFileBuffer();
          console.log(response);

          //   Object.assign(this.request, { file: response });

          //   return this.nextFnc();
        } catch (error) {
          this.done(error, false);
        }
      });

      this.busboy.on('filesLimit', () => {
        this.done(new Error(`Maximum ${this.options.maxFiles} files allowed!`), false);
      });

      this.busboy.on('finish', () => console.log('finish'));

      return this.request.pipe(this.busboy);
    }
  }

  validateInputFields() {
    const { validator } = this.options;

    const { error } = validator.validate(this.request.body);
    if (error) return this.done(new Error(error.message), false);

    this.isFieldsValid = true;
  }

  drainStream(stream) {
    stream.on('readable', stream.read.bind(stream));
  }

  done(err, isDone: boolean) {
    if (isDone) return;
    isDone = true;

    this.request.unpipe(this.busboy);
    this.drainStream(this.request);
    this.busboy.removeAllListeners();

    onFinished(this.request, () => this.nextFnc(err));
  }

  streamFileToS3(buffer: Buffer, filename: string, callback) {
    this.s3.upload({ Bucket: bucket, Key: filename, Body: buffer }, (err, data) => {
      if (err) return callback(err.message);
      callback(null, data);
    });
  }
}

interface UploadConfig {
  validator: ObjectSchema<any>;
  maxFiles: number;
}

export default (options: UploadConfig) => (req: Request, res: Response, next: NextFunction) => {
  return new UploadMiddleware(options, req, res, next);
};
