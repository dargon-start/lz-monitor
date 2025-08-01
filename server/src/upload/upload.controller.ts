import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Res,
  Query,
  StreamableFile,
  Body,
} from '@nestjs/common';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import archiver from 'archiver';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@Controller('upload')
@ApiTags('附件')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('Received file:', file);

    return file;
  }

  @Get('download')
  streamFile(
    @Query('filename') filename: string,
    @Res({ passthrough: true }) response,
  ): StreamableFile {
    const filePath = join(__dirname, '../images/', filename);
    const stream = createReadStream(filePath);

    // 设置 Content-Disposition 让浏览器知道这是一个附件下载，并指定文件名
    response.header({
      'Content-Disposition': `attachment; filename="${encodeURIComponent('测试.jpg')}"`,
      'Content-Type': 'application/octet-stream',
    });

    return new StreamableFile(stream, {
      type: 'application/octet-stream',
    });
  }

  @Post('multipleDownload')
  async streamMultipleFiles(
    @Body('filenames') filenames: string[],
    @Res({ passthrough: true }) response,
  ): Promise<void> {
    const archive = archiver('zip', {
      zlib: { level: 6 },
    });

    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent('测试.zip')}"`,
    );
    response.setHeader('Content-Type', 'application/zip');

    // 错误处理
    archive.on('error', (err) => {
      response.status(500).send({ error: err.message });
    });

    archive.pipe(response);

    filenames.forEach((filename) => {
      const filePath = join(__dirname, '../images/', filename);
      if (existsSync(filePath)) {
        archive.file(filePath, { name: filename });
      }
    });

    await archive.finalize(); // 结束归档流
  }
}
