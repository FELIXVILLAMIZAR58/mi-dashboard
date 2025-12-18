import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { 
  Truck, Search, DollarSign, 
  FileText, Users, Upload, 
  Database, Navigation, Clock, AlertCircle, Trash2
} from 'lucide-react';

const COLORS = [
  '#f97316', '#3b82f6', '#10b981', '#6366f1', '#ef4444', 
  '#8b5cf6', '#f59e0b', '#06b6d4', '#ec4899', '#94a3b8'
];

const App = () => {
  // Estado inicial: Carga desde LocalStorage para no perder datos al refrescar
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('inter_rapidisimo_data');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('Todos');
  const [showUpload, setShowUpload] = useState(data.length === 0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sincronización con el almacenamiento del navegador
  useEffect(() => {
    localStorage.setItem('inter_rapidisimo_data', JSON.stringify(data));
  }, [data]);

  const clearData = () => {
    if(window.confirm("¿Deseas borrar todos los datos cargados? Esta acción no se puede deshacer.")) {
      setData([]);
      setShowUpload(true);
    }
  };

  const getStatusStyle = (estado) => {
    const e = estado?.toLowerCase() || '';
    if (e.includes('entregado')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (e.includes('reparto')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (e.includes('transito')) return 'bg-orange-100 text-orange-700 border-orange-200';
    if (e.includes('archivada')) return 'bg-slate-100 text-slate-500 border-slate-200';
    if (e.includes('novedad')) return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-slate-50 text-slate-500 border-slate-100';
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (!files.length) return;

    setIsProcessing(true);
    let allProcessedData = [...data];
    let filesLoaded = 0;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split(/\r?\n/); 
        if (rows.length < 2) return;

        const headers = rows[0].split(',').map(h => h.replace(/"/g, '').trim());
        const idx = {
          guia: headers.indexOf('Numero Guia'),
          estado: headers.indexOf('Ultimo Estado del Envio'),
          manifiesto: headers.indexOf('Nro Manifiesto'),
          ruta: headers.indexOf('Ruta Manifiesto'),
          placa: headers.indexOf('Placa Vehiculo'),
          conductor: headers.indexOf('Nombre Conductor'),
          valor: headers.indexOf('Valor Comercial'),
          pago: headers.indexOf('Forma Pago'),
          fecha: headers.indexOf('Fecha Manifiesto')
        };

        const processedRows = rows.slice(1).map(row => {
          const cols = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || row.split(',');
          if (!cols || !cols[idx.guia]) return null;
          const clean = (val) => val ? val.replace(/"/g, '').trim() : '';

          return {
            guia: clean(cols[idx.guia]),
            estado: clean(cols[idx.estado]) || 'Sin Estado',
            manifiesto: clean(cols[idx.manifiesto]),
            ruta: clean(cols[idx.ruta]),
            placa: clean(cols[idx.placa]),
            conductor: clean(cols[idx.conductor]),
            valor: parseFloat(clean(cols[idx.valor])) || 0,
            pago: clean(cols[idx.pago]),
            fecha: clean(cols[idx.fecha])
          };
        }).filter(r => r && r.guia);

        allProcessedData = [...allProcessedData, ...processedRows];
        filesLoaded++;

        if (filesLoaded === files.length) {
          // Unificar por guía (evitar duplicados si subes el mismo archivo dos veces)
          const uniqueData = Array.from(new Map(allProcessedData.map(item => [item.guia, item])).values());
          setData(uniqueData);
          setIsProcessing(false);
          setShowUpload(false);
        }
      };
      reader.readAsText(file);
    });
  };

  const filteredData = useMemo(() => {
    const searchStr = searchTerm.toLowerCase();
    return data.filter(item => {
      const matchesSearch = item.guia.toLowerCase().includes(searchStr) || 
                           item.conductor.toLowerCase().includes(searchStr) || 
                           item.placa.toLowerCase().includes(searchStr);
      const matchesEstado = filterEstado === 'Todos' || item.estado === filterEstado;
      return matchesSearch && matchesEstado;
    });
  }, [data, searchTerm, filterEstado]);

  const stats = useMemo(() => ({
    total: filteredData.length,
    enProceso: filteredData.filter(d => !['Archivada', 'Entregado'].includes(d.estado)).length,
    valor: filteredData.reduce((acc, curr) => acc + curr.valor, 0),
    conductores: new Set(filteredData.map(d => d.conductor)).size
  }), [filteredData]);

  const chartData = useMemo(() => {
    const counts = {};
    filteredData.forEach(d => { counts[d.estado] = (counts[d.estado] || 0) + 1; });
    return Object.keys(counts).map(name => ({ name, value: counts[name] }))
      .sort((a, b) => b.value - a.value).slice(0, 8);
  }, [filteredData]);

  const formatCurrency = (val) => new Intl.NumberFormat('es-CO', { 
    style: 'currency', currency: 'COP', maximumFractionDigits: 0 
  }).format(val);

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans text-slate-900 pb-10">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-600 p-2 rounded-lg">
              <Truck className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-black italic tracking-tighter">
              INTER <span className="text-orange-600 not-italic">RAPIDÍSIMO</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowUpload(!showUpload)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all"
            >
              <Upload size={16} /> {isProcessing ? "Cargando..." : "Subir CSV"}
            </button>
            <button onClick={clearData} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {showUpload && (
          <div className="bg-white border-2 border-dashed border-orange-200 rounded-3xl p-10 text-center animate-in fade-in slide-in-from-top-4">
            <Database className="text-orange-600 w-10 h-10 mx-auto mb-3" />
            <h2 className="text-lg font-bold mb-1">Base de Datos Local</h2>
            <p className="text-slate-500 text-xs mb-6">Selecciona uno o varios archivos CSV de Inter Rapidísimo</p>
            <label className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold cursor-pointer hover:bg-black transition-all inline-block text-sm">
              <input type="file" multiple accept=".csv" className="hidden" onChange={handleFileUpload} />
              BUSCAR ARCHIVOS
            </label>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Guías" value={stats.total} color="orange" icon={<FileText size={16}/>} />
          <StatCard label="En Ruta" value={stats.enProceso} color="blue" icon={<Clock size={16}/>} />
          <StatCard label="Conductores" value={stats.conductores} color="emerald" icon={<Users size={16}/>} />
          <StatCard label="Total $" value={formatCurrency(stats.valor)} color="slate" icon={<DollarSign size={16}/>} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Distribución por Estado</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{fontSize: 10, fontWeight: 700}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={30}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Filtros y Búsqueda</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Guía, placa o nombre..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Estado</label>
                <select 
                  className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none"
                  onChange={(e) => setFilterEstado(e.target.value)}
                >
                  <option value="Todos">Todos</option>
                  {[...new Set(data.map(d => d.estado))].map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-50 flex items-start gap-3">
                <AlertCircle className="text-blue-500 shrink-0" size={16} />
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                  Los datos se procesan en tu navegador. No se guardan en la nube para proteger la privacidad de la empresa.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-tighter">
                  <th className="px-6 py-4">Información del Envío</th>
                  <th className="px-6 py-4">Estado Actual</th>
                  <th className="px-6 py-4">Logística</th>
                  <th className="px-6 py-4 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.slice(0, 100).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-xs">#{row.guia}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{row.fecha}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getStatusStyle(row.estado)}`}>
                        {row.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
                         {row.conductor}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Navigation size={10} /> {row.placa}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-xs font-bold">
                      {formatCurrency(row.valor)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredData.length > 100 && (
            <div className="p-4 bg-slate-50 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Mostrando los primeros 100 de {filteredData.length} registros
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ label, value, color, icon }) => {
  const colors = {
    orange: 'text-orange-600',
    blue: 'text-blue-600',
    emerald: 'text-emerald-600',
    slate: 'text-slate-900'
  };
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-2 text-slate-400">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-tight">{label}</span>
      </div>
      <div className={`text-lg font-black truncate ${colors[color]}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  );
};

export default App;
