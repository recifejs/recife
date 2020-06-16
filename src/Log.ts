class Log {
  private static _instance: Log;
  private errors: string[];
  private warns: string[];
  private infoOld: string;
  private colors = {
    reset: '\x1b[0m',
    fgBlue: '\x1b[34m',
    fgGreen: '\x1b[32m',
    fgCyan: '\x1b[36m',
    bgBlue: '\x1b[44m'
  };

  private constructor() {
    this.errors = [];
    this.warns = [];
    this.infoOld = '';
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  infoHeap(text: string) {
    if (this.infoOld !== '') {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
    }

    process.stdout.write(`${this.colors.fgBlue}ℹ${this.colors.reset} ${text}`);
    this.infoOld = text;
  }

  successHeap(text: string) {
    if (this.infoOld !== '') {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
    }

    process.stdout.write(`${this.colors.fgGreen}✓${this.colors.reset} ${text}`);
    this.infoOld = text;
  }

  jump() {
    process.stdout.write(`\n`);
  }

  title(text: string) {
    process.stdout.write(`\n${this.colors.bgBlue}⚬ ${text.toUpperCase()}${this.colors.reset}\n\n`);
  }

  info(text: string) {
    process.stdout.write(`\n${this.colors.fgCyan}⚬${this.colors.reset} ${text}`);
  }

  error(text: string) {
    this.errors.push(text);
  }

  warn(text: string) {
    this.warns.push(text);
  }
}

export default Log;
