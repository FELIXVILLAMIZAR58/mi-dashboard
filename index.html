<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Inter Rapidísimo</title>
    
    <!-- 1. Tailwind para estilos -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- 2. React (Debe cargarse PRIMERO) -->
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    
    <!-- 3. Prop-Types (Requerido por Recharts en modo UMD) -->
    <script src="https://unpkg.com/prop-types@15.8.1/prop-types.min.js"></script>
    
    <!-- 4. Recharts (Depende de React y Prop-Types cargados arriba) -->
    <script src="https://unpkg.com/recharts@2.12.7/umd/Recharts.js"></script>
    
    <!-- 5. Otros complementos -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    </style>
</head>
<body class="bg-[#F8FAFC]">
    <div id="root"></div>

    <script type="text/babel">
        // Extraemos los componentes de las librerías globales
        const { useState, useMemo, useEffect } = React;
        const { 
            BarChart, Bar, XAxis, YAxis, CartesianGrid, 
            Tooltip, ResponsiveContainer, Cell 
        } = Recharts;

        // Componente de Iconos compatible con Lucide CDN
        const Icon = ({ name, size = 18, className = "" }) => {
            useEffect(() => {
                if (window.lucide) window.lucide.createIcons();
            }, [name]);
            return <i data-lucide={name} style={{ width: size, height: size }} className={className}></i>;
        };

        const COLORS = ['#f97316', '#3b82f6', '#10b981', '#6366f1', '#ef4444', '#8b5cf6'];

        const App = () => {
            const [data, setData] = useState(() => {
                const saved = localStorage.getItem('inter_rapidisimo_v2');
                return saved ? JSON.parse(saved) : [];
            });
            const [searchTerm, setSearchTerm] = useState('');
            const [filterEstado, setFilterEstado] = useState('Todos');

            useEffect(() => {
                localStorage.setItem('inter_rapidisimo_v2', JSON.stringify(data));
                if (window.lucide) window.lucide.createIcons();
            }, [data]);

            const handleFileUpload = (event) => {
                const files = event.target.files;
                if (!files.length) return;

                Array.from(files).forEach(file => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const text = e.target.result;
                        const rows = text.split(/\r?\n/);
                        if (rows.length < 1) return;
                        
                        const headers = rows[0].split(',').map(h => h.replace(/"/g, '').trim());
                        
                        const idx = {
                            guia: headers.indexOf('Numero Guia'),
                            estado: headers.indexOf('Ultimo Estado del Envio'),
                            conductor: headers.indexOf('Nombre Conductor'),
                            valor: headers.indexOf('Valor Comercial'),
                            placa: headers.indexOf('Placa Vehiculo'),
                            manifiesto: headers.indexOf('Nro Manifiesto'),
                            fecha: headers.indexOf('Fecha Manifiesto')
                        };

                        const processedRows = rows.slice(1).map(row => {
                            const cols = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || row.split(',');
                            if (!cols || !cols[idx.guia]) return null;
                            const clean = (val) => val ? val.replace(/"/g, '').trim() : '';
                            return {
                                guia: clean(cols[idx.guia]),
                                estado: clean(cols[idx.estado]) || 'Sin Estado',
                                conductor: clean(cols[idx.conductor]),
                                placa: clean(cols[idx.placa]),
                                manifiesto: clean(cols[idx.manifiesto]),
                                valor: parseFloat(clean(cols[idx.valor])) || 0,
                                fecha: clean(cols[idx.fecha])
                            };
                        }).filter(r => r && r.guia);

                        setData(prev => {
                            const combined = [...prev, ...processedRows];
                            return Array.from(new Map(combined.map(item => [item.guia, item])).values());
                        });
                    };
                    reader.readAsText(file);
                });
            };

            const filteredData = useMemo(() => {
                return data.filter(item => {
                    const search = searchTerm.toLowerCase();
                    const matchesSearch = item.guia.includes(searchTerm) || 
                                         item.conductor.toLowerCase().includes(search) ||
                                         item.placa.toLowerCase().includes(search);
                    const matchesEstado = filterEstado === 'Todos' || item.estado === filterEstado;
                    return matchesSearch && matchesEstado;
                });
            }, [data, searchTerm, filterEstado]);

            const stats = useMemo(() => ({
                total: filteredData.length,
                valor: filteredData.reduce((acc, curr) => acc + curr.valor, 0),
                conductores: new Set(filteredData.map(d => d.conductor)).size
            }), [filteredData]);

            const chartData = useMemo(() => {
                const counts = {};
                filteredData.forEach(d => { counts[d.estado] = (counts[d.estado] || 0) + 1; });
                return Object.keys(counts).map(name => ({ name, value: counts[name] }))
                    .sort((a,b) => b.value - a.value).slice(0, 6);
            }, [filteredData]);

            return (
                <div className="min-h-screen">
                    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 py-3 shadow-sm">
                        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="bg-orange-600 p-1.5 rounded-lg text-white">
                                    <Icon name="truck" size={20} />
                                </div>
                                <h1 className="text-lg font-black italic tracking-tighter uppercase">
                                    Inter <span className="text-orange-600">Rapidísimo</span>
                                </h1>
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-orange-600 transition-colors flex items-center gap-2">
                                    <Icon name="upload" size={14} /> CARGAR CSV
                                    <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                                </label>
                                <button onClick={() => { if(confirm("¿Borrar todo?")) setData([]) }} className="p-2 text-slate-300 hover:text-red-500">
                                    <Icon name="trash-2" size={18} />
                                </button>
                            </div>
                        </div>
                    </header>

                    <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <StatCard label="Guías" value={stats.total} color="orange" icon="file-text" />
                            <StatCard label="Conductores" value={stats.conductores} color="blue" icon="users" />
                            <StatCard label="Valor Total" value={new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(stats.valor)} color="emerald" icon="dollar-sign" className="col-span-2 md:col-span-1" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-slate-200">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Estado de Envíos</h3>
                                <div className="h-64">
                                    {chartData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" tick={{fontSize: 9, fontWeight: 700}} axisLine={false} tickLine={false} />
                                                <YAxis tick={{fontSize: 9}} axisLine={false} tickLine={false} />
                                                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                                                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                                                    {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">Sube archivos para ver gráficas</div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-[2rem] border border-slate-200">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Búsqueda</h3>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Icon name="search" size={14} className="absolute left-3 top-3 text-slate-300" />
                                        <input 
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 pl-10 text-xs font-medium outline-none focus:ring-2 focus:ring-orange-500" 
                                            placeholder="Guía, conductor o placa..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <select 
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold outline-none cursor-pointer"
                                        onChange={(e) => setFilterEstado(e.target.value)}
                                    >
                                        <option value="Todos">Todos los Estados</option>
                                        {[...new Set(data.map(d => d.estado))].map(e => <option key={e} value={e}>{e}</option>)}
                                    </select>
                                    <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 mt-4 text-[10px] text-slate-500">
                                        Análisis local seguro. No se envían datos fuera de este dispositivo.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left border-collapse min-w-[600px]">
                                    <thead>
                                        <tr className="bg-slate-50 text-slate-400 text-[9px] uppercase font-black tracking-widest border-b">
                                            <th className="px-6 py-4">Guía</th>
                                            <th className="px-6 py-4">Estado</th>
                                            <th className="px-6 py-4">Operación</th>
                                            <th className="px-6 py-4 text-right">Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredData.slice(0, 100).map((row, i) => (
                                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 font-black text-slate-900 text-xs">#{row.guia}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black border ${row.estado.includes('Entregado') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                                        {row.estado}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-[10px] font-black text-slate-800 uppercase leading-none">{row.conductor}</div>
                                                    <div className="text-[9px] text-slate-400 font-bold uppercase">{row.placa}</div>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-xs font-black text-slate-900">
                                                    ${row.valor.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>
                </div>
            );
        };

        const StatCard = ({ label, value, color, icon, className = "" }) => {
            const colors = {
                orange: 'text-orange-600',
                blue: 'text-blue-600',
                emerald: 'text-emerald-600',
                slate: 'text-slate-900'
            };
            return (
                <div className={`bg-white p-5 rounded-3xl border border-slate-200 shadow-sm ${className}`}>
                    <div className="flex items-center gap-2 mb-2 text-slate-400">
                        <Icon name={icon} size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
                    </div>
                    <div className={`text-xl font-black truncate ${colors[color]}`}>
                        {value}
                    </div>
                </div>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
