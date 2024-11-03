import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { VideoType } from '../enum/video_type.enum';

export class CreateVideoDto {
  @IsNotEmpty({ message: 'video name không được bỏ trống.' })
  @ApiProperty()
  video_name: string;

  @IsNotEmpty({ message: 'thumbnail không được bỏ trống.' })
  @ApiProperty()
  thumbnail: string;

  @IsNotEmpty({ message: 'description không được bỏ trống.' })
  @ApiProperty()
  description: string;

  @ApiProperty()
  views: number;

  @IsNotEmpty({ message: 'source không được bỏ trống.' })
  @ApiProperty()
  source: string;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  @IsEnum(VideoType)
  type_id: number;
}

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  hinhAnh: any;
}

//define DTO upload nhieu hinh
export class FilesUploadDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  hinhAnh: any[];
}
