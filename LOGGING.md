# 🔍 Système de Logs

## Vue d'ensemble

Le catalogue utilise un système de logs double :
- **Console** : Logs colorés pour le développement
- **Supabase** : Stockage automatique des warnings et errors dans la base de données

## ⚠️ Logs persistants (Supabase)

### Logs sauvegardés automatiquement

**Seuls les warnings et errors sont enregistrés dans Supabase.**

Les logs INFO, SUCCESS et DEBUG restent uniquement dans la console.

### Structure de la table `logs`

```sql
CREATE TABLE logs (
  id UUID PRIMARY KEY,
  timestamp TIMESTAMPTZ,
  level TEXT,              -- 'warning' ou 'error'
  context TEXT,            -- 'App', 'Database', 'API'
  message TEXT,
  data JSONB,             -- Données additionnelles
  user_agent TEXT,
  url TEXT,               -- URL de la page
  created_at TIMESTAMPTZ
)
```

### Migration SQL

Exécute cette migration dans Supabase :
```bash
/sql/migration_add_logs_table.sql
```

### Visualisation des logs

**Interface web :** Accède à `/logs` dans l'application pour voir l'historique des warnings/errors avec :
- 🔍 Filtres par niveau et contexte
- 📅 Tri chronologique
- 📊 Détails techniques repliables
- 🔄 Actualisation en temps réel

**Supabase Dashboard :** Accède directement à la table `logs` pour des requêtes SQL personnalisées.

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

### Warning enregistré dans Supabase
```javascript
import { logger } from '../utils/logger'

// Warning : Enregistré dans console + Supabase
logger.warning('Image trop grande, compression appliquée', { 
  originalSize: 5000000,
  compressedSize: 800000 
})
```

### Error enregistré dans Supabase
```javascript
import { dbLogger } from '../utils/logger'

try {
  const res = await supabase.from('systems').insert(data)
  if (res.error) throw res.error
} catch (error) {
  // Error : Enregistré dans console + Supabase
  dbLogger.error('Failed to insert system', {
    errorMessage: error.message,
    errorCode: error.code,
    data: data
  })
}
```

### Info/Success : Console uniquement
```javascript
import { logger } from '../utils/logger'

// Info : Console uniquement (pas dans Supabase)
logger.info('Fetching data...')

// Success : Console uniquement (pas dans Supabase)
logger.success('Data loaded successfully', { count: 5 })
```

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

1. ✅ Utilisez `info` pour les actions importantes (console uniquement)
2. ✅ Utilisez `success` pour confirmer les opérations (console uniquement)
3. ✅ Utilisez `warning` pour les situations non critiques (**enregistré dans Supabase**)
4. ✅ Utilisez `error` pour toutes les erreurs (**enregistré dans Supabase**)
5. ✅ Utilisez `debug` pour le développement uniquement (console uniquement)
6. ✅ Incluez les données pertinentes dans le deuxième paramètre
7. ❌ N'abusez pas des logs (pollution de la console)
8. ❌ Ne loggez jamais de données sensibles (mots de passe, tokens)

## Nettoyage des logs

### Supprimer les logs anciens (SQL)

```sql
-- Supprimer les logs de plus de 30 jours
DELETE FROM logs 
WHERE timestamp < NOW() - INTERVAL '30 days';

-- Supprimer les warnings de plus de 7 jours
DELETE FROM logs 
WHERE level = 'warning' 
AND timestamp < NOW() - INTERVAL '7 days';

-- Garder seulement les 1000 derniers logs
DELETE FROM logs 
WHERE id NOT IN (
  SELECT id FROM logs 
  ORDER BY timestamp DESC 
  LIMIT 1000
);
```

### Automatisation (Supabase Edge Function)

Tu peux créer une Edge Function Supabase qui s'exécute quotidiennement pour nettoyer automatiquement les vieux logs.

## Requêtes SQL utiles

### Logs par niveau
```sql
SELECT level, COUNT(*) as count
FROM logs
GROUP BY level
ORDER BY count DESC;
```

### Errors les plus fréquents
```sql
SELECT message, COUNT(*) as occurrences
FROM logs
WHERE level = 'error'
GROUP BY message
ORDER BY occurrences DESC
LIMIT 10;
```

### Logs des dernières 24h
```sql
SELECT *
FROM logs
WHERE timestamp > NOW() - INTERVAL '24 hours'
ORDER BY timestamp DESC;
```

### Logs par contexte
```sql
SELECT context, level, COUNT(*) as count
FROM logs
GROUP BY context, level
ORDER BY count DESC;
```
