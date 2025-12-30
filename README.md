# WebSerial ESPTool

JavaScript package to install and make backups of firmwares on ESP devices via the browser using WebSerial.

WebSerial ESPTool is **not** based on esptool.js

An [swiss army knife tool for esp32](https://github.com/Jason2866/esp32tool) is available [Online](https://jason2866.github.io/esp32tool/) which is based on this project.
The project [ESPConnect](https://github.com/thelastoutpostworkshop/ESPConnect) is using  WebSerial ESPTool. 

## Local development

- Clone this repository.
- Install dependencies with `npm install`
- Run `script/develop`
- Open http://localhost:5004/

## Origin & Development

This project was originally created by [Melissa LeBlanc-Williams](https://github.com/makermelissa). [Nabu Casa](https://www.nabucasa.com) ported the code to TypeScript and took over maintenance from Adafruit in March 2022. In July 2022, Nabu Casa stopped maintaining the project in favor of Espressif's [esptool-js](https://github.com/espressif/esptool-js). Due to instability, Adafruit updated their fork with Nabu Casa's changes in November 2022 and resumed maintenance. In December 2024, the backend was switched to Espressif's esptool-js. Since esptool.js remained buggy, this independent version was created. In December 2025, support for new MCUs, chip variants (P4 revisions), and optimized flash reading was added.

**Copyright:** Adafruit, Nabu Casa, and Johann Obermeier
