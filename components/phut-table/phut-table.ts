import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PhutElement } from '../phut-element/phut-element.js';

@customElement('phut-table')
export class PhutTable extends PhutElement {
    @property() header:Object = {};
    @property() data:Array<string> = [];
    @property() perPage:number = 50;
    @property() page:number = 0;

    constructor() {
        super();
    // if (!this.header && Array.isArray(this.data) && this.data.length > 0) {
    //     this.header = {};
    //     Object.keys(this.data[0]).forEach(key => this.header[key] = key);
    // }
    }

    _onPerPageChange(ev:any) {
        this.perPage = ev.target.value;
        this.page = 0;
    }

    next() {
        const floor = Math.floor(this.data.length / this.perPage);
        if (this.page < floor) {
            this.page += 1;
        } else {
            this.page = floor;
        }
    }

    prev() {
        if (this.page > 0) {
            this.page -= 1;
        } else {
            this.page = 0;
        }
    }

    renderStyle() {
        return !!this.data && this.data.length > 0 ? html`
            <style>
                #table { grid-template-columns: repeat(${Object.keys(this.header).length}, auto); }
                .nav { grid-column: span ${Object.keys(this.header).length}; }
            </style>
        ` : '';
    }

    renderHdr(row:any) {
        return !!this.header ? html`${Object.values(this.header).map(val => this.renderCell(val, 'hdr'))}` : '';
    }

    renderRow(row:any, clazz:any) {
        return html`${Object.keys(this.header).map((key, idx, arr) => {
            if (idx === arr.length - 1) {
                clazz += ' last';
            }
            return this.renderCell(row[key], clazz);
        })}`;
    }

    renderCell(cell:any, clazz:any) {
        return !Array.isArray(cell)
            ? html`<div class="cell ${clazz}">${cell}</div>`
            : html`<div class="cell ${clazz}">${cell.map((line, idx, arr) => {
                const hr = idx !== arr.length-1 ? html`<hr>` : '';
                return html`${line}${hr}`;
            })}</div>`;
    }

    render() {
        const beg = this.page * this.perPage;
        const end = beg + this.perPage;
        return html`
        ${this.renderStyle()}
        <div id="table">
            <div class="nav hdr">
                <h2><slot></slot></h2>
                <div class="btns">
                    <div ?hidden=${this.perPage > this.data.length}>
                        <button @click=${this.prev}><</button>
                        <button @click=${this.next}>></button>
                    </div>
                    <select @change=${this._onPerPageChange}>
                        <option>50</option>
                        <option>20</option>
                        <option>10</option>
                        <option>5</option>
                    </select>
                </div>
            </div>
            ${!!this.data && this.data.length > 0 ? this.renderHdr(this.data[0]) : ''}
            ${this.data.slice(beg, end).map((row:any, idx:any) => this.renderRow(row, idx % 2 == 0 ? 'even' : 'odd'))}
        </div>
        `;
    }
  
    static styles = [
        PhutElement.styles,
        css`
            :host {
                --header-background-color: lightslategray;
                --even-background-color: #DDD;
                --odd-background-color: #BBB;
                --table-border-radius: 4px;
                --table-border-color: var(--header-background-color);
                --table-border: 2px solid var(--table-border-color);
                --table-divider-color: var(--table-border-color);
                --table-divider: 2px solid var(--table-divider-color);

                width: 90%;
                max-width: 1100px;
                margin: 32px auto;
                overflow: auto;
            }

            #table {
                display: grid;
                border: var(--table-border);
                border-radius: var(--table-border-radius);
            }

            .nav > .btns {
                float: right;
            }

            .nav > h2 {
                padding: 0 32px;
                display: inline;
                margin: 0;
            }

            .nav > .btns > * {
                display: inline;
                margin: 8px;
            }

            .nav .btns *[hidden] {
                display: none;
            }

            .hdr {
                background-color: var(--header-background-color);
            }

            .cell {
                padding: 8px;
                border-right: var(--table-divider);
                text-overflow: ellipse;
            }

            .cell.last {
                border-right: none;
            }

            .odd {
                background-color: var(--odd-background-color);
            }
            
            .even {
                background-color: var(--even-background-color);
            }
        `
    ];
}

declare global {
    interface HTMLElementTagNameMap {
        "phut-table": PhutTable,
    }
}
