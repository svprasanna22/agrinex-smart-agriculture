import { CropHistoryEntry, UserSession, DashboardSummary } from '../types';

const AUTH_KEY = 'agrinex_auth_session';
const HISTORY_KEY = 'agrinex_crop_history';
const FERT_COUNTER_KEY = 'agrinex_fertilizer_count';
const YIELD_COUNTER_KEY = 'agrinex_yield_count';

// Default initial demo analyses if user has no history
const INITIAL_DEMO_HISTORY: CropHistoryEntry[] = [
  {
    id: 'demo-analysis-101',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    dateFormatted: new Date(Date.now() - 3600000 * 4).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }),
    cropName: 'Tomato',
    diseaseName: 'Early Blight',
    status: 'diseased',
    confidence: 96.8,
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%232d1810"/><circle cx="50" cy="50" r="35" fill="%23c2410c"/><circle cx="42" cy="42" r="10" fill="%2378350f"/><circle cx="62" cy="58" r="8" fill="%23451a03"/></svg>',
    message: 'Tomato is affected by Early Blight (Alternaria solani).',
    description: 'Concentric dark brown rings resembling target boards on lower leaves with yellow halos.',
    recommendations: [
      'Prune and destroy infected lower foliage immediately.',
      'Apply preventive copper-based or Mancozeb fungicide in early mornings.',
      'Avoid overhead watering and apply mulch to prevent soil splashing.'
    ]
  },
  {
    id: 'demo-analysis-102',
    timestamp: new Date(Date.now() - 3600000 * 28).toISOString(),
    dateFormatted: new Date(Date.now() - 3600000 * 28).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }),
    cropName: 'Bell Pepper',
    diseaseName: 'Healthy Crop',
    status: 'healthy',
    confidence: 99.1,
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23062816"/><path d="M50 15 C20 40 25 80 50 85 C75 80 80 40 50 15 Z" fill="%2316a34a"/><path d="M50 15 Q45 5 40 5" stroke="%2322c55e" stroke-width="3" fill="none"/></svg>',
    message: 'Your Bell Pepper crop appears healthy with vibrant foliar vigor.',
    description: 'No pathogenic lesions, chlorosis, or fungal sporulation detected across foliage.',
    recommendations: [
      'Maintain current drip irrigation and fertigation schedule.',
      'Perform bi-weekly scouting for early aphid or whitefly presence.',
      'Ensure balanced potassium top-dressing during fruit set.'
    ]
  },
  {
    id: 'demo-analysis-103',
    timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
    dateFormatted: new Date(Date.now() - 3600000 * 72).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }),
    cropName: 'Corn (Maize)',
    diseaseName: 'Common Rust',
    status: 'diseased',
    confidence: 94.3,
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%231a2e05"/><ellipse cx="50" cy="50" rx="30" ry="40" fill="%2365a30d"/><circle cx="45" cy="40" r="5" fill="%23d97706"/><circle cx="55" cy="60" r="6" fill="%23b45309"/></svg>',
    message: 'Corn is affected by Common Rust (Puccinia sorghi).',
    description: 'Elongated golden-brown to cinnamon pustules rupturing upper and lower leaf epidermis.',
    recommendations: [
      'Spray triazole or azoxystrobin fungicide if pustules reach ear leaves before silking.',
      'Plant rust-tolerant hybrid cultivars in subsequent rotations.',
      'Avoid excessive nitrogen fertilizer application which promotes succulent vulnerable tissue.'
    ]
  }
];

// -------------------------------------------------------------------------
// Authentication Session
// -------------------------------------------------------------------------

export function getStoredAuth(): UserSession | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredAuth(user: UserSession, rememberMe: boolean = true): void {
  try {
    const payload = JSON.stringify(user);
    if (rememberMe) {
      localStorage.setItem(AUTH_KEY, payload);
    } else {
      sessionStorage.setItem(AUTH_KEY, payload);
    }
  } catch (e) {
    console.error('Failed to save auth session:', e);
  }
}

export function clearStoredAuth(): void {
  try {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
  } catch (e) {
    console.error('Failed to clear auth session:', e);
  }
}

// -------------------------------------------------------------------------
// Thumbnail Generator (Safely scales down to ~120px to prevent quota errors)
// -------------------------------------------------------------------------

