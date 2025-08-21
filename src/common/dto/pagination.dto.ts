import { IsInt, IsOptional, IsPositive, Max, Min } from "class-validator";
import { Type } from "class-transformer";

export class PaginationDto {
  @IsInt()
  @IsOptional()
  @IsPositive()
  @Max(20)
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;

  @IsInt()
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page?: number;
}
