export class Section {
    title: string;
    content: Page[];
    quizes: Quiz[];
}

export class Page {
    title: string;
    text: string;
}

export class Quiz {
    title: string;
    type: string;
    data: {
        [key: string]: any;
    }
}