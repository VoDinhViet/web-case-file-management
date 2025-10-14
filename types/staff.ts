import type { BaseEntity } from "./base";

export enum RoleEnum {
  ADMIN = "admin",
  STAFF = "staff",
}

export interface Staff extends BaseEntity {
  fullName: string;
  phone: string;
  role: RoleEnum;
  password: string;
  referralCode: string;
  roleId: string | null;
  createdBy: string | null;
  tokenExpo: string | null;
  totalCases: number;
}

export interface SelectStaffs
  extends Pick<Staff, "id" | "fullName" | "phone"> {}
