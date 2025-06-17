// Interim network optimization service fix
import { getResourceFromCache, cacheResource } from './resource-cache.service';

// Map of resource types from the internal type to the cache type
export function mapResourceTypeForCache(type: 'image' | 'audio' | 'font' | 'json' | 'other'): 'image' | 'audio' | 'other' {
  if (type === 'image') return 'image';
  if (type === 'audio') return 'audio';
  return 'other';
}
