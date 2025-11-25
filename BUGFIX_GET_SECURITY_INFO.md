# Bugfix: GET_SECURITY_INFO für ESP32-C3

## Problem

ESP32-C3 v0.4 (und andere moderne Chips) sollten `GET_SECURITY_INFO` unterstützen, aber es schlug mit einer leeren Antwort fehl:

```
GET_SECURITY_INFO failed, using magic value detection: Error: Invalid security info response length: 0
```

## Ursache

Das Problem lag in der `checkCommand()` Funktion:

1. `GET_SECURITY_INFO` wird während `detectChip()` aufgerufen
2. Zu diesem Zeitpunkt ist `chipFamily` noch **nicht gesetzt**
3. `checkCommand()` konnte die Status-Länge nicht korrekt bestimmen
4. Es fiel in den `else` Block und verwendete die falsche Status-Länge
5. Die Daten wurden falsch geparst → leere `responseData`

### Code-Flow (vorher):

```typescript
async detectChip() {
  // chipFamily ist noch NICHT gesetzt!
  const securityInfo = await this.getSecurityInfo();
  //                          ↓
  //                   checkCommand(ESP_GET_SECURITY_INFO, ...)
  //                          ↓
  //                   chipFamily ist undefined
  //                          ↓
  //                   statusLen wird falsch berechnet
  //                          ↓
  //                   data wird falsch geparst
  //                          ↓
  //                   responseData.length === 0
}
```

## Lösung

In `checkCommand()` wurde eine spezielle Behandlung für `GET_SECURITY_INFO` hinzugefügt:

```typescript
async checkCommand(opcode, buffer, checksum, timeout) {
  // ...
  
  let statusLen = 0;

  if (this.IS_STUB || this.chipFamily == CHIP_FAMILY_ESP8266) {
    statusLen = 2;
  } else if ([CHIP_FAMILY_ESP32, ...].includes(this.chipFamily)) {
    statusLen = 4;
  } else {
    // NEU: Wenn chipFamily noch nicht gesetzt ist (während detectChip)
    if (opcode === ESP_GET_SECURITY_INFO) {
      statusLen = 4;  // Moderne Chips verwenden 4-Byte Status
    } else if ([2, 4].includes(data.length)) {
      statusLen = data.length;
    }
  }
  
  // ...
}
```

## Ergebnis

Nach dem Fix sollte ESP32-C3 v0.4 (und andere moderne Chips) korrekt erkannt werden:

### Vorher:
```
[debug] GET_SECURITY_INFO failed, using magic value detection: Error: Invalid security info response length: 0
[debug] Detected chip via magic value: 0x1B31506F (ESP32-C3)
```

### Nachher (erwartet):
```
[debug] Detected chip via IMAGE_CHIP_ID: 5 (ESP32-C3)
Chip type ESP32-C3
```

## Betroffene Chips

Dieser Fix verbessert die Erkennung für:

- ✅ ESP32-C3 (alle Revisionen mit GET_SECURITY_INFO Support)
- ✅ ESP32-S3
- ✅ ESP32-C6
- ✅ ESP32-C61
- ✅ ESP32-H2
- ✅ ESP32-C5
- ✅ ESP32-P4 Rev. 300+

## Fallback bleibt erhalten

Der Fallback auf Magic Value Detection bleibt weiterhin funktionsfähig für:

- ESP8266
- ESP32
- ESP32-S2
- Ältere ROM-Versionen, die GET_SECURITY_INFO nicht unterstützen

## Testing

### Zu testen:
- [ ] ESP32-C3 v0.4 → sollte via IMAGE_CHIP_ID erkannt werden
- [ ] ESP32-S3 → sollte via IMAGE_CHIP_ID erkannt werden
- [ ] ESP32-P4 Rev. 300+ → sollte via IMAGE_CHIP_ID erkannt werden
- [ ] ESP8266 → sollte via Magic Value erkannt werden (Fallback)
- [ ] ESP32 → sollte via Magic Value erkannt werden (Fallback)

### Erwartetes Verhalten:

**Moderne Chips (mit GET_SECURITY_INFO):**
```
[debug] Detected chip via IMAGE_CHIP_ID: X (ESP32-XX)
```

**Ältere Chips (ohne GET_SECURITY_INFO):**
```
[debug] GET_SECURITY_INFO failed, using magic value detection
[debug] Detected chip via magic value: 0xXXXXXXXX (ESP32-XX)
```

Beide Wege führen zur korrekten Chip-Erkennung! ✅
