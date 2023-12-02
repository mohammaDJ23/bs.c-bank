declare module '*.module.scss';

interface MicroAppExportation {
  mount(): void;
  unMount(): void;
}

interface MicroApp {
  (el: Element): MicroAppExportation;
}

declare module 'chat/ChatApp' {
  export const app: MicroApp;
}

interface Constructor<T = any> {
  new (...args: any[]): T;
}
