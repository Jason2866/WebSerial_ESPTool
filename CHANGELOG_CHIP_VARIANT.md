# Changelog: Chip Variant Support

## Änderungen in WebSerial_ESPTool

### Neue Features

#### 1. `chipVariant` Feld in ESPLoader
- Neues öffentliches Feld: `chipVariant: string | null`
- Wird automatisch bei der Chip-Erkennung gesetzt
- Für ESP32-P4: `"rev0"` (Revision < 300) oder `"rev300"` (Revision >= 300)
- Für alle anderen Chips: `null`

#### 2. Erweiterte ESP32-P4 Erkennung
- Revision wird aus eFuses gelesen (EFUSE_BLOCK1)
- Funktioniert sowohl bei IMAGE_CHIP_ID als auch Magic Value Erkennung
- Logging der erkannten Variante im Debug-Modus

### Geänderte Dateien

- `src/esp_loader.ts`:
  - Hinzugefügt: `chipVariant: string | null` Feld
  - Erweitert: `detectChip()` Methode setzt chipVariant für ESP32-P4
  - Erweitert: Logging für bessere Nachvollziehbarkeit

### API-Änderungen

```typescript
// Vorher
const esploader = new ESPLoader(port, logger);
await esploader.initialize();
console.log(esploader.chipName);      // "ESP32-P4"
console.log(esploader.chipRevision);  // 300

// Nachher (zusätzlich)
console.log(esploader.chipVariant);   // "rev300"
```

### Abwärtskompatibilität

✅ Vollständig abwärtskompatibel
- Bestehendes Code funktioniert unverändert
- Neues Feld ist optional und kann ignoriert werden
- Keine Breaking Changes

## Änderungen in esp-web-tools

### Neue Features

#### 1. `chipVariant` Support in Manifesten
- Neues optionales Feld in `Build` Interface: `chipVariant?: string`
- Ermöglicht spezifische Firmware-Builds für verschiedene Chip-Varianten
- Intelligente Matching-Logik mit Fallback-Unterstützung

#### 2. Erweiterte Build-Auswahl
- Priorisiert Builds mit passendem `chipVariant`
- Fallback auf Builds ohne `chipVariant` Angabe
- Bessere Fehlermeldungen mit Varianten-Information

### Geänderte Dateien

- `src/const.ts`:
  - Erweitert: `Build` Interface mit `chipVariant?: string`
  - Erweitert: `BaseFlashState` Interface mit `chipVariant?: string | null`

- `src/flash.ts`:
  - Erweitert: Build-Matching-Logik berücksichtigt chipVariant
  - Erweitert: Fehlermeldungen zeigen chipVariant an
  - Erweitert: Initialisierungsmeldung zeigt chipVariant an

- `README.md`:
  - Hinzugefügt: Dokumentation für Chip Variant Support
  - Hinzugefügt: Beispiel für P4-Varianten

### Manifest-Beispiel

```json
{
  "name": "My Firmware",
  "version": "1.0.0",
  "builds": [
    {
      "chipFamily": "ESP32-P4",
      "chipVariant": "rev0",
      "parts": [...]
    },
    {
      "chipFamily": "ESP32-P4",
      "chipVariant": "rev300",
      "parts": [...]
    }
  ]
}
```

### Abwärtskompatibilität

✅ Vollständig abwärtskompatibel
- Bestehende Manifeste ohne `chipVariant` funktionieren weiterhin
- `chipVariant` ist optional
- Keine Breaking Changes

## Testing

### Build-Tests
- ✅ WebSerial_ESPTool kompiliert erfolgreich
- ✅ esp-web-tools kompiliert erfolgreich
- ✅ Keine TypeScript-Fehler
- ✅ Keine Linting-Fehler

### Funktionale Tests (empfohlen)
- [ ] Test mit ESP32-P4 Rev. 0 Hardware
- [ ] Test mit ESP32-P4 Rev. 300 Hardware
- [ ] Test mit Manifest mit chipVariant
- [ ] Test mit Manifest ohne chipVariant (Fallback)
- [ ] Test mit anderen ESP32-Chips (sollte chipVariant = null sein)

## Deployment

### WebSerial_ESPTool
1. Version in `package.json` erhöhen
2. `npm run prepublishOnly` ausführen
3. `npm publish` ausführen

### esp-web-tools
1. Warten bis neue WebSerial_ESPTool Version verfügbar ist
2. `package.json` aktualisieren: `"tasmota-webserial-esptool": "^6.5.0"` (oder höher)
3. Version in `package.json` erhöhen
4. `npm install`
5. `npm run prepublishOnly` ausführen
6. `npm publish` ausführen

## Dokumentation

- ✅ `CHIP_VARIANT_SUPPORT.md` - Vollständige technische Dokumentation
- ✅ `manifest-example-p4-variants.json` - Beispiel-Manifest
- ✅ `README.md` (esp-web-tools) - Kurze Anleitung
- ✅ `CHANGELOG_CHIP_VARIANT.md` - Diese Datei

## Verwendungsbeispiele

### Szenario 1: Separate Builds für jede Variante
```json
{
  "builds": [
    { "chipFamily": "ESP32-P4", "chipVariant": "rev0", "parts": [...] },
    { "chipFamily": "ESP32-P4", "chipVariant": "rev300", "parts": [...] }
  ]
}
```

### Szenario 2: Ein Build für alle Varianten
```json
{
  "builds": [
    { "chipFamily": "ESP32-P4", "parts": [...] }
  ]
}
```

### Szenario 3: Spezifischer Build + Fallback
```json
{
  "builds": [
    { "chipFamily": "ESP32-P4", "chipVariant": "rev300", "parts": [...] },
    { "chipFamily": "ESP32-P4", "parts": [...] }
  ]
}
```
Rev300 verwendet ersten Build, Rev0 verwendet zweiten Build (Fallback).
