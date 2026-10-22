import { useTitulo } from '../lib/rota';
import { Mapa } from '../componentes/Mapa';

export default function Inicio() {
  useTitulo('');
  return <div className="inicio"><Mapa /></div>;
}
