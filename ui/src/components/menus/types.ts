export class Menu {
    location: { top: number, left: number };
    items: Array<MenuItem>;
    
    horizontal: boolean;

    constructor(location: { top: number, left: number }, items: Array<MenuItem>, horizontal=false) {
        this.location = location;
        this.items = items;
        this.horizontal = horizontal;
    }
}

export interface MenuItem {
    display: string;
    icon: string;
    run: () => void;
}