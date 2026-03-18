"use client";

interface Props {
  salaries: number[];
  median: number;
  avg: number;
}

export default function SalaryHistogram({ salaries, median, avg }: Props) {
  if (salaries.length === 0) return null;

  const BIN_SIZE = 100;
  const minVal = Math.min(...salaries);
  const maxVal = Math.max(...salaries);
  const minBin = Math.floor(minVal / BIN_SIZE) * BIN_SIZE;
  const maxBin = Math.ceil(maxVal / BIN_SIZE) * BIN_SIZE;
  const numBins = Math.max((maxBin - minBin) / BIN_SIZE, 1);

  const bins = Array.from({ length: numBins }, (_, i) => {
    const start = minBin + i * BIN_SIZE;
    const end = start + BIN_SIZE;
    const count = salaries.filter((s) => s >= start && (i === numBins - 1 ? s <= end : s < end)).length;
    return { start, end, count };
  });

  const maxCount = Math.max(...bins.map((b) => b.count), 1);

  const W = 560;
  const H = 220;
  const padL = 36;
  const padR = 20;
  const padT = 36;
  const padB = 40;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const barW = chartW / bins.length;
  const gap = bins.length > 10 ? 1 : 2;

  const xForSalary = (salary: number) => {
    const range = maxBin - minBin || BIN_SIZE;
    return padL + ((salary - minBin) / range) * chartW;
  };

  const medianX = Math.min(Math.max(xForSalary(median), padL), W - padR);
  const avgX = Math.min(Math.max(xForSalary(avg), padL), W - padR);

  // Label anchor: put label on the less-crowded side
  const medianAnchor = medianX > W * 0.65 ? "end" : "start";
  const medianLabelX = medianAnchor === "end" ? medianX - 5 : medianX + 5;

  const avgAnchor = avgX > W * 0.65 ? "end" : "start";
  const avgLabelX = avgAnchor === "end" ? avgX - 5 : avgX + 5;

  // If labels are close, separate vertically
  const labelsClose = Math.abs(medianX - avgX) < 80;
  const medianLabelY = padT - 8;
  const avgLabelY = labelsClose ? padT - 20 : padT - 8;

  return (
    <div className="mt-6">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ fontFamily: "sans-serif" }}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={padL}
            y1={padT + chartH * (1 - t)}
            x2={W - padR}
            y2={padT + chartH * (1 - t)}
            stroke="#f3f4f6"
            strokeWidth="1"
          />
        ))}

        {/* Bars */}
        {bins.map((bin, i) => {
          const x = padL + i * barW;
          const barH = (bin.count / maxCount) * chartH;
          const y = padT + chartH - barH;
          return (
            <g key={i}>
              {bin.count > 0 && (
                <rect
                  x={x + gap / 2}
                  y={y}
                  width={Math.max(barW - gap, 1)}
                  height={barH}
                  fill="#93c5fd"
                  rx="2"
                />
              )}
              {bin.count > 0 && (
                <text
                  x={x + barW / 2}
                  y={y - 4}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#6b7280"
                >
                  {bin.count}
                </text>
              )}
            </g>
          );
        })}

        {/* Average line — dashed, light blue */}
        <line
          x1={avgX}
          y1={padT}
          x2={avgX}
          y2={padT + chartH}
          stroke="#3b82f6"
          strokeWidth="1.5"
          strokeDasharray="5 3"
          opacity="0.6"
        />
        <text
          x={avgLabelX}
          y={avgLabelY}
          textAnchor={avgAnchor}
          fontSize="10"
          fill="#3b82f6"
          opacity="0.8"
        >
          平均 {avg}万
        </text>

        {/* Median line — solid, green, prominent */}
        <line
          x1={medianX}
          y1={padT}
          x2={medianX}
          y2={padT + chartH}
          stroke="#16a34a"
          strokeWidth="2.5"
        />
        <text
          x={medianLabelX}
          y={medianLabelY}
          textAnchor={medianAnchor}
          fontSize="11"
          fill="#16a34a"
          fontWeight="700"
        >
          中央値 {median}万
        </text>

        {/* X axis */}
        <line
          x1={padL}
          y1={padT + chartH}
          x2={W - padR}
          y2={padT + chartH}
          stroke="#e5e7eb"
          strokeWidth="1"
        />

        {/* X axis bin labels */}
        {bins.map((bin, i) => (
          <text
            key={i}
            x={padL + i * barW + barW / 2}
            y={padT + chartH + 14}
            textAnchor="middle"
            fontSize="9"
            fill="#9ca3af"
          >
            {bin.start}
          </text>
        ))}

        {/* X axis unit */}
        <text
          x={W - padR}
          y={padT + chartH + 28}
          textAnchor="end"
          fontSize="9"
          fill="#9ca3af"
        >
          万円
        </text>
      </svg>

      {/* Legend */}
      <div className="flex gap-6 justify-center mt-1 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <svg width="22" height="10" className="shrink-0">
            <line x1="0" y1="5" x2="22" y2="5" stroke="#16a34a" strokeWidth="2.5" />
          </svg>
          <span>中央値 {median}万円</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="22" height="10" className="shrink-0">
            <line
              x1="0"
              y1="5"
              x2="22"
              y2="5"
              stroke="#3b82f6"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity="0.8"
            />
          </svg>
          <span>平均 {avg}万円</span>
        </div>
      </div>
    </div>
  );
}
