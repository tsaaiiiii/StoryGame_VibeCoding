export type ThemeKey = 'wuxia' | 'detective' | 'apocalypse' | 'school';

type ThemeAsset = {
  gradient: string;
  imageUrl: string;
  baseColor: string;
  textColor: string;
  scrimStart: string;
  scrimEnd: string;
  imageOpacity: string;
};

export const themeBackgrounds: Record<ThemeKey, ThemeAsset> = {
  wuxia: {
    gradient: 'linear-gradient(135deg, #E6D5C3 0%, #D4BBA4 100%)',
    imageUrl: 'https://images.unsplash.com/photo-1500534314209-4186bf10ae0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    baseColor: '#F7EFE5',
    textColor: '#5C5145',
    scrimStart: 'rgba(247, 239, 229, 0.88)',
    scrimEnd: 'rgba(247, 239, 229, 0.85)',
    imageOpacity: '0.42',
  },
  detective: {
    gradient: 'linear-gradient(135deg, #C8C3B9 0%, #9F988B 100%)',
    imageUrl: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=2000&q=80',
    baseColor: '#F0ECE6',
    textColor: '#4C433A',
    scrimStart: 'rgba(240, 236, 230, 0.9)',
    scrimEnd: 'rgba(223, 218, 209, 0.86)',
    imageOpacity: '0.40',
  },
  apocalypse: {
    gradient: 'linear-gradient(135deg, #C2B8A3 0%, #A39B8B 100%)',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-04d1e6f58a8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    baseColor: '#EDE7DE',
    textColor: '#51493E',
    scrimStart: 'rgba(237, 231, 222, 0.88)',
    scrimEnd: 'rgba(214, 206, 192, 0.84)',
    imageOpacity: '0.36',
  },
  school: {
    gradient: 'linear-gradient(135deg, #F4EAE2 0%, #E8D3C1 100%)',
    imageUrl: 'https://images.unsplash.com/photo-1582719478442-74f570122068?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    baseColor: '#FAF0E8',
    textColor: '#5A4E44',
    scrimStart: 'rgba(250, 240, 232, 0.9)',
    scrimEnd: 'rgba(240, 222, 208, 0.86)',
    imageOpacity: '0.38',
  },
};

const preloadedImages = new Map<string, Promise<void>>();

export function preloadThemeBackground(theme: ThemeKey): Promise<void> {
  const asset = themeBackgrounds[theme];
  if (!asset) {
    return Promise.resolve();
  }
  if (typeof window === 'undefined' || typeof window.Image === 'undefined') {
    return Promise.resolve();
  }
  const { imageUrl } = asset;
  if (!imageUrl) {
    return Promise.resolve();
  }
  if (preloadedImages.has(imageUrl)) {
    return preloadedImages.get(imageUrl)!;
  }
  const promise = new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = imageUrl;
  });
  preloadedImages.set(imageUrl, promise);
  return promise;
}
