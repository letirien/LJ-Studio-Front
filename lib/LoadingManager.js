'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const LoadingContext = createContext(null);

// Pondérations pour chaque type de ressource
const WEIGHTS = {
  DATA: 30,           // Données de getServerSideProps
  WEBGL_TEXTURES: 45, // Textures WebGL du header
  PAGE_IMAGES: 15,    // Autres images de la page
  EFFECTS_READY: 10,  // GSAP, ScrollTrigger, effets prêts
};

export function LoadingProvider({ children }) {
  const [progress, setProgress] = useState(0);
  const [loadingStages, setLoadingStages] = useState({
    data: 0,
    webglTextures: 0,
    pageImages: 0,
    effectsReady: 0,
  });
  const [isComplete, setIsComplete] = useState(false);

  // Calcule le pourcentage total basé sur les poids
  const calculateTotalProgress = useCallback((stages) => {
    const total =
      (stages.data / 100) * WEIGHTS.DATA +
      (stages.webglTextures / 100) * WEIGHTS.WEBGL_TEXTURES +
      (stages.pageImages / 100) * WEIGHTS.PAGE_IMAGES +
      (stages.effectsReady / 100) * WEIGHTS.EFFECTS_READY;

    return Math.min(100, Math.round(total));
  }, []);

  // Met à jour une étape spécifique
  const updateStage = useCallback((stageName, value) => {
    setLoadingStages((prev) => {
      const newStages = {
        ...prev,
        [stageName]: Math.min(100, Math.max(0, value)),
      };

      const totalProgress = calculateTotalProgress(newStages);
      setProgress(totalProgress);

      // Marquer comme complet si on atteint 100%
      if (totalProgress >= 100) {
        setIsComplete(true);
      }

      return newStages;
    });
  }, [calculateTotalProgress]);

  // Utilitaires pour chaque type de ressource
  const setDataLoaded = useCallback(() => {
    updateStage('data', 100);
  }, [updateStage]);

  const setWebGLProgress = useCallback((loaded, total) => {
    const percentage = total > 0 ? (loaded / total) * 100 : 0;
    updateStage('webglTextures', percentage);
  }, [updateStage]);

  const setPageImagesProgress = useCallback((loaded, total) => {
    const percentage = total > 0 ? (loaded / total) * 100 : 0;
    updateStage('pageImages', percentage);
  }, [updateStage]);

  const setEffectsReady = useCallback(() => {
    updateStage('effectsReady', 100);
  }, [updateStage]);

  // Reset pour développement/navigation
  const reset = useCallback(() => {
    setProgress(0);
    setLoadingStages({
      data: 0,
      webglTextures: 0,
      pageImages: 0,
      effectsReady: 0,
    });
    setIsComplete(false);
  }, []);

  const value = {
    progress,
    loadingStages,
    isComplete,
    setDataLoaded,
    setWebGLProgress,
    setPageImagesProgress,
    setEffectsReady,
    updateStage,
    reset,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
}

// Hook pour tracker automatiquement les images d'une page
export function useImageLoader(imageUrls = []) {
  const { setPageImagesProgress } = useLoading();
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) {
      setPageImagesProgress(0, 0);
      return;
    }

    let loadedCount = 0;
    const total = imageUrls.length;
    const images = [];

    imageUrls.forEach((url) => {
      const img = new Image();

      const onLoad = () => {
        loadedCount++;
        setLoaded(loadedCount);
        setPageImagesProgress(loadedCount, total);
      };

      const onError = () => {
        loadedCount++;
        setLoaded(loadedCount);
        setPageImagesProgress(loadedCount, total);
        console.warn(`Failed to load image: ${url}`);
      };

      img.addEventListener('load', onLoad);
      img.addEventListener('error', onError);
      img.src = url;

      images.push({ img, onLoad, onError });
    });

    return () => {
      images.forEach(({ img, onLoad, onError }) => {
        img.removeEventListener('load', onLoad);
        img.removeEventListener('error', onError);
      });
    };
  }, [imageUrls.join('|'), setPageImagesProgress]);

  return { loaded, total: imageUrls.length };
}
