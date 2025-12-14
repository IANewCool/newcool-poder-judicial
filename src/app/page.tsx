'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Tipos de tribunal
const TIPOS_TRIBUNAL = [
  { id: 'civil', nombre: 'Juzgado Civil', icon: '⚖️', color: 'from-blue-500 to-indigo-600' },
  { id: 'penal', nombre: 'Juzgado de Garantia', icon: '🔨', color: 'from-red-500 to-rose-600' },
  { id: 'familia', nombre: 'Tribunal de Familia', icon: '👨‍👩‍👧', color: 'from-pink-500 to-purple-600' },
  { id: 'laboral', nombre: 'Juzgado del Trabajo', icon: '👷', color: 'from-orange-500 to-amber-600' },
  { id: 'cobranza', nombre: 'Juzgado de Cobranza', icon: '💰', color: 'from-green-500 to-emerald-600' },
  { id: 'top', nombre: 'Tribunal Oral Penal', icon: '🏛️', color: 'from-slate-600 to-gray-700' }
];

// Estados de causa
const ESTADOS_CAUSA = {
  tramitacion: { nombre: 'En Tramitacion', color: 'bg-blue-500', icon: '📋' },
  sentencia: { nombre: 'Con Sentencia', color: 'bg-green-500', icon: '✅' },
  apelacion: { nombre: 'En Apelacion', color: 'bg-yellow-500', icon: '📤' },
  archivada: { nombre: 'Archivada', color: 'bg-gray-500', icon: '📁' },
  ejecutoria: { nombre: 'En Ejecutoria', color: 'bg-purple-500', icon: '⚡' }
};

// Causas de ejemplo para demostración
const CAUSAS_EJEMPLO = [
  {
    rit: 'C-1234-2024',
    ruc: '2400123456-7',
    tribunal: 'civil',
    tribunalNombre: '1° Juzgado Civil de Santiago',
    caratula: 'GONZALEZ / BANCO ESTADO',
    materia: 'Cobro de Pesos',
    estado: 'tramitacion',
    fechaIngreso: '2024-03-15',
    ultimoMovimiento: '2024-11-20',
    etapa: 'Periodo de Prueba',
    cuantia: '$15.000.000'
  },
  {
    rit: 'F-5678-2024',
    ruc: '2400567890-1',
    tribunal: 'familia',
    tribunalNombre: 'Tribunal de Familia de Providencia',
    caratula: 'MUÑOZ / PEREZ',
    materia: 'Alimentos Mayores',
    estado: 'sentencia',
    fechaIngreso: '2024-01-10',
    ultimoMovimiento: '2024-10-05',
    etapa: 'Causa Terminada',
    cuantia: '$400.000 mensuales'
  },
  {
    rit: 'O-9012-2024',
    ruc: '2400901234-5',
    tribunal: 'laboral',
    tribunalNombre: '2° Juzgado de Letras del Trabajo de Santiago',
    caratula: 'SILVA / EMPRESA XYZ LTDA',
    materia: 'Despido Injustificado',
    estado: 'apelacion',
    fechaIngreso: '2024-05-22',
    ultimoMovimiento: '2024-12-01',
    etapa: 'Recurso en Corte de Apelaciones',
    cuantia: '$8.500.000'
  },
  {
    rit: 'RIT-3456-2024',
    ruc: '2400345678-9',
    tribunal: 'penal',
    tribunalNombre: '7° Juzgado de Garantia de Santiago',
    caratula: 'MINISTERIO PUBLICO / RODRIGUEZ',
    materia: 'Hurto Simple',
    estado: 'tramitacion',
    fechaIngreso: '2024-08-12',
    ultimoMovimiento: '2024-11-28',
    etapa: 'Investigacion Formalizada',
    cuantia: 'N/A'
  }
];

