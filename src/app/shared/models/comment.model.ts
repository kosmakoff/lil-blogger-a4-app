import { Profile } from './profile.model';

export interface Comment {
    articleSlug: string;
    slug: string;
    text: string;
    order: number;
    createdAt: number;
    updatedAt: number | null;
    author: Profile;
}

export interface FirebaseComment {
    text: string;
    order: number;
    createdAt: number;
    updatedAt: number | null;
    uid: string;
    authorName: string;
    authorPhotoURL: string | null;
}
