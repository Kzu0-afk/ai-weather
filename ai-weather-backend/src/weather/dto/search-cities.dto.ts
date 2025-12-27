import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SearchCitiesDto {
  @IsNotEmpty({ message: 'query is required' })
  @IsString({ message: 'query must be a string' })
  @MinLength(1, { message: 'query cannot be empty' })
  @MaxLength(100, { message: 'query is too long' })
  query: string;
}

