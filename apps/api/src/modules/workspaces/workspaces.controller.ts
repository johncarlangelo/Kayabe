import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from "@nestjs/common";
import { WorkspacesService, CreateWorkspaceResponse } from "./workspaces.service";
import { AuthGuard, AuthenticatedUser } from "../../common/guards/auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { validateCreateWorkspaceDto } from "./dto/create-workspace.dto";

@Controller("workspaces")
@UseGuards(AuthGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createWorkspace(
    @CurrentUser() user: AuthenticatedUser,
    @Body() rawBody: unknown
  ): Promise<CreateWorkspaceResponse> {
    const validation = validateCreateWorkspaceDto(rawBody);
    if (!validation.isValid || !validation.data) {
      throw new BadRequestException(validation.errors.join("; "));
    }

    return this.workspacesService.createWorkspace(user, validation.data);
  }

  @Get()
  async getWorkspaces(@CurrentUser() user: AuthenticatedUser) {
    return this.workspacesService.getWorkspacesForUser(user.id);
  }
}
