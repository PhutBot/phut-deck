import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PhutElement } from '../phut-element/phut-element.js';

@customElement('phut-header')
export class PhutHeader extends PhutElement {
    render() {
        return html`
            <a href="/"><phut-icon class="round" zoom="1.3"></phut-icon></a>
            <a href="https://twitch.tv/phutbot">TTV</a>
            <a href="https://discord.gg/auXC2kZmne">Discord</a>
            <div class="fill"></div>
        `;
    }
    
    static styles = [
        PhutElement.styles,
        css`
            :host {
                align-items: center;
                background-color: #222;
                color: #DDD;
                display: flex;
                font-size: 32px;
                width: 100%;
                line-height: 1;
                flex-direction: row;
            }

            :host(.round) div {
                display: inline-block;
                border-radius: 100%;
                background-position: center;
                background-size: 200%;
            }

            :host > * {
                border-right: 1px solid #111;
                padding: 8px 16px;
            }

            a, a:visited {
                display: block;
                text-decoration: none;
                color: inherit;
            }

            a:hover {
                background-color: #111;
            }

            .fill {
                height: 1em;
                flex: 1 1 100%;
            }
        `
    ];
}

declare global {
    interface HTMLElementTagNameMap {
        "phut-header": PhutHeader,
    }
}
