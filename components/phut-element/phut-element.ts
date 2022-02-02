import { LitElement, css, html, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('phut-element')
export class PhutElement extends LitElement {
    // Declare reactive properties
    @property() name?: string = 'World';
    
    // Render the UI as a function of component state
    protected render() {
        return html`<slot></slot>`;
    }
    
    // Define scoped styles right with your component, in plain CSS
    static styles = css`
        :host {
            box-sizing: border-box;
            font-family: sans-serif;
            display: flex;
        }

        :host([hidden]) {
            display: none !important;
        }

        :host * {
            cursor: inherit;
        }
    ` as CSSResultGroup;
}

declare global {
    interface HTMLElementTagNameMap {
        "phut-element": PhutElement,
    }
}
