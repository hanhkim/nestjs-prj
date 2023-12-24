import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Request, Response } from 'express';
import { join } from 'path';
import { FileService } from './file.service';
import { AssetEntity } from './file.entity';
import * as fs from 'fs';

@Controller('assets')
export class FileController {
  constructor(
    private cloudinary: CloudinaryService,
    private fileService: FileService,
  ) {}
  @Post('upload-local')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, './public/assets'); // specify the destination folder
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now();
          cb(
            null,
            file.fieldname + '-' + uniqueSuffix + '-' + file.originalname,
          );
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.fileService.save(file as unknown as AssetEntity);

    return {
      statusCode: 200,
      data: result,
    };
  }

  @Get('file')
  getFile(@Req() request: Request, @Res() res: Response) {
    const { filename = '' } = request.query;
    console.log('filename :>> ', filename, __dirname);
    const fileLocation = join(
      __dirname,
      '../..',
      'public/assets',
      filename as string,
    );

    // Set appropriate headers for the response
    res.header('Content-Type', 'image/jpeg'); // Adjust content type based on your file type
    res.header('Content-Disposition', `inline; filename=${filename}`);

    // Send the file to the frontend
    return res.sendFile(fileLocation);
  }

  @Get(':id')
  async getFileUrl(@Param('id') id: string, @Res() res: Response) {
    const result = await this.fileService.findOne(id);

    if (!result) {
      throw new NotFoundException('File not found');
    }

    const fileLocation = join(__dirname, '../..', result.path);

    const existFile = await fs.existsSync(fileLocation);

    if (!result.path || !existFile) {
      throw new NotFoundException('File not found');
    }

    // Set appropriate headers for the response
    res.header('Content-Type', 'image/jpeg'); // Adjust content type based on your file type
    res.header('Content-Disposition', `inline; filename=${result.filename}`);

    // Send the file to the frontend
    return res.sendFile(fileLocation);
  }

  @Post('online')
  @UseInterceptors(FileInterceptor('file'))
  async online(@UploadedFile() file: Express.Multer.File) {
    return await this.cloudinary
      .uploadImage(file)
      .then((data) => {
        return {
          statusCode: 200,
          data: data.secure_url,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: err.message,
        };
      });
  }
}
