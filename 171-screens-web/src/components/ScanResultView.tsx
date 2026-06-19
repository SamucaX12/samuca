"use client";

import { useState } from "react";
import { ScanDoc, ScanDisplayTotals } from "@/lib/scanner-types";
import {
  filterThreatDetections,
  parseSiteEntry,
  siteCategoryStyle,
} from "@/lib/scan-threat-helpers";
import {
  Shield,
  Monitor,
  Terminal,
  AlertTriangle,
  CheckCircle,
  XCircle,
  User,
  Cpu,
  FileText,
  LayoutGrid,
  Globe,
  Wifi,
  Usb,
  HardDrive,
} from "lucide-react";
import { StatusPill } from "@/components/scanner/PinBadge";

type ListEntry = string | Record<string, unknown>;
type MainTab = "overview" | "detections" | "threats" | "system" | "accounts" | "logs";
type DetectionTab = "critical" | "warning" | "suspicious" | "integrity";
type SystemTab = "bam" | "bypass" | "powershell" | "prefetch" | "process" | "stream" | "recorder";

const DETECTION_STYLES = {
  critical: { card: "border-red-500/30 bg-red-500/10", title: "text-red-200", badge: "bg-red-500/20 text-red-300" },
  warning: { card: "border-amber-500/30 bg-amber-500/10", title: "text-amber-200", badge: "bg-amber-500/20 text-amber-300" },
  suspicious: { card: "border-orange-500/30 bg-orange-500/10", title: "text-orange-200", badge: "bg-orange-500/20 text-orange-300" },
  integrity: { card: "border-emerald-500/30 bg-emerald-500/10", title: "text-emerald-200", badge: "bg-emerald-500/20 text-emerald-300" },
} as const;

function parseListEntry(item: ListEntry): Record<string, unknown> | string {
  if (typeof item === "string") {
    const trimmed = item.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try {
        return parseListEntry(JSON.parse(trimmed) as Record<string, unknown>);
      } catch {
        return item;
      }
    }
    return item;
  }
  return item;
}

function formatListItem(item: ListEntry): string {
  const parsed = parseListEntry(item);
  if (typeof parsed === "string") return parsed;
  if ("pathValue" in parsed && "timeStamp" in parsed) {
    const path = String(parsed.pathValue ?? "");
    const time = String(parsed.timeStamp ?? "");
    return time ? `${path} · ${time}` : path;
  }
  if ("processName" in parsed) {
    const name = String(parsed.processName ?? "");
    const start = String(parsed.processStart ?? "");
    return start ? `${name} — ${start}` : name;
  }
  if ("fileName" in parsed) {
    const name = String(parsed.fileName ?? "");
    const size = parsed.fileSize ? ` · ${parsed.fileSize}` : "";
    const status = parsed.fileStatus ? ` · ${parsed.fileStatus}` : "";
    return `${name}${size}${status}`;
  }
  try {
    return JSON.stringify(parsed);
  } catch {
    return String(parsed);
  }
}

function isProcessActive(item: ListEntry): boolean | null {
  const parsed = parseListEntry(item);
  if (typeof parsed === "string") {
    if (parsed.includes("[Ativo]")) return true;
    if (parsed.includes("[OFF]")) return false;
    return null;
  }
  if (typeof parsed === "object" && parsed && "processName" in parsed) {
    const name = String(parsed.processName ?? "");
    if (name.includes("[Ativo]")) return true;
    if (name.includes("[OFF]")) return false;
  }
  return null;
}

