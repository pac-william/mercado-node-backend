import chalk from 'chalk';

export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS'
}

export class Logger {
    private static getTimestamp(): string {
        return new Date().toISOString();
    }

    private static getCallerInfo(stackOffset = 0): string {
        const err = new Error();
        const stack = err.stack?.split('\n');
        if (!stack) return '[unknown]';
        let callerLine = '';
        let found = 0;
        for (let i = 2; i < stack.length; i++) {
            const line = stack[i];
            if (!line.match(/logger\.ts/)) {
                if (found === stackOffset) {
                    callerLine = line;
                    break;
                }
                found++;
            }
        }
        if (!callerLine) return '[unknown]';
        // Tenta capturar qualquer caminho de arquivo entre parênteses
        const match = callerLine.match(/\(([^)]+)\)/) || callerLine.match(/at ([^ ]+)/);
        if (match && match[1]) {
            const fullPath = match[1];
            // Se for <anonymous>, retorna explicitamente
            if (fullPath.includes('<anonymous>')) return '[anonymous]';
            const parts = fullPath.split(/[\\/]/);
            const lastParts = parts.slice(-2).join('/');
            return chalk.gray(`[${lastParts}]`);
        }
        return '[unknown]';
    }

    private static formatMessage(level: LogLevel, context: string, message: string, data?: any): string {
        const timestamp = chalk.gray(`[${this.getTimestamp()}]`);
        const callerInfo = this.getCallerInfo();
        const levelColor = this.getLevelColor(level);
        const levelText = levelColor(`[${level}]`);
        const contextText = chalk.cyan(`[${context}]`);
        
        let formattedMessage = `${timestamp} ${callerInfo} ${levelText} ${contextText} ${message}`;
        
        if (data) {
            const dataString = typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);
            formattedMessage += `\n${chalk.gray('Data:')} ${chalk.yellow(dataString)}`;
        }
        
        return formattedMessage;
    }

    private static getLevelColor(level: LogLevel): (text: string) => string {
        switch (level) {
            case LogLevel.DEBUG:
                return chalk.magenta;
            case LogLevel.INFO:
                return chalk.blue;
            case LogLevel.WARN:
                return chalk.yellow;
            case LogLevel.ERROR:
                return chalk.red;
            case LogLevel.SUCCESS:
                return chalk.green;
            default:
                return chalk.white;
        }
    }

    static debug(context: string, message: string, data?: any) {
        console.log(this.formatMessage(LogLevel.DEBUG, context, message, data));
    }

    static info(context: string, message: string, data?: any) {
        console.log(this.formatMessage(LogLevel.INFO, context, message, data));
    }

    static warn(context: string, message: string, data?: any) {
        console.log(this.formatMessage(LogLevel.WARN, context, message, data));
    }

    static error(context: string, message: string, data?: any) {
        console.error(this.formatMessage(LogLevel.ERROR, context, message, data));
    }

    static success(context: string, message: string, data?: any) {
        console.log(this.formatMessage(LogLevel.SUCCESS, context, message, data));
    }

    // Métodos específicos para diferentes camadas da aplicação
    static controller(controllerName: string, method: string, message: string, data?: any) {
        this.info(`${controllerName}Controller`, `${method} - ${message}`, data);
    }

    static service(serviceName: string, method: string, message: string, data?: any) {
        this.info(`${serviceName}Service`, `${method} - ${message}`, data);
    }

    static repository(repositoryName: string, method: string, message: string, data?: any) {
        this.info(`${repositoryName}Repository`, `${method} - ${message}`, data);
    }

    static database(operation: string, message: string, data?: any) {
        this.info('Database', `${operation} - ${message}`, data);
    }

    static api(endpoint: string, method: string, message: string, data?: any) {
        this.info('API', `${method} ${endpoint} - ${message}`, data);
    }

    // Métodos para logs de sucesso e erro específicos
    static successOperation(context: string, operation: string, id?: string | number | number) {
        const message = id ? `success id: ${id}` : 'success';
        this.success(context, `${operation} - ${message}`);
    }

    static errorOperation(context: string, operation: string, error: any, message?: string) {
        this.error(context, `${operation} - error ${message ? `- ${message}` : ''}`, error);
    }

    // Método para logs de performance
    static performance(context: string, operation: string, duration: number) {
        const color = duration > 1000 ? chalk.red : duration > 500 ? chalk.yellow : chalk.green;
        const durationText = color(`${duration}ms`);
        this.info(context, `${operation} - completed in ${durationText}`);
    }
}
