
interface ConfigField {
  key: string;
  display: string;
  type: string;
  value: any;
  styles: { [key: string]: (value: any) => string;}
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
    else this.config["frequency"] = {
       key: 'frequency',
       display: "Typescale Root",
       type: "number", value: 16,
       styles: { "--root-frequency": (value: number) => { return `${value / 16}em` }}
     };
    if(config["ratio"]) this.config["ratio"] = config["ratio"];
    else this.config["ratio"] = {
       key: 'ratio',
       display: "Typescale Ratio",
       type: "number",
       value: 2,
       styles: {
         "--title": (value: number) => { return `${value ** (4/3)}rem`},
         "--h1": (value: number) => { return `${value}rem`},
         "--h2": (value: number) => { return `${value ** (2/3)}rem`},
         "--h3": (value: number) => { return `${value ** (1/3)}rem`},
         "--footer": (value: number) => { return `${value ** (-1/3)}rem`},
         "--small": (value: number) => { return `${value ** -1}rem`},

         "--margin-before": (value: number) => { return `1em`},
         "--margin-after": (value: number) => { return `${value ** -1}em`},
         "--leading-body": (value: number) => { return `${value ** (1/3)}em`},
         "--leading-heading": (value: number) => { return `${value ** (2/3)}em`},
       }
     };

    if(config["paper-color"]) this.config["paper-color"] = config["paper-color"];
    else this.config["paper-color"] = {
      key: 'paper-color',
      display: "Paper Color",
      type: "color",
      value: "#FBFBFB" ,
      styles: {
        "--paper-color": (value: string) => { return value; },
        "--paper-glass-color": (value: string) => {return `${value}20`; }
      }
    };
    if(config["type-color"]) this["type-color"] = config["type-color"];
    else this.config["type-color"] = {
      key: 'type-color',
      display: "Type Color",
      type: "color",
       value: "#262626",
       styles: {
         "--type-color": (value: string) => { return value; },
         "--type-glass-color": (value: string) => {return `${value}20`; }
       }
     };
    if(config["off-color"]) this["off-color"] = config["off-color"];
    else this.config["off-color"] = {
      key: 'off-color',
      display: "Off Color",
      type: "color",
      value: "#E2DCC9",
      styles: {
        "--off-color": (value: string) => { return value; },
        "--off-glass-color": (value: string) => {return `${value}20`; }
      }
    };

    if(config["document-width"]) this["document-width"] = config["document-width"];
    else this.config["document-width"] = {
      key: 'document-width',
      display: "Document Width",
      type: "number",
      value: 60,
      styles: {
        "--document-width": (value: string) => { return `${value}ch`; },
      }
    };
  }

  setItem(key: string, value: any) {
    this.config[key].value = value;
  }
}

export default ThemeConfig
