import fs from "fs";
import path from "path";
import { ZipArchive } from "archiver";
import { PassThrough } from "stream";
import { getAppUrl } from "./auth";

export function getScannerExePath(): string | null {
  const envPath = process.env.SCANNER_EXE_PATH;
  if (envPath && fs.existsSync(envPath)) return envPath;

  const candidates = [
    path.join(process.cwd(), "public", "scanner", "171-screens.exe"),
    path.join(process.cwd(), "scanner", "171-screens.exe"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

export function buildInstallUrl(pin: string) {
  return `${getAppUrl()}/install/${pin}`;
}

export async function buildInstallerZip(opts: {
  pin: string;
  name?: string;
  game?: string;
}): Promise<Buffer> {
  const appUrl = getAppUrl();
  const config = {
    pin: opts.pin,
    name: opts.name ?? "",
    game: opts.game ?? "FREE FIRE",
    api: `${appUrl}/api/scanner`,
    installUrl: buildInstallUrl(opts.pin),
    createdAt: new Date().toISOString(),
  };

  const launcherBat = `@echo off
cd /d "%~dp0"
echo Pin ${opts.pin} configurado.
start "" "171-screens.exe"
`;

  const readme = `171 ScreenS Scanner
===================

Pin: ${opts.pin}
${opts.name ? `Telagem: ${opts.name}\n` : ""}
1. Extraia esta pasta
2. Execute Iniciar-171.bat (ou 171-screens.exe direto)
3. O pin ja esta em 171screens.json — nao precisa digitar

Se o .exe nao veio no zip, coloque 171-screens.exe nesta pasta.
`;

  const exePath = getScannerExePath();
  const archive = new ZipArchive({ zlib: { level: 9 } });
  const pass = new PassThrough();
  const chunks: Buffer[] = [];

  const done = new Promise<Buffer>((resolve, reject) => {
    pass.on("data", (c) => chunks.push(c as Buffer));
    pass.on("end", () => resolve(Buffer.concat(chunks)));
    pass.on("error", reject);
    archive.on("error", reject);
  });

  archive.pipe(pass);
  archive.append(JSON.stringify(config, null, 2), { name: "171screens.json" });
  archive.append(JSON.stringify(config), { name: "171screens.pin" });
  archive.append(launcherBat, { name: "Iniciar-171.bat" });
  archive.append(readme, { name: "LEIA-ME.txt" });

  if (exePath) {
    archive.file(exePath, { name: "171-screens.exe" });
  }

  await archive.finalize();
  return done;
}
