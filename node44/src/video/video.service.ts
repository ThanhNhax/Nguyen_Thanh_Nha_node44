import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { PrismaClient } from '@prisma/client';
import { VideoDto } from './dto/video.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class VideoService {
  pisma = new PrismaClient();

  async create(createVideoDto: CreateVideoDto): Promise<VideoDto> {
    try {
      const newVideo = await this.pisma.video.create({
        data: createVideoDto,
      });
      return newVideo;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAll({
    formatPage,
    formatSize,
    keyword,
  }: {
    formatPage: number;
    formatSize: number;
    keyword: string;
  }): Promise<VideoDto[]> {
    try {
      let video: VideoDto[] = await this.pisma.video.findMany({
        where: keyword
          ? {
              video_name: {
                contains: keyword,
              },
            }
          : {},
        skip: (formatPage - 1) * formatSize,
        take: formatSize,
      });
      // ẩn những key Exclude define ở videoDTo
      return video.map((video) => plainToClass(VideoDto, video));
    } catch (error) {
      throw new Error(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} video`;
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  async getVideoType() {
    return await this.pisma.video_type.findMany();
  }

  async getVideos() {
    return await this.pisma.video.findMany();
  }

  async getVideoTypeById(id: number) {
    return await this.pisma.video_type.findFirst({ where: { type_id: id } });
  }

  async getVideoById(id: number) {
    return await this.pisma.video.findFirst({ where: { video_id: id } });
  }
}
