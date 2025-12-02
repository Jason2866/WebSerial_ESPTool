# Read Flash Partition Feature

## Übersicht

Die Read Flash Partition Funktionalität wurde erfolgreich aus esptool.js in WebSerial_ESPTool implementiert. Diese Funktion ermöglicht es, Flash-Speicher direkt vom ESP-Chip zu lesen und als Binärdatei herunterzuladen.

## Implementierte Änderungen

### 1. Backend (TypeScript)

#### `src/const.ts`
- Hinzugefügt: `ESP_READ_FLASH = 0xd2` Konstante
- Hinzugefügt: `FLASH_READ_TIMEOUT = 10000` Konstante

#### `src/esp_loader.ts`
- Neue Methode `readFlash()` in der `EspStubLoader` Klasse implementiert
- Die Methode unterstützt:
  - Lesen von Flash-Speicher ab einer bestimmten Adresse
  - Angabe der zu lesenden Größe in Bytes
  - Optional: Callback-Funktion für Fortschrittsanzeige
  - Rückgabe der Daten als `Uint8Array`

### 2. Frontend (HTML/JavaScript/CSS)

#### `index.html`
- Neue UI-Sektion "Read Flash" hinzugefügt mit:
  - Eingabefeld für Adresse (hexadezimal)
  - Eingabefeld für Größe (dezimal in Bytes)
  - "Read Flash" Button
  - Fortschrittsbalken

#### `js/script.js`
- Neue Funktion `clickReadFlash()` implementiert
- Automatischer Download der gelesenen Daten als `.bin` Datei
- Fortschrittsanzeige während des Lesevorgangs
- Fehlerbehandlung und Logging

#### `css/style.css`
- Styling für die neue "Read Flash" Sektion
- Responsive Layout-Anpassungen

## Verwendung

### Über die Web-Oberfläche

#### Flash direkt lesen

1. Verbinden Sie sich mit einem ESP-Gerät über den "Connect" Button
2. Scrollen Sie zur "Read Flash" Sektion
3. Geben Sie die Startadresse ein (z.B. `0` für den Anfang des Flash-Speichers)
4. Geben Sie die Größe in Bytes ein (z.B. `4096` für 4KB)
5. Klicken Sie auf "Read Flash"
6. Die Daten werden automatisch als `.bin` Datei heruntergeladen

#### Partitionstabelle lesen

1. Verbinden Sie sich mit einem ESP-Gerät über den "Connect" Button
2. Scrollen Sie zur "Partition Table" Sektion
3. Klicken Sie auf "Read Partition Table"
4. Die Partitionstabelle wird gelesen und angezeigt
5. Klicken Sie auf "Download" neben einer Partition, um diese herunterzuladen

### Programmatisch

```typescript
// Beispiel: 4KB vom Offset 0x0 lesen
const data = await espStubLoader.readFlash(
  0x0,           // Adresse
  4096,          // Größe in Bytes
  (packet, progress, totalSize) => {
    // Optional: Fortschritts-Callback
    console.log(`Progress: ${progress}/${totalSize} bytes`);
  }
);

// data ist ein Uint8Array mit den gelesenen Daten
```

## Technische Details

### Protokoll

Die Implementierung folgt dem ESP Serial Protocol:
1. Sende `ESP_READ_FLASH` Kommando mit Parametern (Adresse, Größe, Block-Größe, Anzahl Blöcke)
2. Warte auf Bestätigung
3. Empfange Datenpakete über SLIP-Protokoll
4. Sende Acknowledgment nach jedem Paket
5. Wiederhole bis alle Daten empfangen wurden

### Kompatibilität

Die Funktion ist nur im Stub-Modus verfügbar (nach `runStub()`), da der ROM-Bootloader diesen Befehl nicht unterstützt.

Unterstützte Chips:
- ESP32
- ESP32-S2
- ESP32-S3
- ESP32-C2
- ESP32-C3
- ESP32-C5
- ESP32-C6
- ESP32-C61
- ESP32-H2
- ESP32-P4
- ESP8266

## Beispiel-Anwendungsfälle

1. **Backup erstellen**: Kompletten Flash-Speicher sichern
2. **Partition lesen**: Spezifische Partitionen extrahieren (z.B. NVS, OTA)
3. **Debugging**: Flash-Inhalt zur Fehleranalyse untersuchen
4. **Firmware-Extraktion**: Installierte Firmware vom Gerät lesen
5. **Partitionstabelle analysieren**: Übersicht über alle Partitionen erhalten
6. **Einzelne Partitionen sichern**: Nur bestimmte Partitionen herunterladen

## Bekannte Einschränkungen

- Die Funktion erfordert, dass der Stub-Loader läuft
- Große Lesevorgänge können einige Zeit in Anspruch nehmen
- Die maximale Größe ist durch den verfügbaren Flash-Speicher des Chips begrenzt

## Build-Prozess

Nach Änderungen am TypeScript-Code:

```bash
npm run prepublishOnly
```

Dies kompiliert den TypeScript-Code und erstellt die Distributionsdateien in `dist/`.
