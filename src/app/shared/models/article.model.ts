import { Profile } from './profile.model';

export interface Article {
  slug: string;
  title: string;
  body: string;
  order: number;
  createdAt: number;
  updatedAt: number | null;
  author: Profile;
}

export interface FirebaseArticle {
  title: string;
  body: string;
  order: number;
  createdAt: number;
  updatedAt: number | null;
  uid: string;
  authorName: string;
  authorPhotoURL: string;
}
