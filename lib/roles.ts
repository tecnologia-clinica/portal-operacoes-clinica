export const TABS_POR_PAPEL: Record<string, string[]> = {
  ADMIN:      ["geral", "comercial", "marketing", "clinico", "atendimento", "experiencia", "financeiro"],
  GERAL:      ["geral"],
  COMERCIAL:  ["comercial"],
  MARKETING:  ["marketing"],
  FINANCEIRO: ["financeiro"],
  EXPERIENCIA:["clinico", "atendimento", "experiencia"],
};

export const SETORES_POR_PAPEL: Record<string, string[]> = {
  ADMIN:      ["comercial", "marketing", "clinico", "atendimento", "experiencia", "financeiro"],
  GERAL:      [],
  COMERCIAL:  ["comercial"],
  MARKETING:  ["marketing"],
  FINANCEIRO: ["financeiro"],
  EXPERIENCIA:["clinico", "atendimento", "experiencia"],
};

export const LABEL_PAPEL: Record<string, string> = {
  ADMIN:      "Admin",
  FINANCEIRO: "Financeiro",
  COMERCIAL:  "Comercial",
  MARKETING:  "Marketing",
  EXPERIENCIA:"Experiência",
  GERAL:      "Geral",
};

export function tabsPermitidas(papel: string): string[] {
  return TABS_POR_PAPEL[papel] ?? ["geral"];
}

export function setoresPermitidos(papel: string): string[] {
  return SETORES_POR_PAPEL[papel] ?? [];
}

export function podeAdmin(papel: string)    { return papel === "ADMIN"; }
export function podePublicar(papel: string) { return papel === "ADMIN"; }
export function podeImportar(papel: string) { return papel !== "GERAL"; }
export function podeAcessarOrcamentos(papel: string) { return papel === "ADMIN" || papel === "COMERCIAL"; }

export function homeDoUsuario(papel: string): string {
  if (papel === "ADMIN" || papel === "GERAL") return "/painel";
  const tabs = TABS_POR_PAPEL[papel];
  if (tabs?.length) return `/indicadores?tab=${tabs[0]}`;
  return "/indicadores";
}
