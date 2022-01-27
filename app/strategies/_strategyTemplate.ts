export interface Meta {
    title: string;
    description: string;
    options: Object;
    entry: string;
}

export interface Strategy extends Meta {
    dir: string;
}

export interface RunStrategy extends Strategy {
    data: string;   // name of dataset
}