// Estructura judicial
const ESTRUCTURA_JUDICIAL = [
  {
    nivel: 1,
    nombre: 'Corte Suprema',
    descripcion: 'Maximo tribunal del pais. Conoce recursos de casacion y queja.',
    icon: '🏛️',
    sede: 'Santiago'
  },
  {
    nivel: 2,
    nombre: 'Cortes de Apelaciones',
    descripcion: '17 cortes en el pais. Conocen recursos de apelacion.',
    icon: '⚖️',
    sede: '17 ciudades'
  },
  {
    nivel: 3,
    nombre: 'Juzgados de Primera Instancia',
    descripcion: 'Civiles, Penales, Familia, Laborales, Cobranza.',
    icon: '🔨',
    sede: 'Todo Chile'
  }
];

// Portales oficiales
const PORTALES = [
  {
    nombre: 'Consulta de Causas',
    url: 'https://oficinajudicialvirtual.pjud.cl',
    descripcion: 'Portal oficial para consultar el estado de tus causas',
    icon: '🔍'
  },
  {
    nombre: 'Oficina Judicial Virtual',
    url: 'https://oficinajudicialvirtual.pjud.cl',
    descripcion: 'Tramitacion electronica de causas',
    icon: '💻'
  },
  {
    nombre: 'Agenda de Audiencias',
    url: 'https://www.pjud.cl',
    descripcion: 'Consulta fechas de audiencias programadas',
    icon: '📅'
  },
  {
    nombre: 'Verificacion de Documentos',
    url: 'https://verificadoc.pjud.cl',
    descripcion: 'Verifica autenticidad de documentos judiciales',
    icon: '✅'
  }
];

type Vista = 'buscar' | 'estructura' | 'portales' | 'guia';

interface Causa {
  rit: string;
  ruc: string;
  tribunal: string;
  tribunalNombre: string;
  caratula: string;
  materia: string;
  estado: string;
  fechaIngreso: string;
  ultimoMovimiento: string;
  etapa: string;
  cuantia: string;
}

