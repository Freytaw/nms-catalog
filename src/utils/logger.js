// Simple logging utility with colored console output
// Warnings and errors are automatically saved to Supabase

import { supabase } from '../supabaseClient'

const LOG_LEVELS = {
  INFO: { emoji: 'ℹ️', color: '#00d9ff', label: 'INFO' },
  SUCCESS: { emoji: '✅', color: '#00ff88', label: 'SUCCESS' },
  WARNING: { emoji: '⚠️', color: '#ffd60a', label: 'WARNING' },
  ERROR: { emoji: '🔥', color: '#ff006e', label: 'ERROR' },
  DEBUG: { emoji: '🐛', color: '#9333ea', label: 'DEBUG' }
}

class Logger {
  constructor(context = 'NMS Catalog') {
    this.context = context
    this.isProduction = process.env.NODE_ENV === 'production'
  }

  _log(level, message, data = null) {
    const config = LOG_LEVELS[level]
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1)
    
    const prefix = `${config.emoji} [${timestamp}] [${this.context}] [${config.label}]`
    
    console.log(
      `%c${prefix}%c ${message}`,
      `color: ${config.color}; font-weight: bold`,
      'color: inherit'
    )
    
    if (data) {
      console.log('%cData:', 'color: #888; font-style: italic', data)
    }
  }

  async _saveToSupabase(level, message, data = null) {
    try {
      const logEntry = {
        level: level.toLowerCase(),
        context: this.context,
        message,
        data: data ? JSON.parse(JSON.stringify(data)) : null, // Serialize data
        user_agent: navigator?.userAgent || null,
        url: window?.location?.href || null,
        timestamp: new Date().toISOString()
      }

      const { error } = await supabase
        .from('logs')
        .insert(logEntry)

      if (error) {
        console.error('Failed to save log to database:', error)
      }
    } catch (err) {
      // Silently fail - don't crash the app if logging fails
      console.error('Error saving log:', err)
    }
  }

  info(message, data) {
    this._log('INFO', message, data)
  }

  success(message, data) {
    this._log('SUCCESS', message, data)
  }

  warning(message, data) {
    this._log('WARNING', message, data)
    // Save to Supabase asynchronously
    this._saveToSupabase('WARNING', message, data)
  }

  error(message, data) {
    this._log('ERROR', message, data)
    // Save to Supabase asynchronously
    this._saveToSupabase('ERROR', message, data)
    
    // In production, you could send to error tracking service here
    if (this.isProduction) {
      // Example: sendToSentry(message, data)
    }
  }

  debug(message, data) {
    if (!this.isProduction) {
      this._log('DEBUG', message, data)
    }
  }

  // Specialized database logging
  dbQuery(operation, table, data) {
    this.debug(`DB ${operation} on ${table}`, data)
  }

  // Specialized API logging
  apiCall(method, endpoint, data) {
    this.info(`API ${method} ${endpoint}`, data)
  }
}

// Export singleton instances for different contexts
export const logger = new Logger('App')
export const dbLogger = new Logger('Database')
export const apiLogger = new Logger('API')

export default Logger
