import React, { useState, useMemo } from 'react';
import { Truck, Search, Upload, Trash2, BarChart3, TrendingUp, Calendar, Download, FileText } from 'lucide-react';

const Dashboard = () => {
  const ESTADOS_REQUERIDOS = [
    "Transito nacional", "Reclame en oficina", "Reparto", 
    "Transito regional", "Centro acopio", "Archivada", 
    "Intento de entrega", "Telemercadeo", "Reenvio", "Transito Urbano"
  ];

  const initialData = [
    { guia: "110002646855", estado: "Transito regional", conductor: "RUBEN DARIO LEON NIÑO", placa: "WFI408", origen: "BOGOTA", destino: "GIRON", valor: 3447115, fecha: "2025-12-15", servicio: "MENSAJERÍA" },
    { guia: "230018382345", estado: "Transito nacional", conductor: "JORGE LUIS RAMIREZ SUTACHAN", placa: "FSU803", origen: "BOGOTA", destino: "BUCARAMANGA", valor: 3447490, fecha: "2025-12-15", servicio: "MENSAJERÍA" },
    { guia: "3000224050165", estado: "Reparto", conductor: "JULIAN ESTEBAN MOSQUERA", placa: "N/A", origen: "BARRANQUILLA", destino: "BUCARAMANGA", valor: 1250000, fecha: "2025-12-16", servicio: "MENSAJERÍA" },
    { guia: "3000224052821", estado: "Archivada", conductor: "FAVIEL NIÑO MENDEZ", placa: "EQW770", origen: "BARRANQUILLA", destino: "CUCUTA", valor: 3447586, fecha: "2025-12-16", servicio: "CARGA TERRESTRE" },
    { guia: "4000123456789", estado: "Centro acopio", conductor: "CARLOS ANDRES RUIZ", placa: "XYZ123", origen: "MEDELLIN", destino: "BOGOTA", valor: 540000, fecha: "2025-12-17", servicio: "RAPI CARGA" },
    { guia: "5000987654321", estado: "Intento de entrega", conductor: "MARIA FERNANDA LOPEZ", placa: "ABC789", origen: "PEREIRA", destino: "MANIZALES", valor: 210000, fecha: "2025-12-17", servicio: "MENSAJERÍA" },
    { guia: "6000112233445", estado: "Reclame en oficina", conductor: "N/A", placa: "OFICINA", origen: "BUCARAMANGA", destino: "GIRON", valor: 85000, fecha: "2025-12-18", servicio: "MENSAJERÍA" }
  ];

  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('Todos');
  const [filterFechaInicio, setFilterFechaInicio] = useState('');
  const [filterFechaFin, setFilterFechaFin] = useState('');
  const [showUploadInfo, setShowUploadInfo] = useState(false);

  const cleanScientificNotation = (value) => {
    if (!value) return '';
    const str = String(value).trim();
    
    if (str.includes('E+') || str.includes('e+')) {
      try {
        const normalized = str.replace(',', '.');
        const num = parseFloat(normalized);
        if (!isNaN(num)) {
          return Math.round(num).toString();
        }
      } catch (e) {
        console.warn('Error procesando notación científica:', str);
      }
    }
    
    return str;
  };

  const cleanText = (text) => {
    if (!text) return '';
    return String(text)
      .replace(/Ã±/g, 'ñ')
      .replace(/Ã'/g, 'Ñ')
      .replace(/Ã³/g, 'ó')
      .replace(/Ã¡/g, 'á')
      .replace(/Ã©/g, 'é')
      .replace(/Ã­/g, 'í')
      .replace(/Ãº/g, 'ú')
      .trim();
  };

  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/);
    if (lines.length < 2) return [];

    let headerIndex = lines.findIndex(line => 
      line.includes('Numero Guia') || line.includes('Guia')
    );
    
    if (headerIndex === -1) headerIndex = 0;

    const headers = lines[headerIndex]
      .split(/[,;\t]/)
      .map(h => h.trim().replace(/"/g, '').toLowerCase());

    const columnMap = {
      guia: headers.findIndex(h => h.includes('guia') || h.includes('numero')),
      estado: headers.findIndex(h => h.includes('estado') && h.includes('envio')),
      origen: headers.findIndex(h => h.includes('ciudad') && h.includes('origen')),
      destino: headers.findIndex(h => h.includes('ciudad') && h.includes('destino')),
      conductor: headers.findIndex(h => h.includes('conductor') && h.includes('nombre')),
      placa: headers.findIndex(h => h.includes('placa')),
      valor: headers.findIndex(h => h.includes('valor') && h.includes('comercial')),
      fecha: headers.findIndex(h => h.includes('fecha') && h.includes('manifiesto')),
      servicio: headers.findIndex(h => h.includes('nombre') && h.includes('servicio'))
    };

    const processedRows = [];

    for (let i = headerIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.match(/(".*?"|[^,;\t]+)/g) || [];
      const cleanCols = cols.map(c => c.replace(/"/g, '').trim());

      if (columnMap.guia === -1 || !cleanCols[columnMap.guia]) continue;

      const guiaLimpia = cleanScientificNotation(cleanCols[columnMap.guia]);
      if (!guiaLimpia || guiaLimpia.length < 5) continue;

      const fechaRaw = cleanCols[columnMap.fecha] || '';
      const fechaLimpia = fechaRaw.split(' ')[0];
      
      let fechaFormateada = fechaLimpia;
      if (fechaLimpia.includes('/')) {
        const [d, m, y] = fechaLimpia.split('/');
        fechaFormateada = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      }

      const valorRaw = cleanCols[columnMap.valor] || '0';
      const valorLimpio = cleanScientificNotation(valorRaw);

      processedRows.push({
        guia: guiaLimpia,
        estado: cleanText(cleanCols[columnMap.estado]) || 'Sin Estado',
        conductor: cleanText(cleanCols[columnMap.conductor]) || 'No Asignado',
        placa: cleanText(cleanCols[columnMap.placa]) || 'N/A',
        origen: cleanText(cleanCols[columnMap.origen]) || 'N/A',
        destino: cleanText(cleanCols[columnMap.destino]) || 'N/A',
        valor: parseFloat(valorLimpio.replace(/,/g, '')) || 0,
        fecha: fechaFormateada || 'N/A',
        servicio: cleanText(cleanCols[columnMap.servicio]) || 'N/A'
      });
    }

    return processedRows;
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (!files.length) return;

    setShowUploadInfo(true);
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const newRows = parseCSV(text);
          
          setData(prev => {
            const combined = [...prev, ...newRows];
            const unique = Array.from(
              new Map(combined.map(item => [item.guia, item])).values()
            );
            return unique;
          });
        } catch (error) {
          console.error('Error procesando archivo:', error);
          alert(`Error al procesar ${file.name}: ${error.message}`);
        }
      };
      reader.readAsText(file, 'UTF-8');
    });

    setTimeout(() => setShowUploadInfo(false), 3000);
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = 
        item.guia.toLowerCase().includes(search) || 
        item.conductor.toLowerCase().includes(search) ||
        item.origen.toLowerCase().includes(search) ||
        item.destino.toLowerCase().includes(search) ||
        item.placa.toLowerCase().includes(search);
      
      const matchesEstado = filterEstado === 'Todos' || item.estado === filterEstado;
      
      let matchesFecha = true;
      if (filterFechaInicio && item.fecha !== 'N/A') {
        matchesFecha = item.fecha >= filterFechaInicio;
      }
      if (filterFechaFin && item.fecha !== 'N/A' && matchesFecha) {
        matchesFecha = item.fecha <= filterFechaFin;
      }

      return matchesSearch && matchesEstado && matchesFecha;
    });
  }, [data, searchTerm, filterEstado, filterFechaInicio, filterFechaFin]);

  const stats = useMemo(() => {
    const counts = {};
    let totalVal = 0;
    const fechas = new Set();
    
    filteredData.forEach(d => {
      counts[d.estado] = (counts[d.estado] || 0) + 1;
      totalVal += d.valor;
      if (d.fecha !== 'N/A') fechas.add(d.fecha);
    });
    
    return {
      total: filteredData.length,
      valor: totalVal,
      estados: Object.entries(counts).map(([name, value]) => ({ name, value })),
      fechasUnicas: fechas.size
    };
  }, [filteredData]);

  // NUEVA FUNCIÓN: Generar informe detallado
  const generarInformeDetallado = () => {
    const ahora = new Date();
    const fechaHora = ahora.toLocaleString('es-CO');
    
    // Agrupar por estado
    const porEstado = {};
    ESTADOS_REQUERIDOS.forEach(estado => {
      porEstado[estado] = filteredData.filter(d => d.estado === estado);
    });

    // Construir el informe en texto
    let informe = `═══════════════════════════════════════════════════════════════════
INFORME DETALLADO DE OPERACIONES - INTER RAPIDÍSIMO
═══════════════════════════════════════════════════════════════════

Fecha y hora del reporte: ${fechaHora}
Período analizado: ${filterFechaInicio || 'Desde el inicio'} hasta ${filterFechaFin || 'la fecha actual'}

───────────────────────────────────────────────────────────────────
RESUMEN EJECUTIVO
───────────────────────────────────────────────────────────────────

Total de guías procesadas: ${stats.total}
Recaudo total: $${stats.valor.toLocaleString('es-CO')}
Estados activos: ${stats.estados.length}
Fechas únicas: ${stats.fechasUnicas}

═══════════════════════════════════════════════════════════════════
ANÁLISIS POR ESTADO DE OPERACIÓN
═══════════════════════════════════════════════════════════════════

`;

    ESTADOS_REQUERIDOS.forEach(estado => {
      const items = porEstado[estado];
      const cantidad = items.length;
      const valorTotal = items.reduce((sum, item) => sum + item.valor, 0);
      
      informe += `
┌─────────────────────────────────────────────────────────────────┐
│ ESTADO: ${estado.toUpperCase().padEnd(52)} │
└─────────────────────────────────────────────────────────────────┘

  Cantidad de guías: ${cantidad}
  Valor total: $${valorTotal.toLocaleString('es-CO')}
  Porcentaje del total: ${stats.total > 0 ? ((cantidad / stats.total) * 100).toFixed(2) : 0}%

`;

      if (cantidad > 0) {
        informe += `  Detalle de guías:\n\n`;
        items.forEach((item, idx) => {
          informe += `  ${idx + 1}. Guía: ${item.guia}
     Fecha: ${item.fecha}
     Ruta: ${item.origen} → ${item.destino}
     Conductor: ${item.conductor}
     Placa: ${item.placa}
     Servicio: ${item.servicio}
     Valor: $${item.valor.toLocaleString('es-CO')}
     
`;
        });
      } else {
        informe += `  No hay guías en este estado.\n\n`;
      }

      informe += `─────────────────────────────────────────────────────────────────\n\n`;
    });

    // Análisis de rutas más frecuentes
    const rutas = {};
    filteredData.forEach(item => {
      const ruta = `${item.origen} → ${item.destino}`;
      rutas[ruta] = (rutas[ruta] || 0) + 1;
    });

    const rutasOrdenadas = Object.entries(rutas)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    informe += `
═══════════════════════════════════════════════════════════════════
RUTAS MÁS FRECUENTES (TOP 10)
═══════════════════════════════════════════════════════════════════

`;

    rutasOrdenadas.forEach(([ruta, cantidad], idx) => {
      informe += `${idx + 1}. ${ruta}: ${cantidad} envíos\n`;
    });

    // Análisis de conductores
    const conductores = {};
    filteredData.forEach(item => {
      if (item.conductor !== 'N/A' && item.conductor !== 'No Asignado') {
        if (!conductores[item.conductor]) {
          conductores[item.conductor] = { cantidad: 0, valor: 0, placas: new Set() };
        }
        conductores[item.conductor].cantidad++;
        conductores[item.conductor].valor += item.valor;
        conductores[item.conductor].placas.add(item.placa);
      }
    });

    const conductoresOrdenados = Object.entries(conductores)
      .sort((a, b) => b[1].cantidad - a[1].cantidad)
      .slice(0, 10);

    informe += `

═══════════════════════════════════════════════════════════════════
CONDUCTORES MÁS ACTIVOS (TOP 10)
═══════════════════════════════════════════════════════════════════

`;

    conductoresOrdenados.forEach(([conductor, datos], idx) => {
      const placas = Array.from(datos.placas).join(', ');
      informe += `${idx + 1}. ${conductor}
   Guías: ${datos.cantidad}
   Valor total transportado: $${datos.valor.toLocaleString('es-CO')}
   Placas utilizadas: ${placas}

`;
    });

    informe += `
═══════════════════════════════════════════════════════════════════
FIN DEL INFORME
═══════════════════════════════════════════════════════════════════

Este reporte fue generado automáticamente por el sistema de 
Control Logístico Total de INTER RAPIDÍSIMO.
`;

    return informe;
  };

  // Exportar datos a CSV
  const exportToCSV = () => {
    const headers = ['Guía', 'Estado', 'Origen', 'Destino', 'Conductor', 'Placa', 'Valor', 'Fecha', 'Servicio'];
    const rows = filteredData.map(d => [
      d.guia, d.estado, d.origen, d.destino, d.conductor, d.placa, d.valor, d.fecha, d.servicio
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(c => `"${c}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inter_rapidisimo_datos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // NUEVA FUNCIÓN: Exportar informe como TXT
  const exportarInforme = () => {
    const informe = generarInformeDetallado();
    const blob = new Blob([informe], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inter_rapidisimo_informe_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2.5 rounded-2xl text-white shadow-lg">
                <Truck size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl font-black italic tracking-tight">
                  INTER<span className="text-orange-600">RAPIDÍSIMO</span>
                </h1>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Control Logístico Total</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-slate-50 rounded-xl px-3 py-2 border border-slate-200">
                <Search size={16} className="text-slate-400 mr-2" />
                <input 
                  type="text"
                  placeholder="Buscar guía, conductor..."
                  className="bg-transparent text-sm font-semibold outline-none w-48"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <label className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-black cursor-pointer hover:bg-orange-600 transition-all flex items-center gap-2">
                <Upload size={16} /> CARGAR CSV
                <input 
                  type="file" 
                  multiple 
                  accept=".csv"
                  className="hidden" 
                  onChange={handleFileUpload} 
                />
              </label>

              <button 
                onClick={exportarInforme}
                className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-black hover:bg-blue-700 transition-all flex items-center gap-2"
                title="Descargar informe detallado"
              >
                <FileText size={16} /> INFORME
              </button>
              
              <button 
                onClick={exportToCSV}
                className="p-2.5 text-slate-600 hover:text-green-600 transition-colors"
                title="Exportar datos CSV"
              >
                <Download size={20} />
              </button>
              
              <button 
                onClick={() => setData([])} 
                className="p-2.5 text-slate-400 hover:text-red-500 transition-colors"
                title="Limpiar todos los datos"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          {showUploadInfo && (
            <div className="mt-3 bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm text-green-800 font-semibold">
              ✓ Archivo procesado correctamente. Datos limpios y listos.
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-black uppercase text-slate-400 tracking-wider">Total Guías</p>
              <BarChart3 size={18} className="text-orange-500" />
            </div>
            <p className="text-3xl font-black text-slate-900">{stats.total}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl text-white shadow-lg">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-black uppercase opacity-80 tracking-wider">Recaudo Total</p>
              <TrendingUp size={18} className="opacity-80" />
            </div>
            <p className="text-2xl font-black">${stats.valor.toLocaleString()}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-black uppercase text-slate-400 tracking-wider">Estados Activos</p>
              <Calendar size={18} className="text-blue-500" />
            </div>
            <p className="text-3xl font-black text-slate-900">{stats.estados.length}</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-lg">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-black uppercase opacity-70 tracking-wider">Fechas Únicas</p>
              <Calendar size={18} className="opacity-70" />
            </div>
            <p className="text-3xl font-black">{stats.fechasUnicas}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider mb-4">Filtros Avanzados</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Estado</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none cursor-pointer"
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
              >
                <option value="Todos">TODOS LOS ESTADOS</option>
                {ESTADOS_REQUERIDOS.map(e => <option key={e} value={e}>{e.toUpperCase()}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Fecha Inicio</label>
              <input 
                type="date"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none"
                value={filterFechaInicio}
                onChange={(e) => setFilterFechaInicio(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Fecha Fin</label>
              <input 
                type="date"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none"
                value={filterFechaFin}
                onChange={(e) => setFilterFechaFin(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">Detalle de Envíos</h3>
            <span className="text-xs font-bold text-slate-500">{filteredData.length} registros</span>
          </div>

          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-slate-50 z-10">
                <tr className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  <th className="px-6 py-4">Guía / Fecha</th>
                  <th className="px-6 py-4">Origen → Destino</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Conductor</th>
                  <th className="px-6 py-4">Placa</th>
                  <th className="px-6 py-4">Servicio</th>
                  <th className="px-6 py-4 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-xs font-black text-slate-900">#{row.guia}</div>
                      <div className="text-[10px] text-slate-400 font-bold">{row.fecha}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <span className="text-slate-600">{row.origen}</span>
                        <span className="text-orange-500">→</span>
                        <span className="text-slate-900">{row.destino}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        ['Entregado', 'Archivada', 'Reparto'].includes(row.estado)
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {row.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-700">{row.conductor}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-600">{row.placa}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-600">{row.servicio}</td>
                    <td className="px-6 py-4 text-right font-mono text-sm font-black text-slate-900">
                      ${row.valor.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary by State */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider mb-6 flex items-center gap-2">
            <div className="w-1 h-5 bg-orange-600 rounded-full"></div>
            Consolidado por Estados
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {ESTADOS_REQUERIDOS.map(estado => {
              const count = data.filter(d => d.estado === estado).length;
              return (
                <div 
                  key={estado} 
                  className={`p-4 rounded-xl border
