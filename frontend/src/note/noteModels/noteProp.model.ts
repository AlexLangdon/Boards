import { UIElement } from '../../generic/interfaces/uiElement.interface';

// Represents tags and boards

export class NoteProp implements UIElement {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    toUIString(): string {
        return this.name;
    }
}