export async function createSafeThumbnail(imageSource: string | File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const maxDim = 120;
      let w = img.width;
      let h = img.height;
      if (w > h) {
        if (w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        }
      } else {
        if (h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.70));
      } else {
        resolve(typeof imageSource === 'string' ? imageSource.slice(0, 500) : '');
      }
    };

    img.onerror = () => {
      resolve('');
    };

    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else {
      img.src = URL.createObjectURL(imageSource);
    }
  });
}

// -------------------------------------------------------------------------
// Crop Diagnosis History
// -------------------------------------------------------------------------

export function getCropHistory(): CropHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) {
      // Seed with initial realistic demo records
      localStorage.setItem(HISTORY_KEY, JSON.stringify(INITIAL_DEMO_HISTORY));
      return INITIAL_DEMO_HISTORY;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_DEMO_HISTORY;
  } catch (e) {
    console.error('Error reading crop history:', e);
    return INITIAL_DEMO_HISTORY;
  }
}

export async function saveCropDiagnosis(entry: {
  cropName: string;
  diseaseName: string;
  status: 'healthy' | 'diseased' | 'unknown';
  confidence: number;
  imageSource: string | File;
  message: string;
  description?: string;
  recommendations?: string[];
  gradCamOverlay?: string;
}): Promise<CropHistoryEntry> {
  const history = getCropHistory();
  const thumbnail = await createSafeThumbnail(entry.imageSource);

  const now = new Date();
  const newEntry: CropHistoryEntry = {
    id: `crop-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: now.toISOString(),
    dateFormatted: now.toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }),
    cropName: entry.cropName || 'Crop',
    diseaseName: entry.diseaseName || (entry.status === 'healthy' ? 'Healthy Foliage' : 'Unspecified Condition'),
    status: entry.status,
    confidence: entry.confidence,
    thumbnail: thumbnail || (typeof entry.imageSource === 'string' ? entry.imageSource : ''),
    message: entry.message,
    description: entry.description,
    recommendations: entry.recommendations,
    // GradCAM is saved only if short to avoid quota overflow
    gradCamOverlay: entry.gradCamOverlay && entry.gradCamOverlay.length < 50000 ? entry.gradCamOverlay : undefined
  };

  // Keep latest 50 entries
  const updated = [newEntry, ...history.filter(h => h.id !== newEntry.id)].slice(0, 50);

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('localStorage quota warning, trimming history:', err);
    // Trim to 15 latest entries if storage limit is near
    const trimmed = updated.slice(0, 15);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  }

  return newEntry;
}

export function deleteCropHistoryEntry(id: string): void {
  try {
    const history = getCropHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to delete history item:', e);
  }
}

export function clearCropHistory(): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
  } catch (e) {
    console.error('Failed to clear crop history:', e);
  }
}

// -------------------------------------------------------------------------
// Counters (Fertilizer, Yield)
// -------------------------------------------------------------------------

export function getFertilizerCounter(): number {
  try {
    const raw = localStorage.getItem(FERT_COUNTER_KEY);
    return raw ? parseInt(raw, 10) : 4; // default demo value
  } catch {
    return 4;
  }
}

export function incrementFertilizerCounter(): number {
  const current = getFertilizerCounter() + 1;
  try {
    localStorage.setItem(FERT_COUNTER_KEY, current.toString());
  } catch {}
  return current;
}

export function getYieldCounter(): number {
  try {
    const raw = localStorage.getItem(YIELD_COUNTER_KEY);
    return raw ? parseInt(raw, 10) : 3;
  } catch {
    return 3;
  }
}

export function incrementYieldCounter(): number {
  const current = getYieldCounter() + 1;
  try {
    localStorage.setItem(YIELD_COUNTER_KEY, current.toString());
  } catch {}
  return current;
}

// -------------------------------------------------------------------------
// Dynamic Dashboard Summary
// -------------------------------------------------------------------------

export function getDashboardSummary(): DashboardSummary {
  const history = getCropHistory();
  const total = history.length;
  const healthy = history.filter(h => h.status === 'healthy').length;
  const diseased = history.filter(h => h.status === 'diseased').length;
  const unknown = history.filter(h => h.status === 'unknown').length;
  const fertilizerCount = getFertilizerCounter();
  const yieldCount = getYieldCounter();

  const lastDate = history.length > 0 ? history[0].dateFormatted : null;
  const healthRatio = total > 0 ? Math.round((healthy / total) * 100) : 100;

  return {
    totalAnalyses: total,
    healthyCount: healthy,
    diseasedCount: diseased,
    unknownCount: unknown,
    fertilizerCount,
    yieldCount,
    lastAnalysisDate: lastDate,
    healthRatio
  };
}
