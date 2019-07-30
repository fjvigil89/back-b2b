import * as AWS from "aws-sdk";
import * as sharp from "sharp";
import { getCustomRepository } from "typeorm";
import { AWS_CREDENTIALS } from "../config/config";
import { Image } from "../entity";
import { ImageRepository } from "../repository";

interface IMulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
}

export class ImageService {

    private URL_BASE: string;
    private image: Image;
    private S3: AWS.S3;

    constructor() {
        this.URL_BASE = `https://s3-sa-east-1.amazonaws.com/cadem-files/IMAGES_B2B_APP/${process.env.CLIENT}/`;
        this.image = new Image();
        AWS.config.accessKeyId = AWS_CREDENTIALS.accessKeyId;
        AWS.config.secretAccessKey = AWS_CREDENTIALS.secretAccessKey;
        this.S3 = new AWS.S3();
    }

    public saveOneImage(file: IMulterFile, customPath?: string): Promise<string> {
        if (customPath) {
            file.filename = `${customPath}${file.filename}`;
        }
        return this.uploadToS3(file);
    }

    public async saveImages(files: IMulterFile[], postId): Promise<void> {
        await getCustomRepository(ImageRepository).clearImagesByPost(postId);
        for (const file of files) {
            const url = await this.uploadToS3(file);
            this.image.path = url;
            this.image.postId = postId;
            this.image.save();
        }
    }

    public base64UploadToS3(base64: string, filename): Promise<string> {
      const imgBuffer = Buffer.from(base64, "base64");
      return sharp(imgBuffer).resize(1000).toBuffer().then((buff) => {
          return this.S3.putObject({
              ACL: "public-read",
              Body: buff,
              Bucket: "cadem-files",
              Key: `IMAGES_B2B_APP/${process.env.CLIENT}/${filename}`,
          }).promise().then(() => {
              return `${this.URL_BASE}${filename}`;
          });
      });
  }

    private uploadToS3(file: IMulterFile): Promise<string> {
        return sharp(file.path).resize(1000).toBuffer().then((buff) => {
            const path = `${file.filename}.${file.originalname.split(".").pop()}`;
            const localImage = buff;
            return this.S3.putObject({
                ACL: "public-read",
                Body: localImage,
                Bucket: "cadem-files",
                Key: `IMAGES_B2B_APP/${process.env.CLIENT}/${path}`,
            }).promise().then(() => {
                return `${this.URL_BASE}${path}`;
            });
        });
    }

}
