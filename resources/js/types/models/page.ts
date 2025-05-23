import { type User } from '@/types';

export interface Page {
    id: number;
    title: string;
    slug: string | null; // Since slug can be nullable
    content: string;
    restricted: boolean;
    created_at: string; // DateTime string from backend
    updated_at: string; // DateTime string from backend
}

export interface PageRevision {
    id: number;
    page_id: number;
    content: string;
    user_id: number;
    created_at: string; // DateTime string from backend
    updated_at: string; // DateTime string from backend
    user: User;
}
