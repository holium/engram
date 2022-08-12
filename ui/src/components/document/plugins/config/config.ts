export interface ConfigTerm {
  key: string;
  display: string;
  type: string;
  options?: { [display: string]: any };
  value: any;
  styles: { [key: string]: (value: any, config?: DocumentConfig) => string };
}

export class DocumentConfig {
  config = DocumentConfig.defaultConfig;

  constructor(config: {
    frequency?: number;
    ratio?: number;

    "paper-color"?: string;
    "type-color"?: string;
    "off-color"?: string;
    "primary-color"?: string;
    "success-color"?: string;
    "warning-color"?: string;
    "failure-color"?: string;

    "docment-width"?: number;
  }) {
    Object.keys(config).forEach((style) => {
      if (this.config[style]) this.config[style].value = config[style];
    });
    this.implementAll();
  }

  // set the value of a config field
  setField(key: string, value: any) {
    this.config[key].value = value;
    this.implement(key);
  }

  // implement a config field into a css variable
  implement(key: string) {
    Object.keys(this.config[key].styles).forEach((style: string) => {
      if (this.config[key].value) {
        document.documentElement.style.setProperty(
          style,
          this.config[key].styles[style](this.config[key].value, this)
        );
      }
    });
  }

  implementAll() {
    Object.keys(this.config).forEach((key) => {
      this.implement(key);
    });
  }

  static createTerm(
    key: string,
    styles: { [key: string]: (value: any) => string },
    display?: string,
    type?: string,
    defaultValue?: any,
    options?: { [display: string]: any }
  ): ConfigTerm {
    if (type === "select" && typeof options == undefined)
      throw "You must provide options for a config term with the type select";
    return {
      key: key,
      display: typeof display == undefined ? key : display,
      type: typeof type == undefined ? "text" : type,
      value: typeof defaultValue == undefined ? "" : defaultValue,
      styles: styles,
    };
  }

  static defaultConfig: { [key: string]: ConfigTerm } = {
    // Typescale ---------------------------------------------------------------
    // The root font size
    frequency: {
      key: "frequency",
      display: "Typescale Root",
      type: "number",
      value: 16, // assumes default is 16px, converts to em to comply with browser/machine settings
      styles: {
        "--root-frequency": (value: number) => {
          return `${value / 16}em`;
        },
      },
    },
    // The ratio between octaves in the typescale
    ratio: {
      key: "ratio",
      display: "Typescale Ratio",
      type: "number",
      value: 2,
      styles: {
        "--title": (value, config) => {
          return `${value ** config.config["title-octave"].value}rem`;
        },
        "--h1": (value: number) => {
          return `${value}rem`;
        },
        "--h2": (value: number) => {
          return `${value ** (2 / 3)}rem`;
        },
        "--h3": (value: number) => {
          return `${value ** (1 / 3)}rem`;
        },
        "--footer": (value: number) => {
          return `${value ** (-1 / 3)}rem`;
        },
        "--small": (value: number) => {
          return `${value ** -1}rem`;
        },

        "--margin-before": (value: number) => {
          return `1em`;
        },
        "--margin-after": (value: number) => {
          return `${value ** -1}em`;
        },
        "--leading-body": (value: number) => {
          return `${value ** (1 / 3)}em`;
        },
        "--leading-heading": (value: number) => {
          return `${value ** (2 / 3)}em`;
        },
      },
    },
    "title-octave": {
      key: "title-octave",
      display: "Title Octave",
      type: "number",
      value: 1,
      styles: {
        "--title": (value, config) => {
          return `${config.config["ratio"].value ** (parseInt(value) + 1)}rem`;
        },
      },
    },
    "heading-weight": {
      key: "heading-weight",
      display: "Heading Weight",
      type: "number",
      value: 700,
      styles: {
        "--heading-weight": (value: number) => {
          return `${value}`;
        },
      },
    },
    "heading-font-family": {
      key: "heading-font-family",
      display: "Heading Font Family",
      type: "select",
      options: {
        sans: 0,
        serif: 1,
        mono: 2,
      },
      value: 0,
      styles: {
        "--heading-font-family": (value: number) => {
          if (value == 0) {
            return "Rubik, sans-serif";
          } else if (value == 1) {
            return "serif";
          } else {
            return "IBM Plex Mono, monospace";
          }
        },
      },
    },
    "body-font-family": {
      key: "body-font-family",
      display: "Body Font Family",
      type: "select",
      options: {
        sans: 0,
        serif: 1,
        mono: 2,
      },
      value: null,
      styles: {
        "--body-font-family": (value: number) => {
          if (value == 0) {
            return "Rubik, sans-serif";
          } else if (value == 1) {
            return "serif";
          } else {
            return "IBM Plex Mono, monospace";
          }
        },
      },
    },

    // Colours ---------------------------------------------------------------
    "paper-color": {
      key: "paper-color",
      display: "Paper Color",
      type: "color",
      value: null,
      styles: {
        "--paper-color": (value: string) => {
          return value;
        },
        "--paper-glass-color": (value: string) => {
          return `${value}20`;
        },
      },
    },
    "type-color": {
      key: "type-color",
      display: "Type Color",
      type: "color",
      value: null,
      styles: {
        "--type-color": (value: string) => {
          return value;
        },
        "--type-glass-color": (value: string) => {
          return `${value}20`;
        },
      },
    },
    "off-color": {
      key: "off-color",
      display: "Off Color",
      type: "color",
      value: null,
      styles: {
        "--off-color": (value: string) => {
          return value;
        },
      },
    },
    "primary-color": {
      key: "primary-color",
      display: "Primary Color",
      type: "color",
      value: "null",
      styles: {
        "--primary-color": (value: string) => {
          return value;
        },
        "--primary-glass-color": (value: string) => {
          return `${value}20`;
        },
      },
    },
    /*
    "success-color": {
      key: "success-color",
      display: "Success Color",
      type: "color",
      value: "#10A30D",
      styles: {
        "--success-color": (value: string) => {
          return value;
        },
        "--success-glass-color": (value: string) => {
          return `${value}20`;
        },
      },
    },
    "warning-color": {
      key: "warning-color",
      display: "Warning  Color",
      type: "color",
      value: "#FACA1F",
      styles: {
        "--warning-color": (value: string) => {
          return value;
        },
        "--warning-glass-color": (value: string) => {
          return `${value}20`;
        },
      },
    },
    "failure-color": {
      key: "failure-color",
      display: "Failure Color",
      type: "color",
      value: "#E71F1F",
      styles: {
        "--failure-color": (value: string) => {
          return value;
        },
        "--failure-glass-color": (value: string) => {
          return `${value}20`;
        },
      },
    },
    */

    // Spacing & Sizing -----------------------------------------------------
    "document-width": {
      key: "document-width",
      display: "Document Width",
      type: "number",
      value: 60,
      styles: {
        "--document-width": (value: string) => {
          return `${value}ch`;
        },
      },
    },
  };
}
