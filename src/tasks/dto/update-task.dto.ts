import { IsBoolean, IsOptional } from "class-validator";
import { CreateTaskDto } from "./create-task.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsBoolean()
  readonly completed?: boolean;
}
