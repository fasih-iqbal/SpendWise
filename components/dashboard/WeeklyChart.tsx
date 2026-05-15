"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useCurrency } from "@/lib/currency";
import { localISODate } from "@/lib/utils";
import type { Expense } from "@/lib/types";

type Period = "Day" | "Week" | "Month" | "Year";
const PERIODS: Period[] = ["Day", "Week", "Month", "Year"];

interface ChartPoint {
  label: string;
  date: string;
  amount: number;
}

interface Props {
  /** Raw expenses for live filtering */
  expenses: Expense[];
}

const HEIGHT = 130;
const PADDING = { top: 20, bottom: 28, left: 8, right: 8 };

function parseLocalDate(dateStr: string): Date {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return new Date(dateStr);
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  if (!y || !m || !d) return new Date(dateStr);
  return new Date(y, m - 1, d);
}

function parseChartDate(dateStr: string): Date {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr)
    ? parseLocalDate(dateStr)
    : new Date(dateStr);
}

function expenseDay(dateStr: string): Date {
  const d = new Date(dateStr);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function getDateRange(period: Period): { start: Date; end: Date } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  switch (period) {
    case "Day":
      return { start: today, end: today };
    case "Week": {
      const dow = today.getDay();
      const start = new Date(today);
      start.setDate(today.getDate() - dow);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return { start, end };
    }
    case "Month":
      return {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: new Date(today.getFullYear(), today.getMonth() + 1, 0),
      };
    case "Year":
      return {
        start: new Date(today.getFullYear(), 0, 1),
        end: new Date(today.getFullYear(), 11, 31),
      };
  }
}

function buildPoints(expenses: Expense[], period: Period): ChartPoint[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (period === "Day") {
    // 24 hours broken into 6 blocks of 4h
    const { start } = getDateRange("Day");
    const points: ChartPoint[] = [];
    for (let h = 0; h < 24; h += 4) {
      const label = `${String(h).padStart(2, "0")}:00`;
      const todayIso = localISODate(start);
      const amount = expenses
        .filter((e) => {
          if (expenseDay(e.date).getTime() !== start.getTime()) return false;
          const created = e.created_at
            ? new Date(e.created_at)
            : new Date(`${e.date}T00:00:00`);
          const hour = created.getHours();
          return hour >= h && hour < h + 4;
        })
        .reduce((s, e) => s + Number(e.amount), 0);
      const iso = `${todayIso}T${String(h).padStart(2, "0")}:00`;
      points.push({ label, date: iso, amount });
    }
    return points;
  }

  if (period === "Week") {
    // current week Mon–Sun (7 days)
    const { start } = getDateRange("Week");
    const points: ChartPoint[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const iso = localISODate(d);
      const amount = expenses
        .filter((e) => expenseDay(e.date).getTime() === d.getTime())
        .reduce((s, e) => s + Number(e.amount), 0);
      points.push({ label: dayLabels[d.getDay()], date: iso, amount });
    }
    return points;
  }

  if (period === "Month") {
    // last 4 weeks (28 days) shown as 4 weekly buckets
    const { start, end } = getDateRange("Month");
    const monthStart = new Date(start);
    const points: ChartPoint[] = [];
    for (let w = 0; w < 4; w++) {
      const weekStart = new Date(monthStart);
      weekStart.setDate(monthStart.getDate() + w * 7);
      const weekEnd = w < 3 ? new Date(weekStart) : new Date(end);
      if (w < 3) weekEnd.setDate(weekStart.getDate() + 6);
      const isoStart = localISODate(weekStart);
      const isoEnd = localISODate(weekEnd);
      const amount = expenses
        .filter((e) => {
          const d = expenseDay(e.date);
          return d >= weekStart && d <= weekEnd;
        })
        .reduce((s, e) => s + Number(e.amount), 0);
      const label = `W${w + 1}`;
      points.push({ label, date: isoStart, amount });
    }
    return points;
  }

  // Year — 12 months
  const points: ChartPoint[] = [];
  for (let m = 0; m < 12; m++) {
    const amount = expenses
      .filter((e) => {
        const d = expenseDay(e.date);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === m;
      })
      .reduce((s, e) => s + Number(e.amount), 0);
    points.push({
      label: monthLabels[m],
      date: `${now.getFullYear()}-${String(m + 1).padStart(2, "0")}-01`,
      amount,
    });
  }
  return points;
}

