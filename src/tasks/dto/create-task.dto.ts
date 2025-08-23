import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateTaskDto {
  @IsString({message: 'Title must be a string'})
  @MinLength(3, {message: 'Title must be at least 3 characters long'})
  @IsNotEmpty({message: 'Title is required'})
  readonly title: string;

  @IsString({message: 'Description must be a string'})
  @MinLength(5, {message: 'Description must be at least 5 characters long'})
  @IsNotEmpty({message: 'Description is required'})
  readonly description: string;
}
