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
    "typefrequency"?: number;
    "typeratio"?: number;
    "headingtypeface"?: string;
    "bodytypeface"?: string;
    "docmentwidth"?: number;
  }) {
    Object.keys(config).forEach((style) => {
      if (this.config[style]) this.config[style].value = config[style];
    });
    this.implementAll();
  }

  // set the value of a config field
  setTerm(key: string, value: any) {
    this.config[key].value = value;
    this.implement(key);
  }

  // implement a config field into a css variable
  implement(key: string) {
    Object.keys(this.config[key].styles).forEach((style: string) => {
      if (this.config[key].value) {
        (document.querySelector(":root") as any).style.setProperty(
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

  static defaultConfig: { [key: string]: ConfigTerm } = {
    // Typescale ---------------------------------------------------------------
    // The root font size
    "typefrequency": {
      key: "typefrequency",
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
    "typeratio": {
      key: "typeratio",
      display: "Typescale Ratio",
      type: "number",
      value: 2,
      styles: {
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
    "headingtypeface": {
      key: "headingtypeface",
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
    "bodytypeface": {
      key: "bodytypeface",
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

    // Spacing & Sizing -----------------------------------------------------
    "documentwidth": {
      key: "documentwidth",
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
