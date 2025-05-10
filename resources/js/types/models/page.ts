export interface Page {
    id: number;
    title: string;
    slug: string | null; // Since slug can be nullable
    content: string;
    restricted: boolean;
    createdAt: string; // DateTime string from backend
    updatedAt: string; // DateTime string from backend
}
