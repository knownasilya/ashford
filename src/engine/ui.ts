import { input } from './input';
import { paintIcon } from './sprites';
import type { GameState } from './state';
import { txt } from './dialogue';
import type { Ending } from './types';

const $ = (id: string) => document.getElementById(id)!;

/** A menu entry. A function label updates after each choice (for toggles). */
export interface MenuItem {
  label: string | (() => string);
  run: () => void;
}
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Everything drawn in HTML over the canvas: HUD, fades, cards, menus. */
export class UI {
  private screen = $('screen');
  private fadeEl = $('fade');
  private cardEl = $('card');
  private cardText = $('card-text');
  private bannerEl = $('banner');
  private cardDone?: () => void;
  private cardReadyAt = 0;
  private menuSel = 0;
  private menuItems: MenuItem[] = [];
  private menuEl?: HTMLElement;
  private onCancel?: () => void;
  private hudKey = '';

  // ------------------------------------------------ HUD
  updateHud(s: GameState, objectives: string[]) {
    const key = `${s.coins}|${[...s.items].join()}|${objectives.join('|')}`;
    if (key === this.hudKey) return;
    this.hudKey = key;
    $('coins').textContent = String(s.coins).padStart(3, '0');
    const items = $('items');
    items.innerHTML = '';
    for (const item of s.items) {
      const c = document.createElement('canvas');
      c.className = 'icon';
      paintIcon(c, item);
      items.append(c);
    }
    const log = $('objective');
    log.innerHTML = '';
    for (const o of objectives) {
      const div = document.createElement('div');
      div.textContent = o;
      log.append(div);
    }
  }

  showHud(on: boolean) {
    $('hud').classList.toggle('hidden', !on);
  }

  // ------------------------------------------------ screen effects
  fade(dir: 'in' | 'out'): Promise<void> {
    this.fadeEl.style.opacity = dir === 'out' ? '1' : '0';
    return sleep(450);
  }

  setBlack(on: boolean) {
    this.fadeEl.style.transition = 'none';
    this.fadeEl.style.opacity = on ? '1' : '0';
    void this.fadeEl.offsetWidth;
    this.fadeEl.style.transition = '';
  }

  shake(ms: number) {
    this.screen.classList.add('shake');
    setTimeout(() => this.screen.classList.remove('shake'), ms);
  }

  banner(text: string) {
    this.bannerEl.textContent = text;
    this.bannerEl.classList.remove('show');
    void this.bannerEl.offsetWidth;
    this.bannerEl.classList.add('show');
  }

  /** Full-screen text. Resolves when the player presses confirm. */
  card(lines: string[]): Promise<void> {
    this.cardText.innerHTML = '';
    for (const l of lines) {
      const p = document.createElement('p');
      p.textContent = l;
      this.cardText.append(p);
    }
    this.cardEl.classList.remove('hidden');
    this.cardReadyAt = performance.now() + 400;
    return new Promise((r) => (this.cardDone = r));
  }

  // ------------------------------------------------ menus
  private showMenu(list: HTMLElement, items: MenuItem[], onCancel?: () => void) {
    this.menuEl = list;
    this.menuItems = items;
    this.onCancel = onCancel;
    this.menuSel = 0;
    this.renderMenu();
  }

  private closeMenu() {
    this.menuItems = [];
    this.onCancel = undefined;
  }

  showTitle(items: MenuItem[]) {
    this.showMenu($('menu'), items);
    $('title').classList.remove('hidden');
  }

  hideTitle() {
    $('title').classList.add('hidden');
    this.closeMenu();
  }

  /** The Esc menu. Esc again calls onCancel. */
  showPause(items: MenuItem[], onCancel: () => void) {
    this.showMenu($('pause-menu'), items, onCancel);
    $('pause').classList.remove('hidden');
  }

  hidePause() {
    $('pause').classList.add('hidden');
    this.closeMenu();
  }

  private renderMenu() {
    const ul = this.menuEl!;
    ul.innerHTML = '';
    this.menuItems.forEach((m, i) => {
      const li = document.createElement('li');
      li.textContent = typeof m.label === 'function' ? m.label() : m.label;
      li.classList.toggle('selected', i === this.menuSel);
      li.onclick = () => {
        m.run();
        if (this.menuItems.length) this.renderMenu();
      };
      ul.append(li);
    });
  }

  showEnding(e: Ending, year: string, s: GameState) {
    $('ending-year').textContent = year;
    $('ending-title').textContent = e.title;
    const body = $('ending-text');
    body.innerHTML = '';
    for (const l of e.text.map((t) => txt(t, s)).filter(Boolean)) {
      const p = document.createElement('p');
      p.textContent = l;
      body.append(p);
    }
    $('ending').classList.remove('hidden');
  }

  hideEnding() {
    $('ending').classList.add('hidden');
  }

  /** Returns true if the UI used the input this frame. */
  update(): boolean {
    if (this.cardDone) {
      if (performance.now() > this.cardReadyAt && input.take('confirm')) {
        this.cardEl.classList.add('hidden');
        const done = this.cardDone;
        this.cardDone = undefined;
        done();
      }
      return true;
    }
    if (this.menuItems.length) {
      const n = this.menuItems.length;
      if (input.take('up')) this.menuSel = (this.menuSel + n - 1) % n;
      if (input.take('down')) this.menuSel = (this.menuSel + 1) % n;
      this.renderMenu();
      if (input.take('confirm')) this.menuItems[this.menuSel].run();
      else if (input.take('cancel')) this.onCancel?.();
      if (this.menuItems.length) this.renderMenu();
      return true;
    }
    return false;
  }
}
