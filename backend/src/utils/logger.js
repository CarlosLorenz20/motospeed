/**
 * Logger simple para la aplicación
 * En producción se podría usar winston u otro logger más robusto
 */

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const getTimestamp = () => {
  return new Date().toISOString();
};

const formatMessage = (level, message, data) => {
  const timestamp = getTimestamp();
  let output = `[${timestamp}] [${level}] ${message}`;
  
  if (data) {
    if (typeof data === 'object') {
      output += '\n' + JSON.stringify(data, null, 2);
    } else {
      output += ` ${data}`;
    }
  }
  
  return output;
};

const logger = {
  info: (message, data) => {
    const formatted = formatMessage('INFO', message, data);
    console.log(`${colors.cyan}${formatted}${colors.reset}`);
  },

  success: (message, data) => {
    const formatted = formatMessage('SUCCESS', message, data);
    console.log(`${colors.green}${formatted}${colors.reset}`);
  },

  warn: (message, data) => {
    const formatted = formatMessage('WARN', message, data);
    console.warn(`${colors.yellow}${formatted}${colors.reset}`);
  },

  error: (message, data) => {
    const formatted = formatMessage('ERROR', message, data);
    console.error(`${colors.red}${formatted}${colors.reset}`);
  },

  debug: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      const formatted = formatMessage('DEBUG', message, data);
      console.log(`${colors.magenta}${formatted}${colors.reset}`);
    }
  },

  request: (req) => {
    if (process.env.NODE_ENV === 'development') {
      const formatted = formatMessage('REQUEST', `${req.method} ${req.url}`);
      console.log(`${colors.blue}${formatted}${colors.reset}`);
    }
  }
};

module.exports = logger;
