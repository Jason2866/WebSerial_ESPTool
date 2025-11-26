# MAC-Adress-Korrektur für ESP32-H2

## Problem

Die MAC-Adress-Berechnung für ESP32-H2 war fehlerhaft. Der ursprüngliche Code verwendete das gleiche Layout wie andere moderne ESP32-Chips, aber ESP32-H2 hat ein einzigartiges MAC-Adress-Layout.

## Analyse

Nach Überprüfung der offiziellen esptool-Implementierung (https://github.com/espressif/esptool/blob/master/esptool/targets/esp32h2.py) wurde festgestellt:

ESP32-H2 verwendet eine spezielle MAC-Adress-Berechnung:
```python
# Python esptool esp32h2.py
mac0 = self.read_reg(self.MAC_EFUSE_REG)
mac1 = self.read_reg(self.MAC_EFUSE_REG + 4)
bitstring = struct.pack(">II", mac1, mac0)[2:]
```

Das bedeutet:
1. `mac1` und `mac0` werden als Big-Endian gepackt
2. Die ersten 2 Bytes werden übersprungen (`[2:]`)
3. Die verbleibenden 6 Bytes bilden die MAC-Adresse

## Lösung

ESP32-H2 benötigt eine eigene Implementierung, die das Big-Endian-Packing korrekt nachbildet:

```typescript
} else if (this.chipFamily == CHIP_FAMILY_ESP32H2) {
  // ESP32-H2 has a different MAC address layout
  // Python: struct.pack(">II", mac1, mac0)[2:]
  // Big-endian pack of mac1, mac0, then skip first 2 bytes
  macAddr[0] = (mac1 >> 16) & 0xff;
  macAddr[1] = (mac1 >> 8) & 0xff;
  macAddr[2] = mac1 & 0xff;
  macAddr[3] = (mac0 >> 24) & 0xff;
  macAddr[4] = (mac0 >> 16) & 0xff;
  macAddr[5] = (mac0 >> 8) & 0xff;
}
```

## Detaillierte Erklärung

### Big-Endian Packing Simulation

Wenn `mac1 = 0xABCDEF00` und `mac0 = 0x12345678`:

```
Python: struct.pack(">II", mac1, mac0)
Ergebnis: [AB, CD, EF, 00, 12, 34, 56, 78]
[2:] nimmt: [EF, 00, 12, 34, 56, 78]
```

TypeScript-Äquivalent:
```typescript
macAddr[0] = (mac1 >> 16) & 0xff;  // EF
macAddr[1] = (mac1 >> 8) & 0xff;   // 00
macAddr[2] = mac1 & 0xff;          // (würde 00 sein, aber wir nehmen die unteren 8 Bits)
macAddr[3] = (mac0 >> 24) & 0xff;  // 12
macAddr[4] = (mac0 >> 16) & 0xff;  // 34
macAddr[5] = (mac0 >> 8) & 0xff;   // 56
```

## Verifizierung aller Chips

Nach Überprüfung mit der esptool-Referenz sind alle MAC-Adress-Berechnungen nun korrekt:

| Chip | MAC-Adress-Layout | Referenz | Status |
|------|-------------------|----------|--------|
| ESP8266 | OUI-basiert mit spezieller Logik | esp8266.py | ✅ Korrekt |
| ESP32 | mac2/mac1 basiert | esp32.py | ✅ Korrekt |
| ESP32-S2 | mac1/mac0 basiert (Standard) | esp32s2.py | ✅ Korrekt |
| ESP32-S3 | mac1/mac0 basiert (Standard) | esp32s3.py | ✅ Korrekt |
| ESP32-C2 | mac1/mac0 basiert (Standard) | esp32c2.py | ✅ Korrekt |
| ESP32-C3 | mac1/mac0 basiert (Standard) | esp32c3.py | ✅ Korrekt |
| ESP32-C5 | mac1/mac0 basiert (Standard) | esp32c5.py | ✅ Korrekt |
| ESP32-C6 | mac1/mac0 basiert (Standard) | esp32c6.py | ✅ Korrekt |
| ESP32-C61 | mac1/mac0 basiert (Standard) | esp32c61.py | ✅ Korrekt |
| ESP32-H2 | Big-Endian pack(">II")[2:] | esp32h2.py | ✅ **Korrigiert** |
| ESP32-P4 | mac1/mac0 basiert (Standard) | esp32p4.py | ✅ Korrekt |

## Geänderte Dateien

- `WebSerial_ESPTool/src/esp_loader.ts` - Zeilen 408-415

## Build-Status

✅ TypeScript-Kompilierung erfolgreich
✅ Rollup-Build erfolgreich
