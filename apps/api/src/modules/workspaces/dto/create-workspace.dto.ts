export interface InitialMemberDto {
  email: string;
  role?: "admin" | "member";
  role_id?: string;
}

export interface CreateWorkspaceDto {
  name: string;
  description?: string;
  initial_members?: InitialMemberDto[];
}

export function validateCreateWorkspaceDto(body: unknown): {
  isValid: boolean;
  errors: string[];
  data?: CreateWorkspaceDto;
} {
  const errors: string[] = [];

  if (!body || typeof body !== "object") {
    return { isValid: false, errors: ["Request body must be a JSON object"] };
  }

  const { name, description, initial_members } = body as Record<string, unknown>;

  // 1. Name validation (required, string, 1..255 chars)
  if (name === undefined || name === null || typeof name !== "string") {
    errors.push("Workspace name is required and must be a string");
  } else {
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      errors.push("Workspace name cannot be empty");
    } else if (trimmedName.length > 255) {
      errors.push("Workspace name cannot exceed 255 characters");
    }
  }

  // 2. Description validation (optional, string)
  if (description !== undefined && description !== null && typeof description !== "string") {
    errors.push("Workspace description must be a string if provided");
  }

  // 3. Initial members validation (optional array)
  if (initial_members !== undefined && initial_members !== null) {
    if (!Array.isArray(initial_members)) {
      errors.push("initial_members must be an array");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      initial_members.forEach((member, index) => {
        if (!member || typeof member !== "object") {
          errors.push(`initial_members[${index}] must be an object`);
          return;
        }
        const m = member as Record<string, unknown>;
        if (!m.email || typeof m.email !== "string" || !emailRegex.test(m.email.trim())) {
          errors.push(`initial_members[${index}].email must be a valid email address`);
        }
        if (m.role && typeof m.role === "string" && !["admin", "member"].includes(m.role.toLowerCase())) {
          errors.push(`initial_members[${index}].role must be 'admin' or 'member'`);
        }
      });
    }
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    data: {
      name: (name as string).trim(),
      description: typeof description === "string" ? description.trim() : undefined,
      initial_members: Array.isArray(initial_members)
        ? (initial_members as InitialMemberDto[])
        : undefined,
    },
  };
}
