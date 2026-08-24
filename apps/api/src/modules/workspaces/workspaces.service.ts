import {
  Injectable,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../../infrastructure/prisma/prisma.service";
import { AuthenticatedUser } from "../../common/guards/auth.guard";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { RoleName, InvitationStatus } from "../../generated/prisma/enums";

export interface CreateWorkspaceResponse {
  workspace_id: string;
  name: string;
  owner_id: string;
}

@Injectable()
export class WorkspacesService {
  private readonly logger = new Logger(WorkspacesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Ensure standard system roles ('owner', 'admin', 'member') exist in database.
   */
  async ensureSystemRoles() {
    const defaultRoles: Array<{ name: RoleName; permissions: string[] }> = [
      {
        name: RoleName.owner,
        permissions: ["workspace:manage", "members:manage", "projects:manage", "tasks:manage", "roles:manage"],
      },
      {
        name: RoleName.admin,
        permissions: ["members:invite", "projects:manage", "tasks:manage"],
      },
      {
        name: RoleName.member,
        permissions: ["projects:view", "tasks:view", "tasks:create", "tasks:edit"],
      },
    ];

    for (const role of defaultRoles) {
      const existing = await this.prisma.role.findFirst({
        where: {
          name: role.name,
          workspaceId: null,
        },
      });

      if (!existing) {
        await this.prisma.role.create({
          data: {
            name: role.name,
            permissions: role.permissions,
            workspaceId: null,
          },
        });
      }
    }
  }

  /**
   * Ensure user record is synced in 'users' table
   */
  private async ensureUserExists(user: AuthenticatedUser) {
    return this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        name: user.name || undefined,
      },
      create: {
        id: user.id,
        email: user.email,
        name: user.name || user.email.split("@")[0],
      },
    });
  }

  /**
   * Create a new workspace, register owner membership, and process initial invitations.
   */
  async createWorkspace(
    currentUser: AuthenticatedUser,
    dto: CreateWorkspaceDto
  ): Promise<CreateWorkspaceResponse> {
    try {
      // 1. Ensure user and system roles exist
      await this.ensureUserExists(currentUser);
      await this.ensureSystemRoles();

      // 2. Check for duplicate workspace name for this owner
      const existingWorkspace = await this.prisma.workspace.findFirst({
        where: {
          ownerId: currentUser.id,
          name: {
            equals: dto.name,
            mode: "insensitive",
          },
        },
      });

      if (existingWorkspace) {
        throw new ConflictException(
          `Workspace with name '${dto.name}' already exists for this owner.`
        );
      }

      // 3. Find default owner and member roles
      const ownerRole = await this.prisma.role.findFirst({
        where: { name: RoleName.owner, workspaceId: null },
      });
      const adminRole = await this.prisma.role.findFirst({
        where: { name: RoleName.admin, workspaceId: null },
      });
      const memberRole = await this.prisma.role.findFirst({
        where: { name: RoleName.member, workspaceId: null },
      });

      if (!ownerRole || !memberRole || !adminRole) {
        throw new InternalServerErrorException("System roles configuration missing");
      }

      // 4. Atomic transaction to create workspace, add owner as member, and create invitations
      const createdWorkspace = await this.prisma.$transaction(async (tx: any) => {
        // a. Create Workspace
        const workspace = await tx.workspace.create({
          data: {
            name: dto.name,
            description: dto.description ?? null,
            ownerId: currentUser.id,
          },
        });

        // b. Create Owner WorkspaceMember
        await tx.workspaceMember.create({
          data: {
            workspaceId: workspace.id,
            userId: currentUser.id,
            roleId: ownerRole.id,
          },
        });

        // c. Handle initial_members invitations
        if (dto.initial_members && dto.initial_members.length > 0) {
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

          const seenEmails = new Set<string>();

          for (const memberItem of dto.initial_members) {
            const email = memberItem.email.trim().toLowerCase();

            // Skip owner email or duplicates within the request
            if (email === currentUser.email.toLowerCase() || seenEmails.has(email)) {
              continue;
            }
            seenEmails.add(email);

            const targetRoleId =
              memberItem.role_id ||
              (memberItem.role === "admin" ? adminRole.id : memberRole.id);

            await tx.invitation.create({
              data: {
                workspaceId: workspace.id,
                email,
                roleId: targetRoleId,
                status: InvitationStatus.pending,
                expiresAt,
              },
            });
          }
        }

        return workspace;
      });

      return {
        workspace_id: createdWorkspace.id,
        name: createdWorkspace.name,
        owner_id: createdWorkspace.ownerId,
      };
    } catch (err) {
      if (err instanceof ConflictException || err instanceof BadRequestException) {
        throw err;
      }
      this.logger.error("Failed to create workspace:", err);
      throw new InternalServerErrorException(
        err instanceof Error ? err.message : "Database insert failed"
      );
    }
  }

  /**
   * Get all workspaces owned or accessible by user
   */
  async getWorkspacesForUser(userId: string) {
    return this.prisma.workspace.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        members: {
          include: {
            role: true,
            user: true,
          },
        },
        invitations: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
