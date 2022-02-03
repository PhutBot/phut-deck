import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PhutElement } from '../phut-element/phut-element.js';

type Cell = {
    name:string;
    label?:string;
    data?:any
}

type Page = {
    cells:Array<Cell>;
}

class ActionEvent extends Event {
    public src?:string;
    public data?:any;

    constructor(src?:string, data?:any) {
        super('action', { composed: true });
        this.src = src;
        this.data = data;
    }
}

@customElement('phut-deck')
export class PhutDeck extends PhutElement {
    @property() page:number = 0;
    @property() maxRows:number = 3;
    @property() maxCols:number = 4;
    @property() pages:Array<Page> = [ { cells: [] } ];

    get maxCells() {
        return this.maxRows * this.maxCols;
    }
    
    nextPage() {
        if (++this.page >= this.pages.length) {
            this.page = 0;
        }
    }
    
    prevPage() {
        if (--this.page < 0) {
            this.page = this.pages.length - 1;
        }
    }

    addCell(cell:Cell) {
        if (this.pages[this.page].cells.length < this.maxCells) {
            this.pages[this.page].cells.push(cell);
            this.requestUpdate();
        }
    }

    removeCell(index:number) {
        if (index >= 0 && index < this.maxCells) {
            this.pages[this.page].cells.splice(index, 1);
            this.requestUpdate();
        }
    }

    _handleClick(ev:Event) {
        const index = Number.parseInt((ev.target as HTMLElement).getAttribute('data-index') ?? '-1');
        const button = this.pages[this.page].cells[index];
        this.dispatchEvent(new ActionEvent(button.name, button.data));
    }

    _handleRmCell(ev:Event) {
        console.log('test');
        const index = Number.parseInt(
            (ev.target as HTMLElement)
                .parentElement?.parentElement?.firstElementChild
                ?.getAttribute('data-index') ?? '-1');
        this.removeCell(index);
    }

    render() {
        return html`
            <div id="table">
                ${this.pages[this.page].cells.map(this.renderCell.bind(this))}
            </div>
        `;
    }

    renderCell(cell:Cell, index:number) {
        return html`
            <div class="wrapper">
                <phut-button
                        data-index="${index}"
                        @click="${this._handleClick}">
                    ${cell.label ?? ''}
                </phut-button>
                <div class="edit" @click="${(ev:Event) => { ev.preventDefault(); }}">
                    <button class="close" @click="${this._handleRmCell}">x</button>
                    <button class="move">+</button>
                </div>
            </div>
        `;
    }
    
    static styles = [
        PhutElement.styles,
        css`
            :host {
                --header-background-color: rgb(34, 34, 34);
                --table-border-radius: 0px;
                --table-border-color: var(--header-background-color);
                --table-border: 1px solid var(--table-border-color);
                --table-col-count: 4;
                --table-row-count: 3;
                --table-spacing: 4px;

                --el-width: 100vw;
                width: var(--el-width);
                height: calc(var(--el-width) * (9 / 16));
                max-height: 100%;
                cursor: none;
            }

            #table {
                background-color: var(--header-background-color);
                padding: 8px;
                flex: 1 1 auto;
                display: inline-grid;
                width: 100%;
                height: 100%;
                border: var(--table-border);
                border-radius: var(--table-border-radius);
                grid-template-columns: repeat(var(--table-col-count), 1fr);
                grid-template-rows: repeat(var(--table-row-count), 1fr);
                grid-gap: var(--table-spacing);
            }

            #table > *,
            #table > * phut-button {
                width: 100%;
                height: 100%;
            }

            .wrapper {
                position: relative;
            }

            :host([edit]) {
                --header-background-color: red;
                max-width: 1800px;
                cursor: initial;
            }

            :host([edit]) .edit {
                display: initial;
            }

            .edit {
                display: none;
                position: absolute;
                pointer-events: none;
                top: 0;
                left: 0;
                border: 1em solid rgba(0, 255, 0, 0.5);
                width: 100%;
                height:100%;
            }

            .edit .close,
            .edit .move {
                font-size: 2em;
                font-weight: bold;
                padding: 2.5% 5%;
                float: right;
                pointer-events: auto;
            }

            .edit .close {
                background-color: rgba(255, 0, 0, 0.5);
                cursor: pointer;
            }

            .edit .move {
                background-color: rgba(0, 0, 255, 0.5);
                cursor: grab;
            }

            .edit .move:active {
                cursor: grabbing;
            }
        `
    ];
}

declare global {
    interface HTMLElementTagNameMap {
        "phut-deck": PhutDeck,
    }
}
