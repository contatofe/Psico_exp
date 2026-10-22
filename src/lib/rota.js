// Roteamento por hash (#/autor/b-f-skinner): funciona em qualquer hospedagem estática, sem configurar servidor.
import { useEffect, useState } from 'react';

export const link = (...partes) => '#/' + partes.join('/');

export function useRota() {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    const mudou = () => { setHash(location.hash); window.scrollTo(0, 0); };
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
