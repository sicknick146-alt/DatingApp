import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  dob?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  gender?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  profession?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  height?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  interests?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  personality?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;  // No MaxLength — stores base64 images

  @IsOptional()
  @IsString()
  @MaxLength(500)
  hobbies?: string;

  @IsOptional()
  onboardingCompleted?: boolean;
}
