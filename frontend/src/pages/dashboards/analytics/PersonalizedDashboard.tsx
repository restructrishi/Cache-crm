import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
// @ts-ignore
import * as ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { 
  Plus, Save, RotateCcw, X, LayoutTemplate, 
  BarChart3, PieChart, LineChart, Table as TableIcon, 
  Hash, GripVertical, Settings, Trash2, ArrowLeft,
  AreaChart, ScatterChart, Radar, Filter, Gauge, Layers, 
  CreditCard, LayoutGrid, Search as SearchIcon, Network,
  Globe, Award, Circle, BarChart4
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, LineChart as ReLineChart, Line, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend, AreaChart as ReAreaChart, Area, ScatterChart as ReScatterChart, Scatter,
  RadarChart as ReRadarChart, Radar as ReRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  FunnelChart, Funnel, LabelList, Treemap
} from 'recharts';

// Handle various ESM/CJS interop scenarios
// @ts-ignore
const RGL = ReactGridLayout.default || ReactGridLayout;
// @ts-ignore
const WidthProvider = RGL.WidthProvider || ReactGridLayout.WidthProvider;
// @ts-ignore
const Responsive = RGL.Responsive || ReactGridLayout.Responsive;

// @ts-ignore
const ResponsiveGridLayout = typeof WidthProvider === 'function' ? WidthProvider(Responsive) : Responsive;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// --- Types & Constants ---

type WidgetType = 'card' | 'bar' | 'pie' | 'line' | 'area' | 'scatter' | 'radar' | 'funnel' | 'table' | 'gauge' | 'matrix' | 'multi-row' | 'slicer' | 'decomposition-tree';

interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  dataSource?: string; // e.g., 'leads.byStatus'
  dataKey?: string;    // e.g., 'value'
  labelKey?: string;   // e.g., 'name'
}

interface DashboardLayout {
  layout: any[];
  widgets: WidgetConfig[];
}

const VISUALIZATIONS = [
  { type: 'bar', icon: BarChart3, label: 'Bar Chart', w: 4, h: 4, minW: 3, minH: 3 },
  { type: 'line', icon: LineChart, label: 'Line Chart', w: 4, h: 4, minW: 3, minH: 3 },
  { type: 'area', icon: AreaChart, label: 'Area Chart', w: 4, h: 4, minW: 3, minH: 3 },
  { type: 'pie', icon: PieChart, label: 'Pie Chart', w: 3, h: 4, minW: 3, minH: 3 },
  { type: 'scatter', icon: ScatterChart, label: 'Scatter', w: 4, h: 4, minW: 3, minH: 3 },
  { type: 'radar', icon: Radar, label: 'Radar', w: 4, h: 4, minW: 3, minH: 3 },
  { type: 'funnel', icon: Filter, label: 'Funnel', w: 4, h: 4, minW: 3, minH: 3 },
  { type: 'card', icon: Hash, label: 'KPI Card', w: 2, h: 2, minW: 2, minH: 2 },
  { type: 'table', icon: TableIcon, label: 'Table', w: 6, h: 4, minW: 4, minH: 3 },
  { type: 'gauge', icon: Gauge, label: 'Gauge', w: 3, h: 3, minW: 2, minH: 2 }, 
  { type: 'matrix', icon: LayoutGrid, label: 'Matrix', w: 5, h: 4, minW: 3, minH: 3 },
  { type: 'multi-row', icon: CreditCard, label: 'Multi-Row', w: 3, h: 3, minW: 2, minH: 2 },
  { type: 'slicer', icon: SearchIcon, label: 'Slicer', w: 2, h: 4, minW: 2, minH: 2 },
  { type: 'decomposition-tree', icon: Network, label: 'Decomp. Tree', w: 6, h: 4, minW: 4, minH: 3 },
];

