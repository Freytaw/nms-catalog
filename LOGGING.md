# 🔍 Système de Logs

## Vue d'ensemble

Le catalogue utilise un système de logs simple avec des couleurs pour faciliter le débogage.

## Utilisation

### Import

```javascript
import { logger, dbLogger, apiLogger } from '../utils/logger'
```

### Niveaux de log

#### ℹ️ INFO (cyan)
Informations générales sur l'exécution.
```javascript
logger.info('Application démarrée')
dbLogger.info('Fetching systems...')
```

#### ✅ SUCCESS (vert)
Actions réussies.
```javascript
logger.success('Données sauvegardées')
dbLogger.success('Loaded 5 systems')
```

#### ⚠️ WARNING (jaune)
Avertissements non critiques.
```javascript
logger.warning('Image trop grande, compression appliquée')
```

#### 🔥 ERROR (rouge)
Erreurs critiques.
```javascript
logger.error('Échec de la sauvegarde', error)
dbLogger.error('Database connection failed', error)
```

#### 🐛 DEBUG (violet)
Informations de débogage (dev uniquement).
```javascript
logger.debug('State updated', newState)
```

### Loggers spécialisés

#### Database Logger
```javascript
import { dbLogger } from '../utils/logger'

dbLogger.info('Querying database...')
dbLogger.success('Query completed')
dbLogger.error('Query failed', error)

// Méthode raccourcie
dbLogger.dbQuery('SELECT', 'systems', { id: 123 })
```

#### API Logger
```javascript
import { apiLogger } from '../utils/logger'

apiLogger.info('Making API call...')
apiLogger.success('API response received')

// Méthode raccourcie
apiLogger.apiCall('GET', '/api/systems', params)
```

## Exemples d'intégration

### Page avec chargement de données
```javascript
import { dbLogger } from '../utils/logger'

async function fetchData() {
  try {
    dbLogger.info('Fetching systems...')
    
    const res = await supabase.from('systems').select('*')
    
    if (res.error) throw res.error
    
    dbLogger.success(`Loaded ${res.data.length} systems`)
    setSystems(res.data)
  } catch (error) {
    dbLogger.error('Failed to fetch systems', error)
  }
}
```

### Sauvegarde avec validation
```javascript
import { logger } from '../utils/logger'

async function handleSubmit(e) {
  e.preventDefault()
  
  logger.info('Submitting form...', formData)
  
  if (!validateForm()) {
    logger.warning('Form validation failed')
    return
  }
  
  try {
    const { error } = await supabase.from('systems').insert(formData)
    
    if (error) throw error
    
    logger.success('System created successfully')
    navigate('/systems')
  } catch (error) {
    logger.error('Failed to create system', error)
  }
}
```

## Console output

Les logs apparaissent dans la console avec:
- 🎨 Couleurs pour chaque niveau
- ⏰ Timestamp
- 📦 Contexte (App, Database, API)
- 📊 Données structurées

### Exemple:
```
ℹ️ [14:32:15.123] [Database] [INFO] Fetching systems...
✅ [14:32:15.456] [Database] [SUCCESS] Loaded 5 systems
Data: [...]
```

## Notes

- Les logs DEBUG n'apparaissent qu'en mode développement
- En production, les erreurs peuvent être envoyées à un service externe (Sentry, etc.)
- Tous les logs incluent automatiquement un timestamp
- Les données complexes sont automatiquement formatées

## Bonnes pratiques

1. ✅ Utilisez `info` pour les actions importantes
2. ✅ Utilisez `success` pour confirmer les opérations
3. ✅ Utilisez `warning` pour les situations non critiques
4. ✅ Utilisez `error` pour toutes les erreurs
5. ✅ Utilisez `debug` pour le développement uniquement
6. ✅ Incluez les données pertinentes dans le deuxième paramètre
7. ❌ N'abusez pas des logs (pollution de la console)
8. ❌ Ne loggez jamais de données sensibles (mots de passe, tokens)