export function WeeklyChart({ expenses }: Props) {
  const { format, currency } = useCurrency();
  const [activePeriod, setActivePeriod] = useState<Period>("Week");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const data = useMemo(
    () => buildPoints(expenses, activePeriod),
    [expenses, activePeriod],
  );

  const periodTotal = useMemo(() => {
    const { start, end } = getDateRange(activePeriod);
    return expenses
      .filter((e) => {
        const d = expenseDay(e.date);
        return d >= start && d <= end;
      })
      .reduce((s, e) => s + Number(e.amount), 0);
  }, [expenses, activePeriod]);

  const defaultSelected = useMemo(() => {
    if (activePeriod === "Week") {
      const today = new Date();
      return today.getDay(); // Sun=0
    }
    if (activePeriod === "Day") return 0;
    if (activePeriod === "Month") return 3;
    return new Date().getMonth();
  }, [activePeriod]);

  const [selected, setSelected] = useState<number>(defaultSelected);

  useEffect(() => {
    setSelected(defaultSelected);
  }, [activePeriod, defaultSelected]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(320);
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 0) setWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.amount)) * 1.15 || 1;
  const min = 0;
  const innerH = HEIGHT - PADDING.top - PADDING.bottom;
  const innerW = width - PADDING.left - PADDING.right;
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;

  const points = data.map((d, i) => ({
    x: PADDING.left + i * stepX,
    y: PADDING.top + innerH - ((d.amount - min) / (max - min)) * innerH,
    val: d.amount,
    label: d.label,
    date: d.date,
  }));

  const path = points.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = arr[i - 1];
    const cx1 = prev.x + (p.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (p.x - prev.x) / 2;
    const cy2 = p.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`;
  }, "");

  const areaPath = `${path} L ${points[points.length - 1].x} ${PADDING.top + innerH} L ${points[0].x} ${PADDING.top + innerH} Z`;
  const safeSelected = Math.min(selected, points.length - 1);
  const sel = points[safeSelected] ?? points[0];
  const formattedDate = (() => {
    try {
      return parseChartDate(sel.date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return sel.date;
    }
  })();

  return (
    <div
      style={{
        margin: "0 20px 16px",
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.07)",
        borderRadius: 22,
        padding: 18,
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <p style={{ fontWeight: 700, fontSize: 16, color: "#1A1410" }}>
          Analytics
        </p>

        {/* Period picker */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setDropdownOpen((o) => !o)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "rgba(0,0,0,0.04)",
              border: "none",
              borderRadius: 999,
              padding: "5px 12px",
              fontSize: 11,
              color: "#1A1410",
              fontFamily: "inherit",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {activePeriod}
            <ChevronDown
              size={12}
              color="#1A1410"
              style={{
                transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                right: 0,
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.09)",
                borderRadius: 14,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                overflow: "hidden",
                zIndex: 50,
                minWidth: 100,
              }}
            >
              {PERIODS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setActivePeriod(p);
                    setDropdownOpen(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "9px 16px",
                    textAlign: "left",
                    fontSize: 13,
                    fontWeight: p === activePeriod ? 700 : 500,
                    color: p === activePeriod ? "#D07850" : "#1A1410",
                    background: p === activePeriod ? "#FBF6F0" : "transparent",
                    border: "none",
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Highlighted amount */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 4,
        }}
      >
        {/* <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 10,
            background: "#D07850",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 12 }}>{currency.symbol}</span>
        </div> */}
        <p style={{ fontWeight: 700, fontSize: 18, color: "#D07850" }}>
          -{format(periodTotal, { decimals: 2 })}
        </p>
      </div>

      {/* Chart */}
      <div
        ref={containerRef}
        style={{ position: "relative", width: "100%", height: HEIGHT }}
      >
        <svg
          key={activePeriod}
          width={width}
          height={HEIGHT}
          style={{ display: "block", overflow: "visible" }}
        >
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D07850" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#D07850" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2C6A49" />
              <stop offset="55%" stopColor="#D07850" />
              <stop offset="100%" stopColor="#C9A830" />
            </linearGradient>
          </defs>

          <motion.path
            d={areaPath}
            fill="url(#areaGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
          <motion.path
            d={path}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Vertical guide line at selected */}
          <line
            x1={sel.x}
            x2={sel.x}
            y1={PADDING.top - 8}
            y2={PADDING.top + innerH}
            stroke="rgba(0,0,0,0.12)"
            strokeDasharray="3 3"
            strokeWidth={1}
          />

          {/* Touch areas */}
          {points.map((p, i) => (
            <rect
              key={i}
              x={p.x - stepX / 2}
              y={0}
              width={stepX}
              height={HEIGHT}
              fill="transparent"
              style={{ cursor: "pointer" }}
              onClick={() => setSelected(i)}
              onMouseEnter={() => setSelected(i)}
            />
          ))}

          {/* Selected dot */}
          <circle
            cx={sel.x}
            cy={sel.y}
            r={7}
            fill="#fff"
            stroke="#D07850"
            strokeWidth={2.5}
          />
          <circle cx={sel.x} cy={sel.y} r={3} fill="#D07850" />

          {/* X-axis labels */}
          {points.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={HEIGHT - 6}
              textAnchor="middle"
              fontSize="10"
              fill={i === safeSelected ? "#D07850" : "#A8998A"}
              fontWeight={i === safeSelected ? 700 : 400}
              fontFamily="var(--font-urbanist), sans-serif"
            >
              {p.label}
            </text>
          ))}
        </svg>

        {/* Tooltip */}
        <div
          style={{
            position: "absolute",
            left: Math.min(Math.max(sel.x - 60, 0), width - 120),
            top: Math.max(sel.y - 56, 0),
            background: "#1A1410",
            color: "#fff",
            borderRadius: 10,
            padding: "6px 10px",
            fontSize: 11,
            pointerEvents: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
            minWidth: 110,
            textAlign: "left",
          }}
        >
          <p style={{ fontWeight: 700, fontSize: 12, marginBottom: 1 }}>
            -{format(sel.val, { decimals: 2 })}
          </p>
          <p style={{ fontSize: 9, opacity: 0.7 }}>{formattedDate}</p>
        </div>
      </div>
    </div>
  );
}
