import { Item } from "./Item";

export interface User{
    id: string;
    name: string;
    items: Item[];
}