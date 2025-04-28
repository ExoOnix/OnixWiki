export interface Block {
    type: string;
    data: {
        level?: number;
        text?: string;
        items?: ListItem[];
        style?: string;
        file?: { url: string };
        caption?: string;
    };
}

export interface ListItem {
    content: string;
    items?: ListItem[];
}
