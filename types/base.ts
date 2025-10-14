// Base interface for entities with common fields
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}
