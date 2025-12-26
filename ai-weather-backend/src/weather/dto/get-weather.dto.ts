import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class GetWeatherDto {
  @IsNotEmpty({ message: 'city is required' })
  @IsString({ message: 'city must be a string' })
  @MinLength(1, { message: 'city cannot be empty' })
  @MaxLength(100, { message: 'city name is too long' })
  city: string;
}

