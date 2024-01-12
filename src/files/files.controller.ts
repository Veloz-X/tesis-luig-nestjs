import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/file-filter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/file-namer.helper';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
    
    ) { }


  @Get('post/:imageName')
  findPostImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile(path);
  }
  

  @Post('post')
  @UseInterceptors(FileInterceptor('file',{
    fileFilter: fileFilter,
    // limits: {files: 1, fileSize: 1024 * 1024 * 5}
    limits: {fileSize: 1024 * 1024 * 5},
    storage: diskStorage({
      destination: './static/posts',
      filename: fileNamer
    })
  }))
  uploadProductImage(
    @UploadedFile() file: Express.Multer.File,
    ) {
      if (!file){
        throw new BadRequestException('No file uploaded');
      }
      const image = `${file.filename}`;
    return {
      image
    };
  }
}
