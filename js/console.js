import { ColoredConsole, coloredConsoleStyles } from "./util/console-color.js";
import { LineBreakTransformer } from "./util/line-break-transformer.js";

export class ESP32ToolConsole {
  constructor(port, containerElement, allowInput = true) {
    this.port = port;
    this.containerElement = containerElement;
    this.allowInput = allowInput;
    this.console = null;
    this.cancelConnection = null;
  }

  logs() {
    return this.console?.logs() || "";
  }

  async init() {
    // Create console HTML
    this.containerElement.innerHTML = `
      <style>
        .esp32tool-console-wrapper {
          background-color: #1c1c1c;
          color: #ddd;
          font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier,
            monospace;
          line-height: 1.45;
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          border: none;
          border-radius: 0;
          margin: 0;
          padding: 0;
        }
        .esp32tool-console-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background-color: #2a2a2a;
          border-bottom: 1px solid #333;
          flex-shrink: 0;
          min-height: 40px;
        }
        .esp32tool-console-header h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          order: 2;
        }
        .esp32tool-console-controls {
          display: flex;
          gap: 8px;
          order: 1;
        }
        .esp32tool-console-controls button {
          padding: 4px 12px;
          font-size: 12px;
          background-color: #444;
          color: #ddd;
          border: 1px solid #555;
          border-radius: 3px;
          cursor: pointer;
        }
        .esp32tool-console-controls button:hover {
          background-color: #555;
        }
        .esp32tool-console-form {
          display: flex;
          align-items: center;
          padding: 0 8px 0 16px;
          background-color: #1c1c1c;
          border-top: 1px solid #333;
          flex-shrink: 0;
          min-height: 40px;
          position: sticky;
          bottom: 0;
          z-index: 10;
        }
        .esp32tool-console-input {
          flex: 1;
          padding: 8px;
          margin: 4px 8px;
          border: 0;
          outline: none;
          background-color: #1c1c1c;
          color: #ddd;
          font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier,
            monospace;
          font-size: 12px;
        }
        ${coloredConsoleStyles}
        .esp32tool-console-wrapper .log {
          flex: 1;
          margin: 0;
          border-radius: 0;
        }
      </style>
      <div class="esp32tool-console-wrapper">
        <div class="esp32tool-console-header">
          <div class="esp32tool-console-controls">
            <button id="console-clear-btn">Clear</button>
            <button id="console-reset-btn">Reset Device</button>
            <button id="console-close-btn">Close Console</button>
          </div>
          <h3>ESP Console</h3>
        </div>
        <div class="log"></div>
        ${
          this.allowInput
            ? `<form class="esp32tool-console-form">
                  <input class="esp32tool-console-input" autofocus placeholder="Type command and press Enter...">
                </form>`
            : ""
        }
      </div>
    `;

    this.console = new ColoredConsole(
      this.containerElement.querySelector(".log")
    );

    // Setup event listeners
    const clearBtn = this.containerElement.querySelector("#console-clear-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => this.clear());
    }

    const resetBtn = this.containerElement.querySelector("#console-reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => this.reset());
    }

    const closeBtn = this.containerElement.querySelector("#console-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        // Dispatch close event to parent
        this.containerElement.dispatchEvent(
          new CustomEvent("console-close", { bubbles: true })
        );
      });
    }

    if (this.allowInput) {
      const input = this.containerElement.querySelector(".esp32tool-console-input");

      this.containerElement.addEventListener("click", () => {
        // Only focus input if user didn't select some text
        if (getSelection()?.toString() === "") {
          input.focus();
        }
      });

      const form = this.containerElement.querySelector("form");
      if (form) {
        form.addEventListener("submit", (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          this._sendCommand();
        });
      }

      input.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") {
          ev.preventDefault();
          ev.stopPropagation();
          this._sendCommand();
        }
      });
    }

    // Start connection
    const abortController = new AbortController();
    const connection = this._connect(abortController.signal);
    this.cancelConnection = () => {
      abortController.abort();
      return connection;
    };
  }

  async _connect(abortSignal) {
    console.log("Starting console read loop");

    // Check if port.readable is available
    if (!this.port.readable) {
      this.console.addLine("");
      this.console.addLine("");
      this.console.addLine(
        `Terminal disconnected: Port readable stream not available`
      );
      console.error(
        "Port readable stream not available - port may need to be reopened at correct baudrate"
      );
      return;
    }

    try {
      await this.port.readable
        .pipeThrough(new TextDecoderStream(), {
          signal: abortSignal,
        })
        .pipeThrough(new TransformStream(new LineBreakTransformer()))
        .pipeTo(
          new WritableStream({
            write: (chunk) => {
              const cleaned = chunk.replace(/\r\n$/, "\n");
              this.console.addLine(cleaned);
            },
          })
        );
      if (!abortSignal.aborted) {
        this.console.addLine("");
        this.console.addLine("");
        this.console.addLine("Terminal disconnected");
      }
    } catch (e) {
      // Only log disconnect errors if the abort was NOT intentional
      if (!abortSignal.aborted && !(e instanceof DOMException && e.name === 'AbortError')) {
        this.console.addLine("");
        this.console.addLine("");
        this.console.addLine(`Terminal disconnected: ${e}`);
      }
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 100));
      console.log("Finished console read loop");
    }
  }

  async _sendCommand() {
    const input = this.containerElement.querySelector(".esp32tool-console-input");
    const command = input.value;
    if (!this.port.writable) {
      this.console.addLine("Terminal disconnected: port not writable");
      return;
    }
    const encoder = new TextEncoder();
    let writer;
    try {
      writer = this.port.writable.getWriter();
      await writer.write(encoder.encode(command + "\r\n"));
      this.console.addLine(`> ${command}`);
    } catch (err) {
      this.console.addLine(`Write failed: ${err}`);
    } finally {
      if (writer) {
        try {
          writer.releaseLock();
        } catch (err) {
          console.error("Ignoring release lock error", err);
        }
      }
    }
    input.value = "";
    input.focus();
  }

  clear() {
    const logElement = this.containerElement.querySelector(".log");
    if (logElement) {
      logElement.innerHTML = "";
    }
  }

  async reset() {
    console.log("Reset device requested from console");
    // Don't use addLine here as stream might already be closed
    // This will be called from script.js with proper reset logic
    const event = new CustomEvent("console-reset");
    this.containerElement.dispatchEvent(event);
  }

  async disconnect() {
    if (this.cancelConnection) {
      await this.cancelConnection();
      this.cancelConnection = null;
    }
  }
}
