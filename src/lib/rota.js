// Roteamento por hash (#/autor/b-f-skinner): funciona em qualquer hospedagem estática, sem configurar servidor.
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

export const link = (...partes) => '#/' + partes.join('/');

const semMovimento = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useRota() {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    const mudou = () => {
      const aplicar = () => { flushSync(() => setHash(location.hash)); window.scrollTo(0, 0); };
      if (document.startViewTransition && !semMovimento()) document.startViewTransition(aplicar);
      else aplicar();
    };
    addEventListener('hashchange', mudou);
    return () => removeEventListener('hashchange', mudou);
  }, []);
  return hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
}

export function useTitulo(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} · Mapa Multinível` : 'Mapa Multinível · Comportamento e Cognição';
  }, [titulo]);
}
