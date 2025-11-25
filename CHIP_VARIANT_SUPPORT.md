# ESP32-P4 Chip Variant Support

## Übersicht

Die beiden Projekte unterstützen jetzt die Unterscheidung zwischen verschiedenen ESP32-P4 Varianten über das neue `chipVariant` Feld.

## WebSerial_ESPTool

### Änderungen

Das `ESPLoader` Objekt hat jetzt ein neues Feld:
- `chipVariant: string | null` - Identifiziert die Chip-Variante

### ESP32-P4 Varianten

Für ESP32-P4 Chips werden folgende Varianten erkannt:
- `"rev0"` - ESP32-P4 Revision < 300 (ältere Versionen)
- `"rev300"` - ESP32-P4 Revision >= 300 (neuere Versionen)

Die Erkennung erfolgt automatisch basierend auf der Chip-Revision, die aus den eFuses gelesen wird.

### Beispiel

```typescript
const esploader = new ESPLoader(port, logger);
await esploader.initialize();

console.log(esploader.chipName);      // "ESP32-P4"
console.log(esploader.chipFamily);    // CHIP_FAMILY_ESP32P4
console.log(esploader.chipRevision);  // z.B. 0 oder 300
console.log(esploader.chipVariant);   // "rev0" oder "rev300"
```

## esp-web-tools

### Änderungen

#### Manifest Format

Das `Build` Interface unterstützt jetzt ein optionales `chipVariant` Feld:

```typescript
interface Build {
  chipFamily: "ESP32-P4" | ...;
  chipVariant?: string;  // NEU
  parts: { path: string; offset: number; }[];
}
```

#### Flash State

Der `FlashState` enthält jetzt auch die `chipVariant` Information:

```typescript
interface BaseFlashState {
  chipFamily?: "ESP32-P4" | ...;
  chipVariant?: string | null;  // NEU
  // ...
}
```

### Manifest Beispiel

Hier ist ein Beispiel-Manifest, das verschiedene Firmware-Builds für die zwei P4-Varianten bereitstellt:

```json
{
  "name": "My ESP32-P4 Firmware",
  "version": "1.0.0",
  "builds": [
    {
      "chipFamily": "ESP32-P4",
      "chipVariant": "rev0",
      "parts": [
        { "path": "bootloader_rev0.bin", "offset": 0 },
        { "path": "partition-table.bin", "offset": 32768 },
        { "path": "firmware_rev0.bin", "offset": 65536 }
      ]
    },
    {
      "chipFamily": "ESP32-P4",
      "chipVariant": "rev300",
      "parts": [
        { "path": "bootloader_rev300.bin", "offset": 0 },
        { "path": "partition-table.bin", "offset": 32768 },
        { "path": "firmware_rev300.bin", "offset": 65536 }
      ]
    },
    {
      "chipFamily": "ESP32-S3",
      "parts": [
        { "path": "bootloader_s3.bin", "offset": 0 },
        { "path": "partition-table.bin", "offset": 32768 },
        { "path": "firmware_s3.bin", "offset": 65536 }
      ]
    }
  ]
}
```

### Matching-Logik

Die Firmware-Auswahl funktioniert wie folgt:

1. **Wenn `chipVariant` im Build angegeben ist**: Der Build wird nur verwendet, wenn sowohl `chipFamily` als auch `chipVariant` übereinstimmen.

2. **Wenn `chipVariant` im Build NICHT angegeben ist**: Der Build wird für alle Varianten dieser `chipFamily` verwendet (Fallback).

#### Beispiele

**Szenario 1: Spezifische Builds für jede Variante**
```json
{
  "builds": [
    { "chipFamily": "ESP32-P4", "chipVariant": "rev0", "parts": [...] },
    { "chipFamily": "ESP32-P4", "chipVariant": "rev300", "parts": [...] }
  ]
}
```
- ESP32-P4 rev0 → verwendet ersten Build
- ESP32-P4 rev300 → verwendet zweiten Build

**Szenario 2: Ein Build für alle Varianten**
```json
{
  "builds": [
    { "chipFamily": "ESP32-P4", "parts": [...] }
  ]
}
```
- ESP32-P4 rev0 → verwendet den Build
- ESP32-P4 rev300 → verwendet den Build

**Szenario 3: Spezifischer Build + Fallback**
```json
{
  "builds": [
    { "chipFamily": "ESP32-P4", "chipVariant": "rev300", "parts": [...] },
    { "chipFamily": "ESP32-P4", "parts": [...] }
  ]
}
```
- ESP32-P4 rev0 → verwendet zweiten Build (Fallback)
- ESP32-P4 rev300 → verwendet ersten Build (spezifisch)

## Abwärtskompatibilität

Alle Änderungen sind vollständig abwärtskompatibel:

- Bestehende Manifeste ohne `chipVariant` funktionieren weiterhin
- Das `chipVariant` Feld ist optional
- Für alle Chips außer ESP32-P4 ist `chipVariant` `null`

## Technische Details

### Chip-Erkennung

Die ESP32-P4 Revision wird aus den eFuses gelesen (EFUSE_BLOCK1):
- Minor Revision: Bits [3:0]
- Major Revision: Bit [23] << 2 | Bits [5:4]
- Revision = Major * 100 + Minor

### Erkennungsmethoden

Die Chip-Erkennung verwendet einen zweistufigen Ansatz:

1. **Primär: GET_SECURITY_INFO** (IMAGE_CHIP_ID)
   - Unterstützt von: ESP32-C3 (neuere ROM), ESP32-S3, ESP32-C6, ESP32-H2, ESP32-P4 Rev. 300+
   - Liefert direkt die Chip-ID
   - Wenn nicht unterstützt oder leere Antwort → Fallback zu Magic Value

2. **Fallback: Magic Value Detection**
   - Unterstützt von: ESP8266, ESP32, ESP32-S2, ESP32-C3 (ältere ROM), ESP32-P4 Rev. < 300
   - Liest Magic-Wert aus Register 0x40001000
   - Zuverlässige Methode für ältere Chips

**Für ESP32-P4:**
- Beide Methoden funktionieren
- Nach Erkennung wird die Revision aus eFuses gelesen
- Basierend auf Revision wird `chipVariant` gesetzt:
  - Rev. < 300 → `"rev0"`
  - Rev. >= 300 → `"rev300"`

**Hinweis:** Die Debug-Meldung "GET_SECURITY_INFO failed, using magic value detection" ist normal und erwartet für ältere Chips. Der Fallback-Mechanismus stellt sicher, dass alle Chips korrekt erkannt werden.
