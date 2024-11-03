import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  Query,
  Req,
  Headers,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { VideoService } from './video.service';
import {
  CreateVideoDto,
  FilesUploadDto,
  FileUploadDto,
} from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Request, Response, Express } from 'express';
import { VideoDto } from './dto/video.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { getStorageOptions } from 'src/shared/upload.service';
import { CloudinaryService } from 'src/shared/cloudinary.service';

@Controller()
@ApiTags('Video')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/create-video')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create Successfully!',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'INTERNAL_SERVER_ERROR!',
  })
  async create(@Body() createVideoDto: CreateVideoDto, @Res() res: Response) {
    const data = await this.videoService.create(createVideoDto);
    // phải thông thằng res của express thì mới show res ở swagger
    return res.status(HttpStatus.CREATED).json({ data });
  }

  @Get('/video-type')
  async getVideoType() {
    try {
      return this.videoService.getVideoType();
    } catch (error) {
      return new Error(error);
    }
  }

  @Get('/video-type/:id')
  @ApiParam({ name: 'id', required: false, type: Number })
  getVideoTypeById(@Param('id') id: string) {
    return this.videoService.getVideoTypeById(+id);
  }

  @Get('/videos')
  getVideos() {
    return this.videoService.getVideos();
  }

  @Get('/video/:id')
  getVideoById(@Param('id') id: string) {
    return this.videoService.getVideoById(+id);
  }
  @Get('get-detail')
  findOne(@Param('id') id: string) {
    return this.videoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(+id, updateVideoDto);
  }

  @Post('/upload-thumbnail')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
    required: true,
  })
  @UseInterceptors(
    FileInterceptor('hinhAnh', { storage: getStorageOptions('videos') }),
  )
  uploadThumbnail(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    return res.status(200).json(file);
  }

  @Post('/upload-multi-thumbnail')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FilesUploadDto,
    required: true,
  })
  @UseInterceptors(
    FilesInterceptor('hinhAnh', 20, { storage: getStorageOptions('videos') }),
  )
  uploadMuitilpleThumbnail(
    @UploadedFiles() file: Express.Multer.File[],
    @Res() res: Response,
  ) {
    return res.status(200).json(file);
  }

  @Post('/upload-thumbnail-cloud')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
    required: true,
  })
  @UseInterceptors(FileInterceptor('hinhAnh'))
  async uploadThumbnailCloud(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      const result = await this.cloudinaryService.uploadImage(file, 'videos');
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Upload failed' });
    }
  }
}
