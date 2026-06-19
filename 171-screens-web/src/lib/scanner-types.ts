export type ScannerPlan = "pro" | "private" | "enterprise" | "team" | null;
export type PinStatus = "pending" | "scanning" | "finished" | "expired";
export type PinResult = "none" | "clean" | "warning" | "suspicious" | "cheating";

export type ScanDisplayTotals = {
  detections: number;
  warnings: number;
  suspicious: number;
  integrity: number;
  bamList: number;
  bypassList: number;
  powershellHistory: number;
  recordingSoftware: number;
  prefetchList: number;
  processList: number;
  adminLogs: number;
  browserList: number;
  usbList: number;
};

export interface CustomPattern {
  process: string;
  name: string;
  value: string;
  severity: string;
}

export interface GlobalConfigDoc {
  key?: string;
  scannerName: string;
  primaryColor: string;
  spinnerColor1: string;
  spinnerColor2: string;
  spinnerColor3: string;
  logoUrl?: string;
  loadingPhrases?: string[];
  customPatterns: CustomPattern[];
  publicStrings?: CustomPattern[];
  publicCustomDetect?: CustomPattern[];
  updatedAt?: Date;
}

export interface ProScannerConfigDoc {
  ownerId: string;
  strings: CustomPattern[];
  customDetect: CustomPattern[];
  scannerName?: string;
  primaryColor?: string;
  spinnerColor1?: string;
  spinnerColor2?: string;
  spinnerColor3?: string;
  logoUrl?: string;
  loadingPhrases?: string[];
  updatedAt: Date;
}

export interface PinDoc {
  _id?: string;
  pin: string;
  name?: string;
  game: string;
  ownerId: string;
  ownerName: string;
  status: PinStatus;
  used: boolean;
  result: PinResult;
  visibility: "private" | "public";
  enterpriseId?: string | null;
  disabled?: boolean;
  expiresAt?: Date | null;
  userPatterns?: CustomPattern[];
  progress?: number;
  scanMessage?: string;
  createdAt: Date;
  finishedAt?: Date | null;
  scanningStartedAt?: Date | null;
}

export interface DetectionItem {
  title: string;
  description: string;
  severity: string;
  category: string;
  score?: number;
}

export interface ScanDoc {
  _id?: string;
  pin: string;
  ownerId: string;
  isRumDump?: boolean;
  screenshotUrl?: string;
  systemInfo?: Record<string, string>;
  discordInfo?: { accounts: { id: string; username: string; discriminator?: string }[] };
  steamList?: { steamId: string; steamName: string }[];
  detections: DetectionItem[];
  warnings: DetectionItem[];
  suspicious: DetectionItem[];
  integrity: DetectionItem[];
  bamList?: (string | Record<string, unknown>)[];
  bypassList?: (string | Record<string, unknown>)[];
  powershellHistory?: (string | Record<string, unknown>)[];
  recordingSoftware?: (string | Record<string, unknown>)[];
  prefetchList?: (string | Record<string, unknown>)[];
  processList?: (string | Record<string, unknown>)[];
  unsignedList?: (string | Record<string, unknown>)[];
  adminLogs?: (string | Record<string, unknown>)[];
  executedFilesList?: (string | Record<string, unknown>)[];
  browserList?: (string | Record<string, unknown>)[];
  defenderList?: (string | Record<string, unknown>)[];
  regeditList?: (string | Record<string, unknown>)[];
  modsList?: { title: string; description: string }[];
  pcaClientlist?: (string | Record<string, unknown>)[];
  usbList?: (string | Record<string, unknown>)[];
  streamModeDetected?: boolean;
  createdAt: Date;
}

export interface ScannerUserDoc {
  discordId: string;
  username: string;
  globalName?: string | null;
  email?: string | null;
  plan: ScannerPlan;
  enterpriseId?: string | null;
  keyId?: string | null;
  planExpiresAt?: Date | null;
}

export type ScannerKeyStatus = "active" | "redeemed" | "banned" | "expired";

export interface ScannerKeyDoc {
  _id?: string;
  key: string;
  plan: Exclude<ScannerPlan, null>;
  status: ScannerKeyStatus;
  durationDays: number;
  expiresAt: Date | null;
  createdAt: Date;
  createdBy: string;
  note?: string;
  redeemedBy?: string | null;
  redeemedAt?: Date | null;
  bannedAt?: Date | null;
  bannedBy?: string | null;
}

export interface EnterpriseDoc {
  _id?: string;
  enterpriseId: string;
  name: string;
  ownerId: string;
  plan: "team" | "enterprise";
  memberIds: string[];
  memberEmails?: string[];
  config: Partial<GlobalConfigDoc>;
  features: {
    customImgui: boolean;
    customColors: boolean;
    customLogo: boolean;
    customStrings: boolean;
    customDetect: boolean;
    dmaDetect: boolean;
    uefiDetect: boolean;
    yaraMethod: boolean;
    customLoading: boolean;
  };
  createdAt: Date;
}