function TabBtn({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-screens-accent bg-screens-accent/15 text-screens-accent"
          : "border-screens-border bg-screens-card/50 text-screens-muted hover:border-white/20 hover:text-white"
      }`}
    >
      {children}
      {count !== undefined && count > 0 && (
        <span className="rounded-full bg-black/20 px-2 py-0.5 text-xs">{count}</span>
      )}
    </button>
  );
}

function Section({
  title,
  subtitle,
  icon: Icon,
  count,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-screens-border bg-screens-card/70">
      <div className="flex items-center gap-3 border-b border-screens-border px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-screens-accent/10">
          <Icon className="h-4 w-4 text-screens-accent" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold">{title}</h3>
          {subtitle && <p className="text-xs text-screens-muted">{subtitle}</p>}
        </div>
        {count !== undefined && (
          <span className="rounded-full border border-screens-border px-2.5 py-0.5 text-xs text-screens-muted">
            {count}
          </span>
        )}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function DetectionCards({
  items,
  total,
  variant,
  empty,
}: {
  items: ScanDoc["detections"];
  total?: number;
  variant: keyof typeof DETECTION_STYLES;
  empty: string;
}) {
  const style = DETECTION_STYLES[variant];
  if (!items?.length) {
    return (
      <div className={`rounded-xl border border-dashed px-4 py-10 text-center text-sm ${style.card}`}>
        {empty}
      </div>
    );
  }
  const hidden = (total ?? items.length) - items.length;
  return (
    <div className="space-y-3">
      {items.map((d, i) => (
        <div key={i} className={`rounded-xl border p-4 ${style.card}`}>
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${style.badge}`}>
              {d.severity}
            </span>
            <span className="rounded-md bg-black/20 px-2 py-0.5 text-[10px] text-screens-muted">{d.category}</span>
          </div>
          <p className={`mt-2 font-medium ${style.title}`}>{d.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-screens-muted">{d.description}</p>
        </div>
      ))}
      {hidden > 0 && (
        <p className="text-center text-xs text-screens-muted">+{hidden} ocultos — total: {total}</p>
      )}
    </div>
  );
}

