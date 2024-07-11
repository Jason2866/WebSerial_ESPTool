# Fork of Adafruit WebSerial ESPTool

JavaScript package to install firmware on ESP devices via the browser using WebSerial.

This fork supports additionally the ESP32-P4


## Local development

- Clone this repository.
- Install dependencies with `yarn`
- Run `script/develop`
- Open http://localhost:5004/

## Origin

This project was originally written by [Melissa LeBlanc-Williams](https://github.com/makermelissa). [Nabu Casa](https://www.nabucasa.com) ported the code over to TypeScript and in March 2022 took over maintenance from Adafruit. In July 2022, the Nabucasa stopped maintaining the project in favor of an official, but very early release of Espressif's [esptool-js](https://github.com/espressif/esptool-js/). Due to the instability of the tool, Adafruit updated their fork with Nabucasa's changes in November 2022 and took over maintenance once again. Since Adafruit is slow in adding new MCUs (support for C2,C6 and H2 is from this fork) i decided to maintain my own version and not providimg PRs upstream anymore.

Copyright: Adafruit, Nabu Casa and Johann Obermeier
