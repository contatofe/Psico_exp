// Roteamento por hash (#/autor/b-f-skinner): funciona em qualquer hospedagem estática, sem configurar servidor.
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

export const link = (...partes) => '#/' + partes.join('/');

const semMovimento = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useRota() {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    let teclado = false;
    const porTeclado = () => { teclado = true; };
    const porPonteiro = () => { teclado = false; };
    const mudou = () => {
      const aplicar = () => { flushSync(() => setHash(location.hash)); window.scrollTo(0, 0); document.getElementById('conteudo')?.focus({ preventScroll: true }); };
      if (document.startViewTransition && !semMovimento() && !teclado) document.startViewTransition(aplicar);
      else aplicar();
    };
    addEventListener('keydown', porTeclado);
    addEventListener('pointerdown', porPonteiro);
    addEventListener('hashchange', mudou);
    return () => { removeEventListener('hashchange', mudou); removeEventListener('keydown', porTeclado); removeEventListener('pointerdown', porPonteiro); };
  }, []);
  return hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
}

export function useTitulo(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} · Mapa Multinível` : 'Mapa Multinível · Comportamento e Cognição';
  }, [titulo]);
}
