'use client';

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

// Definir la estructura de los datos
interface ReportDataProps {
  data: {
    paymentStats: Array<{
      payment_status: string;
      count: number | string;
    }>;
    eventTypeStats: Array<{
      event_type: string;
      count: number;
    }>;
    packageStats: Array<{
      name: string;
      count: number;
    }>;
  };
}

export default function ReportsContent({ data }: ReportDataProps) {
  // Transformar datos para gráficos
  const paymentChartData = data.paymentStats.map(stat => ({
    name: stat.payment_status === 'completed' ? 'Pagado' : 
          stat.payment_status === 'pending' ? 'Pendiente' : 
          stat.payment_status === 'failed' ? 'Fallido' : stat.payment_status,
    value: typeof stat.count === 'string' ? parseInt(stat.count) : stat.count
  }));
  
  const eventTypeChartData = data.eventTypeStats.map(stat => ({
    name: stat.event_type,
    value: stat.count
  }));
  
  const packageChartData = data.packageStats.map(stat => ({
    name: stat.name,
    value: stat.count
  }));
  
  // Colores para los gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Invitaciones por Estado de Pago</h2>
          <div className="h-80">
            {paymentChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No hay datos disponibles</p>
              </div>
            )}
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Invitaciones por Tipo de Evento</h2>
          <div className="h-80">
            {eventTypeChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={eventTypeChartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 70,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" name="Invitaciones" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No hay datos disponibles</p>
              </div>
            )}
          </div>
        </Card>
        
        <Card className="p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Uso de Paquetes</h2>
          <div className="h-80">
            {packageChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={packageChartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Invitaciones" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No hay datos disponibles</p>
              </div>
            )}
          </div>
        </Card>
      </div>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Métricas Clave</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-medium text-muted-foreground">Total de Invitaciones</p>
            <p className="text-3xl font-bold mt-1">
              {paymentChartData.reduce((acc, curr) => acc + curr.value, 0)}
            </p>
          </div>
          
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-medium text-muted-foreground">Tipos de Evento</p>
            <p className="text-3xl font-bold mt-1">
              {eventTypeChartData.length}
            </p>
          </div>
          
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-medium text-muted-foreground">Paquetes Disponibles</p>
            <p className="text-3xl font-bold mt-1">
              {packageChartData.length}
            </p>
          </div>
          
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-medium text-muted-foreground">Conversión de Pago</p>
            <p className="text-3xl font-bold mt-1">
              {(() => {
                const total = paymentChartData.reduce((acc, curr) => acc + curr.value, 0);
                const completed = paymentChartData.find(d => d.name === 'Pagado')?.value || 0;
                return total > 0 ? `${Math.round((completed / total) * 100)}%` : '0%';
              })()}
            </p>
          </div>
        </div>
      </Card>
    </>
  );
}