export default function PoderJudicial() {
  const [vista, setVista] = useState<Vista>('buscar');
  const [tipoBusqueda, setTipoBusqueda] = useState<'rit' | 'ruc' | 'rut'>('rit');
  const [valorBusqueda, setValorBusqueda] = useState('');
  const [filtroTribunal, setFiltroTribunal] = useState<string>('todos');
  const [resultados, setResultados] = useState<Causa[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [causaSeleccionada, setCausaSeleccionada] = useState<Causa | null>(null);

  const realizarBusqueda = () => {
    if (!valorBusqueda.trim()) return;

    setBuscando(true);
    setCausaSeleccionada(null);

    // Simular búsqueda con delay
    setTimeout(() => {
      let resultadosFiltrados = CAUSAS_EJEMPLO;

      // Filtrar por tipo de tribunal
      if (filtroTribunal !== 'todos') {
        resultadosFiltrados = resultadosFiltrados.filter(c => c.tribunal === filtroTribunal);
      }

      // Simular coincidencia parcial
      const valorLower = valorBusqueda.toLowerCase();
      resultadosFiltrados = resultadosFiltrados.filter(c =>
        c.rit.toLowerCase().includes(valorLower) ||
        c.ruc.toLowerCase().includes(valorLower) ||
        c.caratula.toLowerCase().includes(valorLower)
      );

      // Si no hay coincidencias, mostrar algunos resultados de demo
      if (resultadosFiltrados.length === 0 && valorBusqueda.length >= 2) {
        resultadosFiltrados = filtroTribunal === 'todos'
          ? CAUSAS_EJEMPLO.slice(0, 2)
          : CAUSAS_EJEMPLO.filter(c => c.tribunal === filtroTribunal).slice(0, 1);
      }

      setResultados(resultadosFiltrados);
      setBuscando(false);
    }, 800);
  };

  const renderBuscador = () => (
    <div className="space-y-6">
      {/* Formulario de búsqueda */}
      <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🔍</span> Buscar Causa
        </h3>

        {/* Tipo de búsqueda */}
        <div className="flex gap-2 mb-4">
          {[
            { id: 'rit', label: 'RIT', desc: 'Rol Interno Tribunal' },
            { id: 'ruc', label: 'RUC', desc: 'Rol Unico Causa' },
            { id: 'rut', label: 'Caratula', desc: 'Nombre de partes' }
          ].map((tipo) => (
            <button
              key={tipo.id}
              onClick={() => setTipoBusqueda(tipo.id as 'rit' | 'ruc' | 'rut')}
              className={`flex-1 py-3 px-4 rounded-xl transition-all ${
                tipoBusqueda === tipo.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <div className="font-bold">{tipo.label}</div>
              <div className="text-xs opacity-70">{tipo.desc}</div>
            </button>
          ))}
        </div>

        {/* Campo de búsqueda */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={valorBusqueda}
            onChange={(e) => setValorBusqueda(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && realizarBusqueda()}
            placeholder={
              tipoBusqueda === 'rit' ? 'Ej: C-1234-2024' :
              tipoBusqueda === 'ruc' ? 'Ej: 2400123456-7' :
              'Ej: GONZALEZ / BANCO'
            }
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={realizarBusqueda}
            disabled={buscando}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white font-bold rounded-xl transition-all flex items-center gap-2"
          >
            {buscando ? (
              <>
                <span className="animate-spin">⏳</span> Buscando...
              </>
            ) : (
              <>
                <span>🔍</span> Buscar
              </>
            )}
          </button>
        </div>

        {/* Filtro por tribunal */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Filtrar por tribunal:</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroTribunal('todos')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                filtroTribunal === 'todos'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Todos
            </button>
            {TIPOS_TRIBUNAL.map((tipo) => (
              <button
                key={tipo.id}
                onClick={() => setFiltroTribunal(tipo.id)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  filtroTribunal === tipo.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {tipo.icon} {tipo.nombre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resultados */}
      <AnimatePresence mode="wait">
        {resultados.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📋</span> {resultados.length} causa(s) encontrada(s)
              <span className="text-sm font-normal text-gray-400 ml-2">(Datos de demostración)</span>
            </h3>

            {resultados.map((causa, index) => (
              <motion.div
                key={causa.rit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setCausaSeleccionada(causa)}
                className={`bg-white/10 backdrop-blur rounded-xl p-4 border cursor-pointer transition-all hover:bg-white/15 ${
                  causaSeleccionada?.rit === causa.rit
                    ? 'border-blue-500 ring-2 ring-blue-500/50'
                    : 'border-white/20'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-blue-400 font-mono font-bold">{causa.rit}</span>
                    <span className="text-gray-500 mx-2">|</span>
                    <span className="text-gray-400 font-mono text-sm">{causa.ruc}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${ESTADOS_CAUSA[causa.estado as keyof typeof ESTADOS_CAUSA].color}`}>
                    <span>{ESTADOS_CAUSA[causa.estado as keyof typeof ESTADOS_CAUSA].icon}</span>
                    {ESTADOS_CAUSA[causa.estado as keyof typeof ESTADOS_CAUSA].nombre}
                  </div>
                </div>

                <h4 className="text-white font-bold mb-2">{causa.caratula}</h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Materia</span>
                    <p className="text-gray-300">{causa.materia}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Tribunal</span>
                    <p className="text-gray-300">{causa.tribunalNombre}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Etapa</span>
                    <p className="text-gray-300">{causa.etapa}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Ultimo Movimiento</span>
                    <p className="text-gray-300">{causa.ultimoMovimiento}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detalle de causa seleccionada */}
      <AnimatePresence>
        {causaSeleccionada && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl p-6 border border-blue-500/30"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">Detalle de Causa</h3>
              <button
                onClick={() => setCausaSeleccionada(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-sm text-gray-400 mb-2">Identificacion</h4>
                  <p className="text-white"><strong>RIT:</strong> {causaSeleccionada.rit}</p>
                  <p className="text-white"><strong>RUC:</strong> {causaSeleccionada.ruc}</p>
                  <p className="text-white"><strong>Caratula:</strong> {causaSeleccionada.caratula}</p>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-sm text-gray-400 mb-2">Tribunal</h4>
                  <p className="text-white">{causaSeleccionada.tribunalNombre}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-sm text-gray-400 mb-2">Estado Procesal</h4>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${ESTADOS_CAUSA[causaSeleccionada.estado as keyof typeof ESTADOS_CAUSA].color}`}>
                    <span>{ESTADOS_CAUSA[causaSeleccionada.estado as keyof typeof ESTADOS_CAUSA].icon}</span>
                    {ESTADOS_CAUSA[causaSeleccionada.estado as keyof typeof ESTADOS_CAUSA].nombre}
                  </div>
                  <p className="text-gray-300 mt-2">Etapa: {causaSeleccionada.etapa}</p>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-sm text-gray-400 mb-2">Fechas</h4>
                  <p className="text-white"><strong>Ingreso:</strong> {causaSeleccionada.fechaIngreso}</p>
                  <p className="text-white"><strong>Ultimo movimiento:</strong> {causaSeleccionada.ultimoMovimiento}</p>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-sm text-gray-400 mb-2">Cuantia</h4>
                  <p className="text-white font-bold text-lg">{causaSeleccionada.cuantia}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
              <p className="text-yellow-200 text-sm flex items-start gap-2">
                <span>⚠️</span>
                <span>
                  Para ver el expediente completo, movimientos y resoluciones,
                  accede a la <a href="https://oficinajudicialvirtual.pjud.cl" target="_blank" className="underline font-bold">Oficina Judicial Virtual</a> con tu ClaveUnica.
                </span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mensaje cuando no hay búsqueda */}
      {resultados.length === 0 && !buscando && (
        <div className="bg-white/5 rounded-xl p-8 text-center">
          <span className="text-6xl mb-4 block">🔍</span>
          <h3 className="text-xl font-bold text-white mb-2">Busca tu causa</h3>
          <p className="text-gray-400 mb-4">
            Ingresa el RIT, RUC o nombre de las partes para encontrar una causa judicial.
          </p>
          <p className="text-sm text-gray-500">
            Este es un buscador de demostración. Para consultas reales usa la
            <a href="https://oficinajudicialvirtual.pjud.cl" target="_blank" className="text-blue-400 hover:underline ml-1">
              Oficina Judicial Virtual
            </a>
          </p>
        </div>
      )}
    </div>
  );

  const renderEstructura = () => (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span>🏛️</span> Estructura del Poder Judicial
        </h3>

        {/* Piramide judicial */}
        <div className="space-y-4">
          {ESTRUCTURA_JUDICIAL.map((nivel, i) => (
            <motion.div
              key={nivel.nivel}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-xl border ${
                nivel.nivel === 1 ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30' :
                nivel.nivel === 2 ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-500/30' :
                'bg-white/10 border-white/20'
              }`}
              style={{ marginLeft: `${(nivel.nivel - 1) * 20}px` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{nivel.icon}</span>
                <div>
                  <h4 className="text-white font-bold">{nivel.nombre}</h4>
                  <p className="text-sm text-gray-400">{nivel.sede}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">{nivel.descripcion}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tipos de tribunal */}
      <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>⚖️</span> Tipos de Tribunales
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TIPOS_TRIBUNAL.map((tipo, i) => (
            <motion.div
              key={tipo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-xl bg-gradient-to-br ${tipo.color}`}
            >
              <span className="text-3xl mb-2 block">{tipo.icon}</span>
              <h4 className="text-white font-bold">{tipo.nombre}</h4>
              <p className="text-white/70 text-sm mt-1">
                {tipo.id === 'civil' && 'Demandas civiles, cobranzas, arriendos'}
                {tipo.id === 'penal' && 'Control de investigacion, medidas cautelares'}
                {tipo.id === 'familia' && 'Alimentos, custodia, violencia intrafamiliar'}
                {tipo.id === 'laboral' && 'Despidos, derechos laborales, accidentes'}
                {tipo.id === 'cobranza' && 'Cobranza laboral y previsional'}
                {tipo.id === 'top' && 'Juicios orales en materia penal'}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cortes de Apelaciones */}
      <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🗺️</span> Cortes de Apelaciones en Chile
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {[
            'Arica', 'Iquique', 'Antofagasta', 'Copiapo', 'La Serena',
            'Valparaiso', 'Santiago', 'San Miguel', 'Rancagua', 'Talca',
            'Chillan', 'Concepcion', 'Temuco', 'Valdivia', 'Puerto Montt',
            'Coyhaique', 'Punta Arenas'
          ].map((ciudad) => (
            <div
              key={ciudad}
              className="px-3 py-2 bg-white/10 rounded-lg text-center text-sm text-gray-300"
            >
              {ciudad}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPortales = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {PORTALES.map((portal, i) => (
          <motion.a
            key={portal.nombre}
            href={portal.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all group"
          >
            <span className="text-4xl mb-3 block">{portal.icon}</span>
            <h3 className="text-white font-bold mb-2 group-hover:text-blue-400 transition-colors">
              {portal.nombre}
            </h3>
            <p className="text-gray-400 text-sm">{portal.descripcion}</p>
            <div className="mt-4 text-blue-400 text-sm flex items-center gap-1">
              Ir al portal <span>→</span>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Acceso con ClaveUnica */}
      <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl p-6 border border-blue-500/30">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🔐</span> Acceso con ClaveUnica
        </h3>
        <p className="text-gray-300 mb-4">
          Para acceder a la Oficina Judicial Virtual y consultar tus causas necesitas ClaveUnica.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <span className="text-2xl mb-2 block">1️⃣</span>
            <h4 className="text-white font-bold mb-1">Obtener ClaveUnica</h4>
            <p className="text-sm text-gray-400">En el Registro Civil o en claveunica.gob.cl</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <span className="text-2xl mb-2 block">2️⃣</span>
            <h4 className="text-white font-bold mb-1">Ingresar al Portal</h4>
            <p className="text-sm text-gray-400">oficinajudicialvirtual.pjud.cl</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <span className="text-2xl mb-2 block">3️⃣</span>
            <h4 className="text-white font-bold mb-1">Consultar Causas</h4>
            <p className="text-sm text-gray-400">Busca por RIT, RUC o tu RUT</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGuia = () => (
    <div className="space-y-6">
      {/* Glosario */}
      <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>📖</span> Glosario de Terminos
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            { termino: 'RIT', definicion: 'Rol Interno del Tribunal. Identificador unico dentro de cada tribunal.' },
            { termino: 'RUC', definicion: 'Rol Unico de Causa. Codigo nacional que identifica la causa en todo Chile.' },
            { termino: 'Caratula', definicion: 'Nombre de las partes: DEMANDANTE / DEMANDADO o similar.' },
            { termino: 'Cuaderno', definicion: 'Division del expediente (principal, incidentes, medidas cautelares).' },
            { termino: 'Resolucion', definicion: 'Decision del juez: decreto, auto, sentencia interlocutoria o definitiva.' },
            { termino: 'Notificacion', definicion: 'Comunicacion oficial de resoluciones a las partes.' },
            { termino: 'Apelacion', definicion: 'Recurso para que un tribunal superior revise la decision.' },
            { termino: 'Ejecutoria', definicion: 'Etapa de cumplimiento forzado de la sentencia.' }
          ].map((item) => (
            <div key={item.termino} className="bg-white/5 rounded-lg p-4">
              <h4 className="text-blue-400 font-bold mb-1">{item.termino}</h4>
              <p className="text-gray-300 text-sm">{item.definicion}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Plazos comunes */}
      <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>⏰</span> Plazos Procesales Comunes
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4 text-gray-400">Actuacion</th>
                <th className="text-left py-3 px-4 text-gray-400">Plazo</th>
                <th className="text-left py-3 px-4 text-gray-400">Tipo</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {[
                { actuacion: 'Contestar demanda civil', plazo: '15 dias', tipo: 'Fatal' },
                { actuacion: 'Apelar sentencia civil', plazo: '10 dias', tipo: 'Fatal' },
                { actuacion: 'Recurso de reposicion', plazo: '5 dias', tipo: 'Fatal' },
                { actuacion: 'Recurso de casacion', plazo: '15 dias', tipo: 'Fatal' },
                { actuacion: 'Contestar demanda laboral', plazo: 'En audiencia', tipo: 'Oral' },
                { actuacion: 'Apelar sentencia laboral', plazo: '10 dias', tipo: 'Fatal' },
                { actuacion: 'Recurso proteccion', plazo: '30 dias corridos', tipo: 'Fatal' },
                { actuacion: 'Recurso amparo', plazo: 'Inmediato', tipo: 'Urgente' }
              ].map((item, i) => (
                <tr key={i} className="border-b border-white/10">
                  <td className="py-3 px-4">{item.actuacion}</td>
                  <td className="py-3 px-4 font-mono text-blue-400">{item.plazo}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.tipo === 'Fatal' ? 'bg-red-500/20 text-red-300' :
                      item.tipo === 'Urgente' ? 'bg-orange-500/20 text-orange-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {item.tipo}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          * Los plazos de dias se cuentan en dias habiles, salvo indicacion expresa de dias corridos.
        </p>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl p-6 border border-green-500/30">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>💡</span> Tips para tu Causa
        </h3>

        <div className="space-y-3">
          {[
            'Revisa tu causa al menos una vez por semana en la Oficina Judicial Virtual',
            'Guarda el RIT y RUC de tu causa en un lugar seguro',
            'Las notificaciones electronicas tienen el mismo valor que las presenciales',
            'Si no tienes abogado, puedes solicitar uno en la CAJ de tu comuna',
            'Los plazos fatales no se suspenden por ningun motivo',
            'Puedes solicitar copias simples o autorizadas de tu expediente'
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-green-400">✓</span>
              <p className="text-gray-300 text-sm">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-6xl mb-4 block">⚖️</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Poder <span className="text-blue-400">Judicial</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Busca el estado de tus causas y conoce la estructura judicial de Chile
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <span className="px-4 py-2 bg-white/10 rounded-full text-sm text-gray-300">
                🔍 Buscador de Causas
              </span>
              <span className="px-4 py-2 bg-white/10 rounded-full text-sm text-gray-300">
                🏛️ Estructura Judicial
              </span>
              <span className="px-4 py-2 bg-white/10 rounded-full text-sm text-gray-300">
                📖 Guia Procesal
              </span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {[
              { id: 'buscar', label: 'Buscar Causa', icon: '🔍' },
              { id: 'estructura', label: 'Estructura', icon: '🏛️' },
              { id: 'portales', label: 'Portales', icon: '💻' },
              { id: 'guia', label: 'Guia', icon: '📖' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setVista(tab.id as Vista)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  vista === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={vista}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {vista === 'buscar' && renderBuscador()}
            {vista === 'estructura' && renderEstructura()}
            {vista === 'portales' && renderPortales()}
            {vista === 'guia' && renderGuia()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            Poder Judicial - Modulo de{' '}
            <a href="https://newcool-informada.vercel.app" className="text-blue-400 hover:underline">
              NewCooltura Informada
            </a>
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Portal educativo. Para consultas oficiales: oficinajudicialvirtual.pjud.cl
          </p>
        </div>
      </footer>
    </div>
  );
}
