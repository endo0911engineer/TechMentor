"use client";

interface Props {
  salaries: number[];
  median: number;
  avg: number;
}

const MIN_DISPLAY_COUNT = 3;
const MIN_BINS = 5;

/** データ件数と範囲から適切なビン幅を選ぶ */
function chooseBinSize(count: number, range: number): number {
  const targetBins = Math.min(Math.max(Math.ceil(Math.sqrt(count)), MIN_BINS), 15);
  const raw = range / Math.max(targetBins, 1);
  for (const b of [50, 100, 200, 500]) {
    if (b >= raw) return b;
  }
  return 500;
}

export default function SalaryHistogram({ salaries, median, avg }: Props) {
  if (salaries.length === 0) return null;

  // ── 件数不足: グラフ非表示 ──────────────────────────────────────────
  if (salaries.length < MIN_DISPLAY_COUNT) {
    return (
      <p className="mt-4 text-center text-xs text-gray-400">
        分布グラフはデータが {MIN_DISPLAY_COUNT} 件以上で表示されます（現在 {salaries.length} 件）
      </p>
    );
  }

  // ── ビン計算（最小 MIN_BINS 本を保証） ────────────────────────────
  const minVal = Math.min(...salaries);
  const maxVal = Math.max(...salaries);
  const BIN_SIZE = chooseBinSize(salaries.length, maxVal - minVal);

  let minBin = Math.floor(minVal / BIN_SIZE) * BIN_SIZE;
  const rawMaxBin = Math.ceil(maxVal / BIN_SIZE) * BIN_SIZE;
  let numBins = Math.max((rawMaxBin - minBin) / BIN_SIZE, 1);

  // 両端にパディングを追加して最低 MIN_BINS 本にする
  if (numBins < MIN_BINS) {
    const extra = MIN_BINS - numBins;
    const padLeft = Math.floor(extra / 2);
    minBin = Math.max(0, minBin - padLeft * BIN_SIZE);
    numBins = MIN_BINS;
  }

  const maxBin = minBin + numBins * BIN_SIZE;

  const bins = Array.from({ length: numBins }, (_, i) => {
    const start = minBin + i * BIN_SIZE;
    const end = start + BIN_SIZE;
    const count = salaries.filter(
      (s) => s >= start && (i === numBins - 1 ? s <= end : s < end)
    ).length;
    return { start, end, count };
  });

  const maxCount = Math.max(...bins.map((b) => b.count), 1);

  // ── SVG レイアウト ────────────────────────────────────────────────
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
  const avgX    = Math.min(Math.max(xForSalary(avg),    padL), W - padR);

  // 中央値と平均が近すぎる（ピクセル差 < 6）場合は中央値=平均として1本にする
  const sameLines = Math.abs(medianX - avgX) < 6;

  // X軸ラベル: ビンが多い場合は間引く
  const labelStep = numBins <= 7 ? 1 : numBins <= 12 ? 2 : 3;

  return (
    <div className="mt-6">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ fontFamily: "sans-serif" }}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={padL} y1={padT + chartH * (1 - t)}
            x2={W - padR} y2={padT + chartH * (1 - t)}
            stroke="#f3f4f6" strokeWidth="1"
          />
        ))}

        {/* Bars */}
        {bins.map((bin, i) => {
          const x = padL + i * barW;
          const barH = (bin.count / maxCount) * chartH;
          const y = padT + chartH - barH;
          return (
            <g key={i}>
              <rect
                x={x + gap / 2}
                y={bin.count > 0 ? y : padT + chartH}
                width={Math.max(barW - gap, 1)}
                height={bin.count > 0 ? barH : 0}
                fill={bin.count > 0 ? "#93c5fd" : "none"}
                rx="2"
              />
              {bin.count > 0 && (
                <text
                  x={x + barW / 2} y={y - 4}
                  textAnchor="middle" fontSize="10" fill="#6b7280"
                >
                  {bin.count}
                </text>
              )}
            </g>
          );
        })}

        {/* Average line（中央値と離れている場合のみ） */}
        {!sameLines && (
          <line
            x1={avgX} y1={padT} x2={avgX} y2={padT + chartH}
            stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6"
          />
        )}

        {/* Median line */}
        <line
          x1={medianX} y1={padT} x2={medianX} y2={padT + chartH}
          stroke="#16a34a" strokeWidth="2.5"
        />

        {/* X axis */}
        <line
          x1={padL} y1={padT + chartH} x2={W - padR} y2={padT + chartH}
          stroke="#e5e7eb" strokeWidth="1"
        />

        {/* X axis bin labels（間引き） */}
        {bins.map((bin, i) =>
          i % labelStep === 0 ? (
            <text
              key={i}
              x={padL + i * barW + barW / 2}
              y={padT + chartH + 14}
              textAnchor="middle" fontSize="9" fill="#9ca3af"
            >
              {bin.start}
            </text>
          ) : null
        )}

        {/* X axis unit */}
        <text
          x={W - padR} y={padT + chartH + 28}
          textAnchor="end" fontSize="9" fill="#9ca3af"
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
          <span>中央値 {median}万円{sameLines ? "（平均と同値）" : ""}</span>
        </div>
        {!sameLines && (
          <div className="flex items-center gap-1.5">
            <svg width="22" height="10" className="shrink-0">
              <line x1="0" y1="5" x2="22" y2="5" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.8" />
            </svg>
            <span>平均 {avg}万円</span>
          </div>
        )}
      </div>
    </div>
  );
}
