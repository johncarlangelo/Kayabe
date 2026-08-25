import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "../../generated/prisma/client";

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public readonly client: any;

  constructor() {
    this.client = new (PrismaClient as any)({});
  }

  get user() {
    return this.client.user;
  }

  get workspace() {
    return this.client.workspace;
  }

  get role() {
    return this.client.role;
  }

  get workspaceMember() {
    return this.client.workspaceMember;
  }

  get invitation() {
    return this.client.invitation;
  }

  get $transaction() {
    return this.client.$transaction.bind(this.client);
  }

  async onModuleInit() {
    try {
      await this.client.$connect();
    } catch (err) {
      console.warn("Could not immediately connect to Postgres on startup, will connect lazily.", err);
    }
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
