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
} from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Request, Response } from 'express';
import { VideoDto } from './dto/video.dto';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('/create-video')
  create(@Body() createVideoDto: CreateVideoDto, @Res() res: Response) {
    // return this.videoService.create(createVideoDto);
    return res.status(HttpStatus.CREATED).json({ createVideoDto });
  }

  @Get('/get-videos')
  async findAll(
    @Query('page') page: string,
    @Query('size') size: string,
    @Query('keyword') keyword: string,
    @Res() res: Response,
    @Req() req: Request,
    @Headers('token') token: string,
  ): Promise<Response<VideoDto[]>> {
    try {
      const formatPage = page ? +page : 1;
      const formatSize = size ? +size : 10;

      let video = await this.videoService.findAll({
        formatPage,
        formatSize,
        keyword,
      });
      return res.status(HttpStatus.OK).json({ data: video });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get('get-detail')
  findOne(@Param('id') id: string) {
    return this.videoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoService.remove(+id);
  }
}
