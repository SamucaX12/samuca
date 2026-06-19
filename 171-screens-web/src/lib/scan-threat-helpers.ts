import { DetectionItem, ScanDoc } from "./scanner-types";

export type ThreatArea = "remote" | "dma" | "usb";

export function allScanDetections(scan: ScanDoc): DetectionItem[] {
  return [...(scan.detections ?? []), ...(scan.warnings ?? []), ...(scan.suspicious ?? [])];
}

const REMOTE_RE =
  /remote|rdma|anydesk|teamviewer|rustdesk|parsec|vnc|sunshine|acesso remoto|conexao remota|remote bypass|remote control/i;
const DMA_RE = /dma|fpga|pcie|xilinx|altera|leechcore|pcileech|ven_10ee|ven_1172|ven_1204|fuser|screamer|enigma/i;
const USB_RE = /usb|usbstor|pendrive|arduino|teensy|removivel|dispositivo usb|historico usb/i;

function matchesArea(item: DetectionItem, area: ThreatArea): boolean {
  const cat = (item.category ?? "").toLowerCase();
  const blob = `${item.title} ${item.description}`.toLowerCase();

  if (area === "remote") {
    return (
      cat.includes("remote") ||
      cat === "network" ||
      cat.includes("remote bypass") ||
      REMOTE_RE.test(blob)
    );
  }

  if (area === "usb") {
    return cat === "usb" || USB_RE.test(blob);
  }

  // dma — exclude pure USB hits
  if (cat === "usb" || USB_RE.test(blob)) return false;
  return cat === "dma" || DMA_RE.test(blob);
}

export function filterThreatDetections(scan: ScanDoc, area: ThreatArea): DetectionItem[] {
  return allScanDetections(scan).filter((d) => matchesArea(d, area));
}

export function countThreatArea(scan: ScanDoc, area: ThreatArea): number {
  return filterThreatDetections(scan, area).length;
}

export function parseSiteEntry(entry: string) {
  const match = entry.match(/^\[([^\]]+)\]\s*(.+)$/);
  return {
    category: match?.[1] ?? "Site",
    url: match?.[2] ?? entry,
  };
}

export function siteCategoryStyle(category: string) {
  const c = category.toLowerCase();
  if (c.includes("remote")) return "bg-sky-500/20 text-sky-300 border-sky-500/30";
  if (c.includes("cheat") || c.includes("blacklist")) return "bg-red-500/20 text-red-300 border-red-500/30";
  if (c.includes("hidden bypass")) return "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30";
  if (c.includes("auth")) return "bg-amber-500/20 text-amber-300 border-amber-500/30";
  return "bg-screens-accent/15 text-screens-accent border-screens-accent/30";
}
