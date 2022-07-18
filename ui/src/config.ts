
interface ConfigField {
  key: string;
  display: string;
  type: string;
  value: any;
}

class ThemeConfig {

  config: { [key: string]: ConfigField }

  constructor(config: {
    "frequency"?: ConfigField,
    "ratio"?: ConfigField,

    "paper-color"?: ConfigField,
    "type-color"?: ConfigField,
    "off-color"?: ConfigField,

    "docment-width"?: ConfigField,
  }) {
    this.config = {}
    if(config["frequency"]) this.config["frequency"] = config["frequency"];
    else this.config["frequency"] = { key: 'frequency', display: "Typescale Root", type: "number", value: 16 };
    if(config["ratio"]) this.config["ratio"] = config["ratio"];
    else this.config["ratio"] = { key: 'ratio', display: "Typescale Ratio", type: "number", value: 2 };

    if(config["paper-color"]) this.config["paper-color"] = config["paper-color"];
    else this.config["paper-color"] = { key: 'paper-color', display: "Paper Color", type: "string", value: "#FBFBFB" };
    if(config["type-color"]) this["type-color"] = config["type-color"];
    else this.config["type-color"] = { key: 'type-color', display: "Type Color", type: "string", value: "#262626" };
    if(config["off-color"]) this["off-color"] = config["off-color"];
    else this.config["off-color"] = { key: 'off-color', display: "Off Color", type: "string", value: "#E2DCC9" };

    if(config["document-width"]) this["document-width"] = config["document-width"];
    else this.config["document-width"] = { key: 'document-width', display: "Document Width", type: "number", value: 60 };;
  }

  setItem(key: string, value: any) {
    this.config[key].value = value;
  }
}

export default ThemeConfig
