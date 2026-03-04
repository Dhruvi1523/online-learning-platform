// Type definitions for Sequelize models
export interface Category {
  id: string;
  name: string;
}

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface Level {
  id: string;
  name: string;
}

export interface Course {
  id: string;
  instructorId: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  price?: number | null;
  isPublished: boolean;
  categoryId: string;
  subCategoryId: string;
  levelId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Section {
  id: string;
  title: string;
  description?: string | null;
  videoUrl?: string | null;
  position?: number | null;
  isPublished: boolean;
  isFree: boolean;
  courseId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MuxData {
  id: string;
  assetId: string;
  playbackId?: string | null;
  sectionId?: string | null;
}

export interface Resource {
  id: string;
  name?: string | null;
  fileUrl?: string | null;
  sectionId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Progress {
  id: string;
  studentId?: string | null;
  sectionId?: string | null;
  isCompleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Purchase {
  id: string;
  customerId?: string | null;
  courseId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StripeCustomer {
  id: string;
  customerId?: string | null;
  stripeCustomerId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
