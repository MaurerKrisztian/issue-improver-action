export interface ILabel {
    id: number;
    node_id: string;
    url: string;
    name: string;
    description: string | null;
    color: string;
    default: boolean;
}
