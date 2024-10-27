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
} from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Request, Response } from 'express';
import { VideoDto } from './dto/video.dto';
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller()
@ApiTags('Video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

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
}
