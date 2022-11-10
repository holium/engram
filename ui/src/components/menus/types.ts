export class Menu {
    location: { top: string, left: string };
    items: Array<MenuItem>;
    
    horizontal: boolean;

    constructor(location: { top: number, left: number }, items: Array<MenuItem>, horizontal=false) {
        this.location = {
            top: `${location.top}px`,
            left: `${location.left}px`
        };
        this.items = items;
        this.horizontal = horizontal;
    }
}

export interface MenuItem {
    display: string;
    icon: string;
    run: () => void;
}