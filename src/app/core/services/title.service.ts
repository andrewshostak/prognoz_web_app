import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable()
export class TitleService {
    constructor(private title: Title) {}

    private ending = ' | Prognoz.org.ua';

    /**
     * Set page title
     * @param newTitle
     * @param addEnding
     */
    setTitle(newTitle: string, addEnding: boolean = true) {
        return this.title.setTitle(`${newTitle}${addEnding ? this.ending : ''}`);
    }
}
