import LogType from './LogType';

class Log {
  private static _instance: Log;
  private errors: LogType[];
  private warns: LogType[];
  private infoOld: string;
  private colors = {
    reset: '\x1b[0m',
    fgBlack: '\x1b[30m',
    fgBlue: '\x1b[34m',
    fgGreen: '\x1b[32m',
    fgCyan: '\x1b[36m',
    fgYellow: '\x1b[33m',
    fgRed: '\x1b[31m',
    bgBlue: '\x1b[44m',
    bgRed: '\x1b[41m',
    bgYellow: '\x1b[43m',
    bgWhite: '\x1b[47m'
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
    process.stdout.write(
      `\n${this.colors.bgWhite}${this.colors.fgBlue} ⚬ ${text.toUpperCase()} ⚬ ${this.colors.reset}\n\n`
    );
  }

  info(text: string) {
    process.stdout.write(`\n${this.colors.fgCyan}⚬${this.colors.reset} ${text}`);
  }

  error(log: LogType) {
    if (!log.line) {
      log.line = log.sourceFile!.getLineAndCharacterOfPosition(log.node!.getStart(log.sourceFile));
    }

    delete log.node;
    delete log.sourceFile;

    this.errors.push(log);
  }

  exception(text: string) {
    process.stdout.write(`\n${this.colors.fgRed}☓${this.colors.reset} ${text}`);
    process.exit(1);
  }

  warn(log: LogType) {
    this.warns.push(log);
  }

  containsErrors(): boolean {
    return this.errors.length > 0;
  }

  showErrors(text: string) {
    if (this.errors) {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(`${this.colors.fgRed}☓${this.colors.reset} ${text}\n`);
    }

    this.errors.forEach((error, index) => {
      process.stdout.write(`\n${index + 1}) ${this.colors.bgRed}${this.colors.fgBlack}`);
      process.stdout.write(`error ${error.code}${this.colors.reset}`);
      process.stdout.write(`: ${error.message}`);
      process.stdout.write(`\n\n   Location: ${error.path}:${error.line!.line + 1}:${error.line!.character + 1}\n`);
    });

    this.warns.forEach((error, index) => {
      process.stdout.write(`\n${index + 1}) ${this.colors.bgYellow}${this.colors.fgBlack}`);
      process.stdout.write(`warning ${error.code}${this.colors.reset}`);
      process.stdout.write(`: ${error.message}`);
      process.stdout.write(`\n\n   Location: ${error.path}:${error.line!.line + 1}:${error.line!.character + 1}\n`);
    });

    if (this.errors.length > 0 || this.warns.length > 0) {
      process.stdout.write('\nStatus: ');
      process.stdout.write(`${this.colors.fgRed}(${this.errors.length}) ${this.colors.reset}errors`);
      process.stdout.write(` / ${this.colors.fgYellow}(${this.warns.length}) ${this.colors.reset}warnings`);
      process.stdout.write(`\n\n`);
    }
  }
}

export default Log;