const DATA_FIELDS = [
  { 
    category: 'Leads', 
    fields: [
      { id: 'leads.total', label: 'Total Leads', type: 'value' },
      { id: 'leads.byStatus', label: 'Leads by Status', type: 'series' },
      { id: 'leads.bySource', label: 'Leads by Source', type: 'series' },
      { id: 'productivity', label: 'Leads per User', type: 'series' },
    ]
  },
  {
    category: 'Sales',
    fields: [
        { id: 'sales.revenue', label: 'Total Revenue', type: 'value' },
        { id: 'sales.byRegion', label: 'Revenue by Region', type: 'series' },
        { id: 'sales.forecast', label: 'Sales Forecast', type: 'series' },
        { id: 'sales.decomposition', label: 'Revenue Breakdown', type: 'tree' },
    ]
  },
  {
    category: 'Activities',
    fields: [
      { id: 'activities.totalMeetings', label: 'Total Meetings', type: 'value' },
      { id: 'activities.byType', label: 'Activities by Type', type: 'series' },
    ]
  }
];

export const PersonalizedDashboard: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [layout, setLayout] = useState<any[]>([]);
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [data, setData] = useState<any>(null);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [vizSearch, setVizSearch] = useState('');
  const [fieldSearch, setFieldSearch] = useState('');
  const [droppingItem, setDroppingItem] = useState<any>({ i: '__dropping_elem__', w: 2, h: 2 });
  const [draggedWidgetType, setDraggedWidgetType] = useState<WidgetType | null>(null);
  
  // Container resize observer for robust grid width
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
            setContainerWidth(entry.contentRect.width);
        }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [isEditMode]); // Re-bind when mode changes (Portal mounts)

  // Load Data & Layout
  useEffect(() => {
    fetchData();
    loadLayout();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setData(getSampleData());
        setLoading(false);
        return;
      }
      const response = await fetch('http://localhost:3000/analytics/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        setData(getSampleData());
      }
    } catch (e) {
      console.error(e);
      setData(getSampleData());
    } finally {
      setLoading(false);
    }
  };

  const getSampleData = () => ({
    leads: {
      total: 124,
      byStatus: [{ name: 'New', value: 45 }, { name: 'Contacted', value: 30 }, { name: 'Closed', value: 9 }, { name: 'Lost', value: 40 }],
      bySource: [{ name: 'Web', value: 40 }, { name: 'Referral', value: 30 }, { name: 'LinkedIn', value: 25 }, { name: 'Ads', value: 29 }],
    },
    activities: { 
        totalMeetings: 87,
        byType: [{ name: 'Call', value: 45 }, { name: 'Meeting', value: 20 }, { name: 'Email', value: 22 }]
    },
    productivity: [{ user: 'John', leads: 45 }, { user: 'Jane', leads: 38 }, { user: 'Mike', leads: 22 }, { user: 'Sarah', leads: 19 }],
    sales: {
        revenue: 1250000,
        byRegion: [
            { name: 'North America', value: 650000 }, 
            { name: 'Europe', value: 350000 }, 
            { name: 'Asia', value: 250000 }
        ],
        forecast: [
            { name: 'Q1', value: 200000 }, { name: 'Q2', value: 300000 }, 
            { name: 'Q3', value: 450000 }, { name: 'Q4', value: 300000 }
        ],
        decomposition: {
            name: 'Total Revenue',
            value: 1250000,
            children: [
                { 
                    name: 'Product A', 
                    value: 750000,
                    children: [
                        { name: 'North', value: 400000 },
                        { name: 'South', value: 350000 }
                    ]
                },
                { 
                    name: 'Product B', 
                    value: 500000,
                    children: [
                        { name: 'East', value: 200000 },
                        { name: 'West', value: 300000 }
                    ]
                }
            ]
        }
    }
  });

  const loadLayout = () => {
    try {
      const saved = localStorage.getItem('my_dashboard_layout_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        let loadedLayout = parsed.layout || [];
        const loadedWidgets = parsed.widgets || [];

        // Enforce constraints on loaded layout
        loadedLayout = loadedLayout.map((l: any) => {
          const widget = loadedWidgets.find((w: any) => w.id === l.i);
          const vizConfig = widget ? VISUALIZATIONS.find(v => v.type === widget.type) : null;
          return {
              ...l,
              minW: vizConfig?.minW || 2,
              minH: vizConfig?.minH || 2
          };
        });

        setLayout(loadedLayout);
        setWidgets(loadedWidgets);
      } else {
        loadDefaultLayout();
      }
    } catch (e) {
      console.error('Failed to load dashboard layout:', e);
      loadDefaultLayout();
    }
  };

  const loadDefaultLayout = () => {
      // Default Layout
      const defaultWidgets: WidgetConfig[] = [
          { id: 'w1', type: 'card', title: 'Total Leads', dataSource: 'leads.total' },
          { id: 'w2', type: 'bar', title: 'Leads by Status', dataSource: 'leads.byStatus' }
      ];
      setWidgets(defaultWidgets);
      setLayout([
          { i: 'w1', x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
          { i: 'w2', x: 0, y: 2, w: 4, h: 4, minW: 3, minH: 3 }
      ]);
  };

  const saveLayout = () => {
    localStorage.setItem('my_dashboard_layout_v2', JSON.stringify({ layout, widgets }));
    setIsEditMode(false);
  };

  // --- Widget Management ---

  const handleDrop = (layout: any[], layoutItem: any, _event: Event) => {
    // The 'droppingItem' has an i of '__dropping_elem__'
    // We need to replace it with a real widget
    const type = ((_event as DragEvent).dataTransfer?.getData('widgetType') as WidgetType) || draggedWidgetType;
    if (!type) return;

    const vizConfig = VISUALIZATIONS.find(v => v.type === type);
    const newId = `w_${Date.now()}`;
    const newWidget: WidgetConfig = {
      id: newId,
      type,
      title: `New ${type}`,
    };

    // Update layout item ID
    const newLayout = layout.map(l => {
        if (l.i === '__dropping_elem__') {
            return { 
                ...l, 
                i: newId, 
                w: vizConfig?.w || l.w, 
                h: vizConfig?.h || l.h,
                minW: vizConfig?.minW || 2,
                minH: vizConfig?.minH || 2
            };
        }
        return l;
    });

    setLayout(newLayout);
    setWidgets([...widgets, newWidget]);
    setSelectedWidgetId(newId);
    setDraggedWidgetType(null); // Reset
  };

  const removeWidget = (id: string) => {
    setLayout(layout.filter(l => l.i !== id));
    setWidgets(widgets.filter(w => w.id !== id));
    if (selectedWidgetId === id) setSelectedWidgetId(null);
  };

  const updateWidgetConfig = (id: string, updates: Partial<WidgetConfig>) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  // --- Rendering Helpers ---

  const getWidgetData = (dataSource?: string) => {
    if (!data || !dataSource) return null;
    const path = dataSource.split('.');
    let current = data;
    for (const key of path) {
      if (current[key] === undefined) return null;
      current = current[key];
    }
    return current;
  };

  const renderWidget = (widget: WidgetConfig) => {
    const widgetData = getWidgetData(widget.dataSource);

    if (!widget.dataSource) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-sm">Select Data Source</p>
        </div>
      );
    }

    if (widget.type === 'card') {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <h3 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {widgetData || 0}
          </h3>
        </div>
      );
    }

    if (widget.type === 'bar') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={Array.isArray(widgetData) ? widgetData : []}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }} />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (widget.type === 'pie') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RePieChart>
            <Pie
              data={Array.isArray(widgetData) ? widgetData : []}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {(Array.isArray(widgetData) ? widgetData : []).map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
          </RePieChart>
        </ResponsiveContainer>
      );
    }

    if (widget.type === 'line') {
        // Mock line data if series is just categories
        return (
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={Array.isArray(widgetData) ? widgetData : []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }} />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
              </ReLineChart>
            </ResponsiveContainer>
        );
    }

    if (widget.type === 'area') {
        return (
            <ResponsiveContainer width="100%" height="100%">
              <ReAreaChart data={Array.isArray(widgetData) ? widgetData : []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }} />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              </ReAreaChart>
            </ResponsiveContainer>
        );
    }

    if (widget.type === 'scatter') {
        return (
            <ResponsiveContainer width="100%" height="100%">
              <ReScatterChart>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis type="category" dataKey="name" name="Name" stroke="#888" fontSize={12} />
                <YAxis type="number" dataKey="value" name="Value" stroke="#888" fontSize={12} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }} />
                <Scatter name="Data" data={Array.isArray(widgetData) ? widgetData : []} fill="#8884d8" />
              </ReScatterChart>
            </ResponsiveContainer>
        );
    }

    if (widget.type === 'radar') {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <ReRadarChart cx="50%" cy="50%" outerRadius="80%" data={Array.isArray(widgetData) ? widgetData : []}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: '#888', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: '#888', fontSize: 10 }} />
                    <ReRadar name="Value" dataKey="value" stroke="#8884d8" strokeWidth={2} fill="#8884d8" fillOpacity={0.3} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }} />
                </ReRadarChart>
            </ResponsiveContainer>
        );
    }

    if (widget.type === 'waterfall') {
        // Mock waterfall with bar chart for now
        return (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Array.isArray(widgetData) ? widgetData : []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
        );
    }

    if (widget.type === 'map') {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-blue-50/50 dark:bg-blue-900/10 rounded-lg">
                <Globe className="w-12 h-12 text-blue-400 mb-2" />
                <span className="text-sm text-gray-500">Geographic Data Visualization</span>
                <span className="text-xs text-gray-400">(Placeholder)</span>
            </div>
        );
    }

    if (widget.type === 'ribbon') {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-purple-50/50 dark:bg-purple-900/10 rounded-lg">
                <Award className="w-12 h-12 text-purple-400 mb-2" />
                <span className="text-sm text-gray-500">Ribbon Chart</span>
                <span className="text-xs text-gray-400">(Placeholder)</span>
            </div>
        );
    }

    if (widget.type === 'funnel') {
        // Funnel chart expects data sorted by value usually
        const sortedData = Array.isArray(widgetData) ? [...widgetData].sort((a, b) => b.value - a.value) : [];
        return (
            <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }} />
                    <Funnel
                        dataKey="value"
                        data={sortedData}
                        isAnimationActive
                    >
                        <LabelList position="right" fill="#888" stroke="none" dataKey="name" />
                    </Funnel>
                </FunnelChart>
            </ResponsiveContainer>
        );
    }

    if (widget.type === 'table') {
        return (
            <div className="overflow-auto h-full w-full">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">Name</th>
                            <th scope="col" className="px-4 py-3 text-gray-500 dark:text-gray-400 font-medium text-right">Value</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {Array.isArray(widgetData) && widgetData.map((item: any, i: number) => (
                            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{item.name || item.user || 'Unknown'}</td>
                                <td className="px-4 py-2 text-right text-gray-500 dark:text-gray-400">{item.value || item.leads || 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (widget.type === 'gauge') {
        const value = typeof widgetData === 'number' ? widgetData : (Array.isArray(widgetData) ? widgetData.reduce((a: any, b: any) => a + (b.value || 0), 0) : 0);
        // Mock max value logic for demo
        const max = 100; 
        const percentage = Math.min(100, Math.max(0, (value / max) * 100));
        
        const gaugeData = [
            { name: 'Value', value: percentage },
            { name: 'Remaining', value: 100 - percentage }
        ];

        return (
            <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                    <Pie
                        data={gaugeData}
                        cx="50%"
                        cy="70%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius="60%"
                        outerRadius="80%"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        <Cell fill="#3b82f6" />
                        <Cell fill="#e5e7eb" />
                    </Pie>
                    <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-gray-700 dark:fill-gray-200">
                        {value}
                    </text>
                    <text x="50%" y="85%" textAnchor="middle" dominantBaseline="middle" className="text-sm fill-gray-500">
                        Target: {max}
                    </text>
                </RePieChart>
            </ResponsiveContainer>
        );
    }

    if (widget.type === 'matrix') {
        return (
            <div className="overflow-auto h-full w-full">
                <table className="min-w-full text-left text-xs border-collapse">
                    <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                        <tr>
                            <th className="p-2 border border-gray-200 dark:border-gray-700">Category</th>
                            <th className="p-2 border border-gray-200 dark:border-gray-700 text-right">Value</th>
                            <th className="p-2 border border-gray-200 dark:border-gray-700 text-right">%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(widgetData) && widgetData.map((item: any, i: number) => (
                            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="p-2 border border-gray-200 dark:border-gray-700 font-medium">{item.name || item.user || 'Unknown'}</td>
                                <td className="p-2 border border-gray-200 dark:border-gray-700 text-right">{item.value || item.leads || 0}</td>
                                <td className="p-2 border border-gray-200 dark:border-gray-700 text-right text-gray-500">
                                    {Math.floor(Math.random() * 100)}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (widget.type === 'multi-row') {
        return (
            <div className="h-full w-full overflow-auto p-2 space-y-2">
                {Array.isArray(widgetData) && widgetData.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded border-l-4 border-blue-500">
                        <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{item.name || item.user}</span>
                        <span className="font-bold text-lg text-gray-900 dark:text-white">{item.value || item.leads}</span>
                    </div>
                ))}
            </div>
        );
    }

    if (widget.type === 'slicer') {
        return (
             <div className="h-full w-full p-2 flex flex-col gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <SearchIcon className="w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full bg-transparent border-none outline-none text-sm"
                    />
                </div>
                <div className="flex-1 overflow-auto space-y-1">
                    {['All', 'New', 'Contacted', 'Qualified', 'Lost'].map(opt => (
                        <label key={opt} className="flex items-center gap-2 p-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-300" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{opt}</span>
                        </label>
                    ))}
                </div>
             </div>
        );
    }

    if (widget.type === 'decomposition-tree') {
        // Simple visualization for tree using Recharts Treemap or custom HTML
        const treeData = widgetData ? (Array.isArray(widgetData) ? widgetData : [widgetData]) : [];
        return (
             <div className="h-full w-full overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                        data={treeData}
                        dataKey="value"
                        aspectRatio={4 / 3}
                        stroke="#fff"
                        fill="#8884d8"
                    >
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }} />
                    </Treemap>
                </ResponsiveContainer>
                <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded">
                    Tree View
                </div>
             </div>
        );
    }

    return <div>Unknown Widget</div>;
  };

  // --- Builder UI ---

  if (isEditMode) {
    return ReactDOM.createPortal(
      <div className="fixed inset-0 z-[9999] bg-gray-100 dark:bg-black flex flex-col">
        {/* Header */}
        <div className="h-14 bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
                <button onClick={() => setIsEditMode(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="font-bold text-lg">Dashboard Builder</h1>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={saveLayout} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Save className="w-4 h-4" /> Save Dashboard
                </button>
            </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar - Visualizations & Data */}
            <div className="w-80 bg-white dark:bg-[#1e1e1e] border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-y-auto">
                {/* Visualizations Panel */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Visualizations</h3>
                    
                    <div className="relative mb-3">
                        <SearchIcon className="absolute left-2 top-1.5 w-3 h-3 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search visual" 
                            value={vizSearch} 
                            onChange={(e) => setVizSearch(e.target.value)}
                            className="w-full pl-7 pr-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
                        {VISUALIZATIONS.filter(v => v.label.toLowerCase().includes(vizSearch.toLowerCase())).map(viz => (
                            <div 
                                key={viz.type}
                                draggable={true}
                                unselectable="on"
                                onDragStart={(e) => {
                                    e.dataTransfer.setData('widgetType', viz.type);
                                    e.dataTransfer.effectAllowed = 'copy';
                                    setDraggedWidgetType(viz.type as WidgetType);
                                    setDroppingItem({
                                        i: '__dropping_elem__',
                                        w: viz.w,
                                        h: viz.h,
                                        minW: viz.minW,
                                        minH: viz.minH
                                    });
                                }}
                                onDragEnd={() => {
                                    setDraggedWidgetType(null);
                                }}
                                className="aspect-square flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-grab active:cursor-grabbing p-2"
                                title={viz.label}
                            >
                                <viz.icon className="w-6 h-6 text-gray-700 dark:text-gray-300 mb-1" />
                                {/* <span className="text-[10px] text-gray-500">{viz.label}</span> */}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Properties Panel (If Widget Selected) */}
                {selectedWidgetId ? (
                    <div className="p-4 flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase">Properties</h3>
                            <button onClick={() => removeWidget(selectedWidgetId)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                <input 
                                    type="text" 
                                    value={widgets.find(w => w.id === selectedWidgetId)?.title || ''}
                                    onChange={(e) => updateWidgetConfig(selectedWidgetId, { title: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Data Source</label>
                                
                                <div className="relative mb-2">
                                    <SearchIcon className="absolute left-2 top-1.5 w-3 h-3 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Search fields" 
                                        value={fieldSearch} 
                                        onChange={(e) => setFieldSearch(e.target.value)}
                                        className="w-full pl-7 pr-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>

                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {DATA_FIELDS.map(cat => {
                                        const filteredFields = cat.fields.filter(f => f.label.toLowerCase().includes(fieldSearch.toLowerCase()));
                                        if (filteredFields.length === 0) return null;
                                        return (
                                            <div key={cat.category}>
                                                <p className="text-xs text-gray-500 font-medium mb-1">{cat.category}</p>
                                                <div className="space-y-1">
                                                    {filteredFields.map(field => {
                                                        const isSelected = widgets.find(w => w.id === selectedWidgetId)?.dataSource === field.id;
                                                        return (
                                                            <button
                                                                key={field.id}
                                                                onClick={() => updateWidgetConfig(selectedWidgetId, { dataSource: field.id })}
                                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${
                                                                    isSelected 
                                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800' 
                                                                    : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                                }`}
                                                            >
                                                                <span>{field.label}</span>
                                                                {isSelected && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 flex-1 flex flex-col items-center justify-center text-gray-400 text-center">
                        <Settings className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-sm">Select a widget on the canvas to configure its properties</p>
                    </div>
                )}
            </div>

            {/* Canvas Area */}
            <div className="flex-1 bg-gray-100 dark:bg-black p-8 overflow-y-auto" onDragOver={(e) => e.preventDefault()}>
                <div 
                    ref={containerRef}
                    className="max-w-6xl mx-auto min-h-[800px] bg-white dark:bg-[#111] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 relative"
                >
                    {/* Grid Lines Background (Optional for visual aid) */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
                        style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
                    />

                    <Responsive
                        className="layout"
                        layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
                        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
                        rowHeight={60}
                        width={containerWidth}
                        isDroppable={true}
                        onDrop={handleDrop}
                        droppingItem={droppingItem}
                        onLayoutChange={(l) => setLayout(l)}
                        draggableHandle=".drag-handle"
                        useCSSTransforms={true}
                        margin={[16, 16]}
                    >
                        {widgets.map(widget => (
                            <div 
                                key={widget.id} 
                                onClick={(e) => { e.stopPropagation(); setSelectedWidgetId(widget.id); }}
                                className={`bg-white dark:bg-[#1e1e1e] rounded-lg shadow-sm border overflow-hidden flex flex-col group ${
                                    selectedWidgetId === widget.id 
                                    ? 'border-blue-500 ring-2 ring-blue-500/20 z-10' 
                                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                                }`}
                                // IMPORTANT: Forward style/className/events from RGL
                                {...(widgets.find(w => w.id === widget.id) as any)}
                            >
                                <div className="drag-handle h-6 bg-gray-50 dark:bg-gray-800/50 cursor-move flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                    <span className="text-[10px] font-semibold uppercase text-gray-500 truncate">{widget.title}</span>
                                    <GripVertical className="w-3 h-3 text-gray-400" />
                                </div>
                                <div className="flex-1 p-3 min-h-0 relative">
                                    {renderWidget(widget)}
                                </div>
                                {/* Custom Resize Handle (Optional, RGL provides one by default) */}
                            </div>
                        ))}
                    </Responsive>
                </div>
            </div>
        </div>
      </div>,
      document.body
    );
  }

  // --- View Mode UI ---

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Your personalized view of the CRM.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setIsEditMode(true)} 
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                <LayoutTemplate className="w-4 h-4" /> Edit Dashboard
            </button>
        </div>
      </div>

      {widgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
            <LayoutTemplate className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Empty Dashboard</h3>
            <p className="text-gray-500 mt-1 mb-6">Start building your personalized dashboard now.</p>
            <button 
                onClick={() => setIsEditMode(true)} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Start Building
            </button>
        </div>
      ) : (
        <div 
            ref={!isEditMode ? containerRef : undefined}
            className="bg-transparent min-h-[500px] w-full"
        >
            <Responsive
                className="layout"
                layouts={{ lg: layout }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
                rowHeight={60}
                width={containerWidth}
                isDraggable={false}
                isResizable={false}
                margin={[16, 16]}
            >
                {widgets.map(widget => (
                    <div key={widget.id} className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col p-4">
                        <div className="mb-2">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{widget.title}</h3>
                        </div>
                        <div className="flex-1 min-h-0 relative">
                            {renderWidget(widget)}
                        </div>
                    </div>
                ))}
            </Responsive>
        </div>
      )}
    </div>
  );
};
