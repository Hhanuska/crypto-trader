export interface Meta {
    title: string;
    description: string;
    options: Object;
    entry: string;
}

export interface Strategy extends Meta {
    dir: string;
}
