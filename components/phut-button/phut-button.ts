import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PhutElement } from '../phut-element/phut-element.js';

@customElement('phut-button')
export class PhutButton extends PhutElement {    
    render() {
        return html`
            <button>
                <slot></slot>
            </button>
        `;
    }
    
    static styles = [
        PhutElement.styles,
        css`
            :host {
                color: blue;
            }

            button {
                width: 100%;
                height: 100%;
            }
        `
    ];
}

declare global {
    interface HTMLElementTagNameMap {
        "phut-button": PhutButton,
    }
}
