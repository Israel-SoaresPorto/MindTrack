import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { getFrequenciaRegistros } from "@/services/metrics/frequencia-de-registros.service";
import useContainerQuery from "@/hooks/useContainerQuery";

type FrequenciaData = {
  name: string;
  valor: number;
  periodo: string;
};

export default function CustomBarChart() {
  const [barSize, setBarSize] = useState(60);
  const [data, setData] = useState<FrequenciaData[]>([
    { name: "Carregando...", valor: 1, periodo: "" },
  ]);

  const { containerRef, currentBreakpoint } = useContainerQuery({
    sm: 0,
    md: 300,
    lg: 600,
  });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const response = await getFrequenciaRegistros();

        if (response) {
          const dadosFormatados = response.map((item, index) => ({
            name: `Semana ${item.week || index + 1}`,
            valor: item.count,
            periodo: item.period,
          }));
          setData(dadosFormatados);
        } else {
          setData([{ name: "Sem dados", valor: 1, periodo: "" }]);
        }
      } catch (error) {
        console.error("Erro ao carregar frequência:", error);
        setData([{ name: "Erro ao carregar", valor: 1, periodo: "" }]);
      }
    };

    carregarDados();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (currentBreakpoint === "sm") setBarSize(25);
      else if (currentBreakpoint === "md") setBarSize(40);
      else setBarSize(60); // desktop
    };

    handleResize(); // executa no mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentBreakpoint]);

  return (
    <div
      style={{
        width: "100%",
        height: 420,
        display: "flex",
        justifyContent: "center",
        position: "relative",
      }}
      className="group transition-all duration-300 hover:scale-[1.02]"
      ref={containerRef}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 15, right: 20, left: -10, bottom: 15 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e0e0e0"
          />
          <XAxis
            dataKey="name"
            tick={{
              fontSize:
                currentBreakpoint === "sm" || currentBreakpoint === "md"
                  ? 8
                  : 12,
              fontWeight: 600,
              fill: "#374151",
            }}
            className="dark:[&_text]:fill-white"
            tickMargin={12}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 60]}
            tick={{ fontSize: 12, fontWeight: 500, fill: "#6b7280" }}
            className="dark:[&_text]:fill-gray-300"
            tickCount={6}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{
              fill: "rgba(92, 108, 250, 0.15)",
              stroke: "#5C6CFA",
              strokeWidth: 2,
              strokeDasharray: "5 5",
            }}
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: 12,
              border: "2px solid #5C6CFA",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              fontSize: "14px",
              fontWeight: "600",
            }}
            wrapperClassName="dark:[&_.recharts-tooltip-wrapper]:bg-gray-800 dark:[&_.recharts-tooltip-item]:text-white dark:[&_.recharts-tooltip-label]:text-white"
            labelStyle={{
              color: "#1f2937",
              fontWeight: "700",
              marginBottom: "4px",
            }}
            formatter={(value: number, name: string) => [
              `${value} registros`,
              name === "valor" ? "Quantidade" : name,
            ]}
          />
          <Bar
            dataKey="valor"
            fill="#5C6CFA"
            barSize={barSize}
            radius={[8, 8, 0, 0]}
            stroke="#4338CA"
            strokeWidth={2}
            style={{
              filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
              cursor: "pointer",
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
