import { Exclude, Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  user_id: number;

  @Expose()
  full_name: string;

  @Expose()
  email: string;

  @Expose()
  avatar: string; // URL as a string

  @Exclude()
  pass_word: string; // Assuming password is stored securely hashed

  @Exclude()
  face_app_id: string;

  @Exclude()
  role_id: number;

  @Exclude()
  refresh_token: string | null; // Can be null

  @Exclude()
  secret: string | null; // Can be null
  //   Tạo object mà tất cả thành ?
  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
