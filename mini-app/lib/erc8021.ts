export const ERC_SUFFIX = "80218021802180218021802180218021";

export interface ParsedSuffix {
  ercSuffix: string;
  schemaId: number;
  schemaData: string;
}

export function parseSuffix(data: string): ParsedSuffix | null {
  // Ensure data is a hex string without 0x prefix
  const hex = data.startsWith("0x") ? data.slice(2) : data;
  if (hex.length < 34) return null; // at least ercSuffix(32) + schemaId(2)

  const ercSuffix = hex.slice(-32);
  if (ercSuffix !== ERC_SUFFIX) return null;

  const schemaIdHex = hex.slice(-34, -32);
  const schemaId = parseInt(schemaIdHex, 16);

  const schemaData = hex.slice(0, -34);
  return { ercSuffix, schemaId, schemaData };
}

export function getAttributionCodes(data: string): string[] | null {
  const parsed = parseSuffix(data);
  if (!parsed) return null;
  if (parsed.schemaId !== 0) return null; // only support schema 0 for now

  const schemaData = parsed.schemaData;
  if (schemaData.length < 2) return null; // need at least codesLength byte

  const codesLengthHex = schemaData.slice(0, 2);
  const codesLength = parseInt(codesLengthHex, 16);
  const codesHex = schemaData.slice(2, 2 + codesLength * 2);
  const codesAscii = Buffer.from(codesHex, "hex").toString("ascii");
  return codesAscii.split(",");
}

export function generateSuffix(codes: string[]): string {
  const codesAscii = codes.join(",");
  const codesHex = Buffer.from(codesAscii, "ascii").toString("hex");
  const codesLengthHex = codesAscii.length.toString(16).padStart(2, "0");
  const schemaData = codesLengthHex + codesHex;
  const schemaIdHex = "00";
  return "0x" + schemaData + schemaIdHex + ERC_SUFFIX;
}
