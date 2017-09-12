import { Profile } from './profile.model';

export interface Comment {
    slug: string;
    text: string;
    order: number;
    createdAt: number;
    updatedAt: number | null;
    author: Profile;
}
