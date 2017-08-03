import { Profile } from './profile.model';

export class Article {
  slug: string;
  title = '';
  description = '';
  body = '';
  tagList: Array<string> = [];
  order: number;
  createdAt: number;
  updatedAt: number;
  favorited: boolean;
  favoritesCount: number;
  author: Profile;
}
