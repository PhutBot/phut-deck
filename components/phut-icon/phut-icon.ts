import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PhutElement } from '../phut-element/phut-element.js';

@customElement('phut-icon')
export class PhutIcon extends PhutElement {
    @property() size:number = 1;
    @property() zoom:number = 1;

    render() {
        return html`
        <div class="img" style="background-image:url('/img/PhutBot.png'); background-size:${this.zoom*100}%"></div>
        `;
    }
    
    static styles = [
        PhutElement.styles,
        css`
            :host {
                display: inline;
            }

            :host(.round) .img {
                border-radius: 100%;
            }

            .img {
                width: 1em;
                height: 1em;
                background-size: 200%;
                background-position: center;
            }
        `
    ];
}

declare global {
    interface HTMLElementTagNameMap {
        "phut-icon": PhutIcon,
    }
}