function ListBlock({
  items,
  total,
  empty,
  variant = "default",
}: {
  items?: ListEntry[];
  total?: number;
  empty: string;
  variant?: "default" | "bypass" | "process";
}) {
  if (!items?.length) {
    return (
      <div className="rounded-xl border border-dashed border-screens-border px-4 py-10 text-center text-sm text-screens-muted">
        {empty}
      </div>
    );
  }
  const hidden = (total ?? items.length) - items.length;
  return (
    <ul className="max-h-[480px] space-y-2 overflow-y-auto pr-1">
      {items.map((item, i) => {
        const active = variant === "process" ? isProcessActive(item) : null;
        let cls = "border-screens-border/60 bg-screens-bg text-screens-muted";
        if (variant === "bypass") cls = "border-violet-500/35 bg-violet-500/10 text-violet-200";
        if (active === true) cls = "border-emerald-500/35 bg-emerald-500/10 text-emerald-200";
        if (active === false) cls = "border-red-500/35 bg-red-500/10 text-red-200";
        return (
          <li key={i} className={`rounded-xl border px-4 py-3 font-mono text-xs leading-relaxed break-all ${cls}`}>
            {active !== null && (
              <span className={`mr-2 rounded px-1.5 py-0.5 text-[10px] font-bold ${active ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
                {active ? "ON" : "OFF"}
              </span>
            )}
            {formatListItem(item)}
          </li>
        );
      })}
      {hidden > 0 && (
        <li className="py-2 text-center text-xs text-screens-muted">+{hidden} ocultos — total: {total}</li>
      )}
    </ul>
  );
}

export function ScanResultView({
  scan,
  totals,
  pinResult,
}: {
  scan: ScanDoc;
  totals?: ScanDisplayTotals;
  pinResult?: string;
}) {
  const sys = scan.systemInfo ?? {};
  const [mainTab, setMainTab] = useState<MainTab>("overview");
  const [detectionTab, setDetectionTab] = useState<DetectionTab>("critical");
  const [systemTab, setSystemTab] = useState<SystemTab>("bam");

  const remote = filterThreatDetections(scan, "remote");
  const dma = filterThreatDetections(scan, "dma");
  const usb = filterThreatDetections(scan, "usb");

  const counts = {
    critical: totals?.detections ?? scan.detections?.length ?? 0,
    warning: totals?.warnings ?? scan.warnings?.length ?? 0,
    suspicious: totals?.suspicious ?? scan.suspicious?.length ?? 0,
    integrity: totals?.integrity ?? scan.integrity?.length ?? 0,
    discord: scan.discordInfo?.accounts?.length ?? 0,
    steam: scan.steamList?.length ?? 0,
    bam: totals?.bamList ?? scan.bamList?.length ?? 0,
    bypass: totals?.bypassList ?? scan.bypassList?.length ?? scan.unsignedList?.length ?? 0,
    powershell: totals?.powershellHistory ?? scan.powershellHistory?.length ?? 0,
    prefetch: totals?.prefetchList ?? scan.prefetchList?.length ?? 0,
    process: totals?.processList ?? scan.processList?.length ?? 0,
    admin: totals?.adminLogs ?? scan.adminLogs?.length ?? 0,
    recorder: totals?.recordingSoftware ?? scan.recordingSoftware?.length ?? 0,
    sites: totals?.browserList ?? scan.browserList?.length ?? 0,
    threats: remote.length + dma.length + usb.length + (scan.usbList?.length ?? 0),
  };

  const detectionTotal = counts.critical + counts.warning + counts.suspicious + counts.integrity;
  const systemTotal = counts.bam + counts.bypass + counts.powershell + counts.prefetch + counts.process + counts.recorder;

  return (
    <div className="page-scanner min-h-full">
      {/* Summary bar — always visible */}
      <div className="sticky top-0 z-10 border-b border-screens-border bg-screens-bg/95 px-5 py-4 backdrop-blur-md md:px-8">
        <div className="flex flex-wrap items-center gap-3">
          {pinResult && pinResult !== "none" && <StatusPill value={pinResult} />}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-red-300">
              <strong className="font-bold">{counts.critical}</strong> críticos
            </span>
            <span className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-amber-300">
              <strong className="font-bold">{counts.warning}</strong> warnings
            </span>
            <span className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-orange-300">
              <strong className="font-bold">{counts.suspicious}</strong> suspeitos
            </span>
            <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-300">
              <strong className="font-bold">{counts.integrity}</strong> clean
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <TabBtn active={mainTab === "overview"} onClick={() => setMainTab("overview")}>
            <LayoutGrid className="h-4 w-4" /> Geral
          </TabBtn>
          <TabBtn active={mainTab === "detections"} onClick={() => setMainTab("detections")} count={detectionTotal}>
            <XCircle className="h-4 w-4" /> Detecções
          </TabBtn>
          <TabBtn active={mainTab === "threats"} onClick={() => setMainTab("threats")} count={counts.threats + counts.sites}>
            <Wifi className="h-4 w-4" /> Ameaças
          </TabBtn>
          <TabBtn active={mainTab === "system"} onClick={() => setMainTab("system")} count={systemTotal}>
            <Cpu className="h-4 w-4" /> Sistema
          </TabBtn>
          <TabBtn active={mainTab === "accounts"} onClick={() => setMainTab("accounts")} count={counts.discord + counts.steam}>
            <User className="h-4 w-4" /> Contas
          </TabBtn>
          <TabBtn active={mainTab === "logs"} onClick={() => setMainTab("logs")} count={counts.admin}>
            <FileText className="h-4 w-4" /> Logs
          </TabBtn>
        </div>
      </div>

      <div className="space-y-5 p-5 md:p-8 max-w-6xl">
        {mainTab === "overview" && (
          <div className="space-y-5">
            <Section title="Informações do PC" icon={Monitor}>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "PC", value: sys.pcName ?? "—" },
                  { label: "Usuário", value: sys.username ?? "—" },
                  { label: "HWID", value: sys.hwid ? `${sys.hwid.slice(0, 20)}…` : "—" },
                  { label: "IP", value: sys.ip ?? "—" },
                ].map((f) => (
                  <div key={f.label} className="rounded-xl border border-screens-border bg-screens-bg px-4 py-3">
                    <p className="text-[10px] uppercase tracking-wide text-screens-muted">{f.label}</p>
                    <p className="mt-1 truncate font-mono text-sm">{f.value}</p>
                  </div>
                ))}
              </div>
            </Section>

            {scan.screenshotUrl && (
              <Section title="Screenshot" subtitle="Captura durante o scan" icon={Monitor}>
                <img
                  src={scan.screenshotUrl}
                  alt="Screenshot do scan"
                  className="max-h-[400px] w-full rounded-xl border border-screens-border object-contain bg-black/20"
                />
              </Section>
            )}

            <div className="grid gap-5 lg:grid-cols-2">
              <Section title="Resumo detecções" icon={AlertTriangle} count={detectionTotal}>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Críticos", val: counts.critical, tone: "text-red-300", border: "border-red-500/30" },
                    { label: "Warnings", val: counts.warning, tone: "text-amber-300", border: "border-amber-500/30" },
                    { label: "Suspeitos", val: counts.suspicious, tone: "text-orange-300", border: "border-orange-500/30" },
                    { label: "Clean", val: counts.integrity, tone: "text-emerald-300", border: "border-emerald-500/30" },
                  ].map((s) => (
                    <div key={s.label} className={`rounded-xl border bg-screens-bg px-4 py-3 ${s.border}`}>
                      <p className="text-[10px] text-screens-muted">{s.label}</p>
                      <p className={`text-xl font-black ${s.tone}`}>{s.val}</p>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setMainTab("detections")}
                  className="mt-4 w-full rounded-xl bg-screens-accent py-2.5 text-sm font-bold text-black hover:opacity-90"
                >
                  Ver detecções →
                </button>
              </Section>

              <Section title="Resumo sistema" icon={Terminal} count={systemTotal}>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "BAM", val: counts.bam },
                    { label: "Bypass", val: counts.bypass },
                    { label: "Processos", val: counts.process },
                    { label: "Prefetch", val: counts.prefetch },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-screens-border bg-screens-bg px-4 py-3">
                      <p className="text-[10px] text-screens-muted">{s.label}</p>
                      <p className="text-xl font-black">{s.val}</p>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setMainTab("system")}
                  className="mt-4 w-full rounded-xl border border-screens-border py-2.5 text-sm font-medium hover:border-screens-accent/40"
                >
                  Ver sistema →
                </button>
              </Section>
            </div>
          </div>
        )}

        {mainTab === "detections" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(["critical", "warning", "suspicious", "integrity"] as const).map((t) => (
                <TabBtn key={t} active={detectionTab === t} onClick={() => setDetectionTab(t)} count={counts[t === "critical" ? "critical" : t]}>
                  {t === "critical" ? "Críticos" : t === "warning" ? "Warnings" : t === "suspicious" ? "Suspeitos" : "Clean"}
                </TabBtn>
              ))}
            </div>
            {detectionTab === "critical" && (
              <Section title="Detecções críticas" icon={XCircle} count={counts.critical}>
                <DetectionCards items={scan.detections} total={totals?.detections} variant="critical" empty="Nenhuma detecção crítica" />
              </Section>
            )}
            {detectionTab === "warning" && (
              <Section title="Warnings" icon={AlertTriangle} count={counts.warning}>
                <DetectionCards items={scan.warnings} total={totals?.warnings} variant="warning" empty="Nenhum warning" />
              </Section>
            )}
            {detectionTab === "suspicious" && (
              <Section title="Suspeitos" icon={AlertTriangle} count={counts.suspicious}>
                <DetectionCards items={scan.suspicious} total={totals?.suspicious} variant="suspicious" empty="Nenhum suspeito" />
              </Section>
            )}
            {detectionTab === "integrity" && (
              <Section title="Clean / Integridade" icon={CheckCircle} count={counts.integrity}>
                <DetectionCards items={scan.integrity} total={totals?.integrity} variant="integrity" empty="Nenhum item de integridade" />
              </Section>
            )}
          </div>
        )}

        {mainTab === "threats" && (
          <div className="space-y-5">
            <Section title="Remote" subtitle="Acesso remoto e conexões suspeitas" icon={Wifi} count={remote.length}>
              <DetectionCards items={remote} variant="critical" empty="Nenhuma detecção remote" />
            </Section>
            <Section title="DMA" subtitle="Hardware FPGA / PCIe" icon={HardDrive} count={dma.length}>
              <DetectionCards items={dma} variant="critical" empty="Nenhuma detecção DMA" />
            </Section>
            <Section title="USB" subtitle="Dispositivos e detecções USB" icon={Usb} count={usb.length + (scan.usbList?.length ?? 0)}>
              <DetectionCards items={usb} variant="warning" empty="Nenhuma detecção USB" />
              {(scan.usbList?.length ?? 0) > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold text-screens-muted">Dispositivos USB</p>
                  <ListBlock items={scan.usbList} empty="—" />
                </div>
              )}
            </Section>
            <Section title="Sites" subtitle="Histórico do navegador" icon={Globe} count={counts.sites}>
              {!scan.browserList?.length ? (
                <div className="rounded-xl border border-dashed border-screens-border px-4 py-10 text-center text-sm text-screens-muted">
                  Nenhum site detectado
                </div>
              ) : (
                <ul className="max-h-[480px] space-y-2 overflow-y-auto">
                  {(scan.browserList as string[]).map((entry, i) => {
                    const { category, url } = parseSiteEntry(String(entry));
                    return (
                      <li key={i} className="rounded-xl border border-screens-accent/20 bg-screens-accent/5 px-4 py-3">
                        <span className={`inline-block rounded border px-2 py-0.5 text-[10px] font-bold uppercase ${siteCategoryStyle(category)}`}>
                          {category}
                        </span>
                        <p className="mt-2 break-all font-mono text-xs text-screens-accent">{url}</p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Section>
          </div>
        )}

        {mainTab === "system" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["bam", "BAM", counts.bam],
                  ["bypass", "Bypass", counts.bypass],
                  ["powershell", "PowerShell", counts.powershell],
                  ["prefetch", "Prefetch", counts.prefetch],
                  ["process", "Processos", counts.process],
                  ["recorder", "Gravador", counts.recorder],
                  ["stream", "Stream", 0],
                ] as const
              ).map(([key, label, count]) => (
                <TabBtn key={key} active={systemTab === key} onClick={() => setSystemTab(key)} count={count || undefined}>
                  {label}
                </TabBtn>
              ))}
            </div>
            {systemTab === "bam" && (
              <Section title="BAM" icon={Terminal} count={counts.bam}>
                <ListBlock items={scan.bamList} total={totals?.bamList} empty="Nenhum registro BAM" />
              </Section>
            )}
            {systemTab === "bypass" && (
              <Section title="Bypass" subtitle="Arquivos unsigned" icon={Terminal} count={counts.bypass}>
                <ListBlock items={scan.bypassList ?? scan.unsignedList} total={totals?.bypassList} empty="Nenhum bypass" variant="bypass" />
              </Section>
            )}
            {systemTab === "powershell" && (
              <Section title="PowerShell" icon={Terminal} count={counts.powershell}>
                <ListBlock items={scan.powershellHistory} total={totals?.powershellHistory} empty="Nenhum comando" />
              </Section>
            )}
            {systemTab === "prefetch" && (
              <Section title="Prefetch" icon={Terminal} count={counts.prefetch}>
                <ListBlock items={scan.prefetchList} total={totals?.prefetchList} empty="Nenhum prefetch" />
              </Section>
            )}
            {systemTab === "process" && (
              <Section title="Processos" icon={Terminal} count={counts.process}>
                <ListBlock items={scan.processList} total={totals?.processList} empty="Nenhum processo" variant="process" />
              </Section>
            )}
            {systemTab === "recorder" && (
              <Section title="Gravador de tela" icon={Monitor} count={counts.recorder}>
                <ListBlock items={scan.recordingSoftware} total={totals?.recordingSoftware} empty="Nenhum gravador" />
              </Section>
            )}
            {systemTab === "stream" && (
              <Section title="Stream Mode" icon={Monitor}>
                <div
                  className={`rounded-xl border px-6 py-10 text-center text-lg font-bold ${
                    scan.streamModeDetected
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  }`}
                >
                  {scan.streamModeDetected ? "STREAM MODE DETECTADO" : "STREAM MODE NÃO DETECTADO"}
                </div>
              </Section>
            )}
          </div>
        )}

        {mainTab === "accounts" && (
          <div className="grid gap-5 lg:grid-cols-2">
            <Section title="Discord" icon={Shield} count={counts.discord}>
              {scan.discordInfo?.accounts?.length ? (
                <div className="space-y-2">
                  {scan.discordInfo.accounts.map((a) => (
                    <div key={a.id} className="rounded-xl border border-screens-border bg-screens-bg p-4">
                      <p className="font-medium">{a.username}</p>
                      <p className="mt-1 font-mono text-xs text-screens-muted">{a.id}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-screens-muted py-6">Nenhuma conta Discord</p>
              )}
            </Section>
            <Section title="Steam" icon={Shield} count={counts.steam}>
              {scan.steamList?.length ? (
                <div className="space-y-2">
                  {scan.steamList.map((s) => (
                    <div key={s.steamId} className="rounded-xl border border-screens-border bg-screens-bg p-4">
                      <p className="font-medium">{s.steamName}</p>
                      <p className="mt-1 font-mono text-xs text-screens-muted">{s.steamId}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-screens-muted py-6">Nenhuma conta Steam</p>
              )}
            </Section>
          </div>
        )}

        {mainTab === "logs" && (
          <Section title="Admin Logs" icon={FileText} count={counts.admin}>
            <ListBlock items={scan.adminLogs} total={totals?.adminLogs} empty="Nenhum log" />
          </Section>
        )}
      </div>
    </div>
  );
}
