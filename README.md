# ngx-scanner-text

This library is built to support optical character recognition (OCR) from images provided as urls.\
The core is based on Tesseract, supporting over 100 national languages ​​worldwide.\
This demo [codesandbox](https://codesandbox.io/s/angular-ngx-scanner-text-16856z?file=/src/app/app.component.ts), [github](https://id1945.github.io/ngx-scanner-text/).

![Logo](https://raw.githubusercontent.com/id1945/ngx-scanner-text/master/ngx-scanner-text-mark.png)

### Installation :gear:
```
npm install ngx-scanner-text@<version> --save
```

### Usage :syringe:
```typescript 
import { NgxScannerTextModule } from "ngx-scanner-text";

@NgModule({
    imports: [NgxScannerTextModule],
})
export class AppModule {}
```

<details><summary><b>AppComponent :hammer_and_wrench:</b></summary>

```html
<ngx-scanner-text #scanner="scanner" [configs]="configs" (event)="onData($event)"></ngx-scanner-text>
<button (click)="onScanOCR(scanner)">Scan</button>

<textarea>{{ scanner?.logger$ | async | json }}</textarea>
<textarea>{{ text }}</textarea>
```

```typescript
import { ChangeDetectorRef, Component } from "@angular/core";
import { NgxScannerTextComponent, Configs, Page } from "ngx-scanner-text";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  public text: string;

  public configs: Configs = {
    src: 'https://raw.githubusercontent.com/id1945/ngx-scanner-text/master/ngx-scanner-text-origin.png',
    languages: ['eng'],
    color: 'red',
    isAuto: true,
    isImage: false,
    options: {
      rectangle: {
        left: 70,
        top: 100,
        width: 700,
        height: 200
      }
    }
  };

  constructor(private cdf: ChangeDetectorRef) {}

  onData(data: Page) {
    this.text = data.text;
    this.cdf.detectChanges();
  }

  onScanOCR(scanner: NgxScannerTextComponent) {
    scanner.scanOCR(this.configs).subscribe(console.log);
  }
}
```
</details>


<details><summary><b>Models :satellite:</b></summary>

```typescript
export interface Configs {
  src: string;
  color: string;
  isAuto: boolean;
  isImage: boolean;
  languages: string[];
  jobId?: string;
  output?: Partial<OutputFormats>;
  options?: Partial<RecognizeOptions>;
};

export interface Scheduler {
  addWorker(worker: Worker): string;
  addJob(
    action: 'recognize',
    ...args: Parameters<Worker['recognize']>
  ): Promise<RecognizeResult>;
  addJob(
    action: 'detect',
    ...args: Parameters<Worker['detect']>
  ): Promise<DetectResult>;
  terminate(): Promise<any>;
  getQueueLen(): number;
  getNumWorkers(): number;
}

export interface Worker {
  load(jobId?: string): Promise<ConfigResult>;
  writeText(path: string, text: string, jobId?: string): Promise<ConfigResult>;
  readText(path: string, jobId?: string): Promise<ConfigResult>;
  removeText(path: string, jobId?: string): Promise<ConfigResult>;
  FS(method: string, args: any[], jobId?: string): Promise<ConfigResult>;
  loadLanguage(langs?: string | Lang[], jobId?: string): Promise<ConfigResult>;
  initialize(
    langs?: string | Lang[],
    oem?: OEM,
    config?: string | Partial<InitOptions>,
    jobId?: string
  ): Promise<ConfigResult>;
  setParameters(
    params: Partial<WorkerParams>,
    jobId?: string
  ): Promise<ConfigResult>;
  getImage(type: imageType): string;
  recognize(
    image: ImageLike,
    options?: Partial<RecognizeOptions>,
    output?: Partial<OutputFormats>,
    jobId?: string
  ): Promise<RecognizeResult>;
  detect(image: ImageLike, jobId?: string): Promise<DetectResult>;
  terminate(jobId?: string): Promise<ConfigResult>;
  getPDF(
    title?: string,
    textonly?: boolean,
    jobId?: string
  ): Promise<GetPDFResult>;
}

export interface Lang {
  code: string;
  data: unknown;
}

export interface InitOptions {
  load_system_dawg: string;
  load_freq_dawg: string;
  load_unambig_dawg: string;
  load_punc_dawg: string;
  load_number_dawg: string;
  load_bigram_dawg: string;
}

export type LoggerMessage = {
  jobId: string;
  progress: number;
  status: string;
  userJobId: string;
  workerId: string;
};

export interface WorkerOptions {
  corePath: string;
  langPath: string;
  cachePath: string;
  dataPath: string;
  workerPath: string;
  cacheMethod: string;
  workerBlobURL: boolean;
  gzip: boolean;
  logger: (arg: LoggerMessage) => void;
  errorHandler: (arg: any) => void;
}

export interface WorkerParams {
  tessedit_ocr_engine_mode: OEM;
  tessedit_pageseg_mode: PSM;
  tessedit_char_whitelist: string;
  preserve_interword_spaces: string;
  user_defined_dpi: string;
  tessjs_create_hocr: string;
  tessjs_create_tsv: string;
  tessjs_create_box: string;
  tessjs_create_unlv: string;
  tessjs_create_osd: string;
}

export interface OutputFormats {
  text: boolean;
  blocks: boolean;
  layoutBlocks: boolean;
  hocr: boolean;
  tsv: boolean;
  box: boolean;
  unlv: boolean;
  osd: boolean;
  pdf: boolean;
  imageColor: boolean;
  imageGrey: boolean;
  imageBinary: boolean;
  debug: boolean;
}

export interface RecognizeOptions {
  rectangle: Rectangle;
  pdfTitle: string;
  pdfTextOnly: boolean;
  rotateAuto: boolean;
  rotateRadians: number;
}

export interface ConfigResult {
  jobId: string;
  data: any;
}

export interface RecognizeResult {
  jobId: string;
  data: Page;
}

export interface GetPDFResult {
  jobId: string;
  data: number[];
}

export interface DetectResult {
  jobId: string;
  data: DetectData;
}

export interface DetectData {
  tesseract_script_id: number | null;
  script: string | null;
  script_confidence: number | null;
  orientation_degrees: number | null;
  orientation_confidence: number | null;
}

export interface Rectangle {
  left: number;
  top: number;
  width: number;
  height: number;
}

export enum OEM {
  TESSERACT_ONLY,
  LSTM_ONLY,
  TESSERACT_LSTM_COMBINED,
  DEFAULT,
}

export enum PSM {
  OSD_ONLY = '0',
  AUTO_OSD = '1',
  AUTO_ONLY = '2',
  AUTO = '3',
  SINGLE_COLUMN = '4',
  SINGLE_BLOCK_VERT_TEXT = '5',
  SINGLE_BLOCK = '6',
  SINGLE_LINE = '7',
  SINGLE_WORD = '8',
  CIRCLE_WORD = '9',
  SINGLE_CHAR = '10',
  SPARSE_TEXT = '11',
  SPARSE_TEXT_OSD = '12',
  RAW_LINE = '13',
}

export const enum imageType {
  COLOR = 0,
  GREY = 1,
  BINARY = 2,
}

export type ImageLike =
  | string
  | HTMLImageElement
  | HTMLCanvasElement
  | HTMLVideoElement
  | CanvasRenderingContext2D
  | File
  | Blob
  | ImageData
  | any;

export interface Block {
  paragraphs: Paragraph[];
  text: string;
  confidence: number;
  baseline: Baseline;
  bbox: Bbox;
  blocktype: string;
  polygon: any;
  page: Page;
  lines: Line[];
  words: Word[];
  symbols: Symbol[];
}

export interface Baseline {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  has_baseline: boolean;
}

export interface Bbox {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface Line {
  words: Word[];
  text: string;
  confidence: number;
  baseline: Baseline;
  bbox: Bbox;
  paragraph: Paragraph;
  block: Block;
  page: Page;
  symbols: Symbol[];
}

export interface Paragraph {
  lines: Line[];
  text: string;
  confidence: number;
  baseline: Baseline;
  bbox: Bbox;
  is_ltr: boolean;
  block: Block;
  page: Page;
  words: Word[];
  symbols: Symbol[];
}

export interface Symbol {
  choices: Choice[];
  image: any;
  text: string;
  confidence: number;
  baseline: Baseline;
  bbox: Bbox;
  is_superscript: boolean;
  is_subscript: boolean;
  is_dropcap: boolean;
  word: Word;
  line: Line;
  paragraph: Paragraph;
  block: Block;
  page: Page;
}

export interface Choice {
  text: string;
  confidence: number;
}

export interface Word {
  symbols: Symbol[];
  choices: Choice[];
  text: string;
  confidence: number;
  baseline: Baseline;
  bbox: Bbox;
  is_numeric: boolean;
  in_dictionary: boolean;
  direction: string;
  language: string;
  is_bold: boolean;
  is_italic: boolean;
  is_underlined: boolean;
  is_monospace: boolean;
  is_serif: boolean;
  is_smallcaps: boolean;
  font_size: number;
  font_id: number;
  font_name: string;
  line: Line;
  paragraph: Paragraph;
  block: Block;
  page: Page;
}

export interface Page {
  blocks: Block[] | null;
  confidence: number;
  lines: Line[];
  oem: string;
  osd: string;
  paragraphs: Paragraph[];
  psm: string;
  symbols: Symbol[];
  text: string;
  version: string;
  words: Word[];
  hocr: string | null;
  tsv: string | null;
  box: string | null;
  unlv: string | null;
  sd: string | null;
  imageColor: string | null;
  imageGrey: string | null;
  imageBinary: string | null;
  rotateRadians: number | null;
  pdf: number[] | null;
}
```
</details>


<details><summary><b>Language support :satellite:</b></summary>

```json
[
  {
    "name": "Afrikaans",
    "code": "afr",
    "dir": "ltr"
  },
  {
    "name": "Albanian",
    "code": "qi",
    "dir": "ltr"
  },
  {
    "name": "Amharic",
    "code": "amh",
    "dir": "rtl"
  },
  {
    "name": "Arabic",
    "code": "ara",
    "dir": "rtl"
  },
  {
    "name": "Armenian",
    "code": "hye",
    "dir": "ltr"
  },
  {
    "name": "Azerbaijani",
    "code": "aze",
    "dir": "ltr"
  },
  {
    "name": "Basque",
    "code": "eus",
    "dir": "ltr"
  },
  {
    "name": "Belarusian",
    "code": "bel",
    "dir": "ltr"
  },
  {
    "name": "Bengali",
    "code": "ben",
    "dir": "ltr"
  },
  {
    "name": "Bosnian",
    "code": "bos",
    "dir": "ltr"
  },
  {
    "name": "Bulgarian",
    "code": "bul",
    "dir": "ltr"
  },
  {
    "name": "Catalan",
    "code": "cat",
    "dir": "ltr"
  },
  {
    "name": "Cebuano",
    "code": "ceb",
    "dir": "ltr"
  },
  {
    "name": "Cherokee",
    "code": "chr",
    "dir": "ltr"
  },
  {
    "name": "Chinese (Simplified)",
    "code": "chi_sim",
    "dir": "ltr"
  },
  {
    "name": "Chinese (Traditional)",
    "code": "chi_tra",
    "dir": "ltr"
  },
  {
    "name": "Corsican",
    "code": "cos",
    "dir": "ltr"
  },
  {
    "name": "Croatian",
    "code": "hrv",
    "dir": "ltr"
  },
  {
    "name": "Czech",
    "code": "ces",
    "dir": "ltr"
  },
  {
    "name": "Danish",
    "code": "dan",
    "dir": "ltr"
  },
  {
    "name": "Dutch",
    "code": "nld",
    "dir": "ltr"
  },
  {
    "name": "English",
    "code": "eng",
    "dir": "ltr"
  },
  {
    "name": "Esperanto",
    "code": "epo",
    "dir": "ltr"
  },
  {
    "name": "Estonian",
    "code": "est",
    "dir": "ltr"
  },
  {
    "name": "Finnish",
    "code": "fin",
    "dir": "ltr"
  },
  {
    "name": "French",
    "code": "fra",
    "dir": "ltr"
  },
  {
    "name": "Frisian",
    "code": "fry",
    "dir": "ltr"
  },
  {
    "name": "Galician",
    "code": "glg",
    "dir": "ltr"
  },
  {
    "name": "Georgian",
    "code": "kat",
    "dir": "ltr"
  },
  {
    "name": "German",
    "code": "deu",
    "dir": "ltr"
  },
  {
    "name": "Greek",
    "code": "ell",
    "dir": "ltr"
  },
  {
    "name": "Gujarati",
    "code": "guj",
    "dir": "ltr"
  },
  {
    "name": "Haitian Creole",
    "code": "hat",
    "dir": "ltr"
  },
  {
    "name": "Hausa",
    "code": "hau",
    "dir": "rtl"
  },
  {
    "name": "Hebrew",
    "code": "heb",
    "dir": "rtl"
  },
  {
    "name": "Hindi",
    "code": "hin",
    "dir": "ltr"
  },
  {
    "name": "Hungarian",
    "code": "hun",
    "dir": "ltr"
  },
  {
    "name": "Icelandic",
    "code": "isl",
    "dir": "ltr"
  },
  {
    "name": "Igbo",
    "code": "ibo",
    "dir": "ltr"
  },
  {
    "name": "Indonesian",
    "code": "ind",
    "dir": "ltr"
  },
  {
    "name": "Irish",
    "code": "gle",
    "dir": "ltr"
  },
  {
    "name": "Italian",
    "code": "ita",
    "dir": "ltr"
  },
  {
    "name": "Japanese",
    "code": "jpn",
    "dir": "ltr"
  },
  {
    "name": "Javanese",
    "code": "jav",
    "dir": "ltr"
  },
  {
    "name": "Kannada",
    "code": "kan",
    "dir": "ltr"
  },
  {
    "name": "Kazakh",
    "code": "kaz",
    "dir": "ltr"
  },
  {
    "name": "Khmer",
    "code": "khm",
    "dir": "ltr"
  },
  {
    "name": "Kinyarwanda",
    "code": "kin",
    "dir": "ltr"
  },
  {
    "name": "Korean",
    "code": "kor",
    "dir": "ltr"
  },
  {
    "name": "Kurdish (Kurmanji)",
    "code": "kur_ara",
    "dir": "rtl"
  },
  {
    "name": "Kyrgyz",
    "code": "kir",
    "dir": "ltr"
  },
  {
    "name": "Lao",
    "code": "lao",
    "dir": "ltr"
  },
  {
    "name": "Latin",
    "code": "lat",
    "dir": "ltr"
  },
  {
    "name": "Latvian",
    "code": "lav",
    "dir": "ltr"
  },
  {
    "name": "Lithuanian",
    "code": "lit",
    "dir": "ltr"
  },
  {
    "name": "Luxembourgish",
    "code": "ltz",
    "dir": "ltr"
  },
  {
    "name": "Macedonian",
    "code": "kd",
    "dir": "ltr"
  },
  {
    "name": "Malagasy",
    "code": "lg",
    "dir": "ltr"
  },
  {
    "name": "Malay",
    "code": "sa",
    "dir": "ltr"
  },
  {
    "name": "Malayalam",
    "code": "al",
    "dir": "ltr"
  },
  {
    "name": "Maltese",
    "code": "lt",
    "dir": "ltr"
  },
  {
    "name": "Maori",
    "code": "i",
    "dir": "ltr"
  },
  {
    "name": "Marathi",
    "code": "ar",
    "dir": "ltr"
  },
  {
    "name": "Mongolian",
    "code": "on",
    "dir": "ltr"
  },
  {
    "name": "Myanmar (Burmese)",
    "code": "ya",
    "dir": "ltr"
  },
  {
    "name": "Nepali",
    "code": "nep",
    "dir": "ltr"
  },
  {
    "name": "Norwegian",
    "code": "nor",
    "dir": "ltr"
  },
  {
    "name": "Odia (Oriya)",
    "code": "ori",
    "dir": "ltr"
  },
  {
    "name": "Pashto",
    "code": "pus",
    "dir": "rtl"
  },
  {
    "name": "Persian",
    "code": "fas",
    "dir": "rtl"
  },
  {
    "name": "Polish",
    "code": "pol",
    "dir": "ltr"
  },
  {
    "name": "Portuguese",
    "code": "por",
    "dir": "ltr"
  },
  {
    "name": "Punjabi",
    "code": "pan",
    "dir": "ltr"
  },
  {
    "name": "Romanian",
    "code": "ron",
    "dir": "ltr"
  },
  {
    "name": "Russian",
    "code": "rus",
    "dir": "ltr"
  },
  {
    "name": "Samoan",
    "code": "mo",
    "dir": "ltr"
  },
  {
    "name": "Scots Gaelic",
    "code": "gla",
    "dir": "ltr"
  },
  {
    "name": "Serbian",
    "code": "rp",
    "dir": "ltr"
  },
  {
    "name": "Sesotho",
    "code": "ot",
    "dir": "ltr"
  },
  {
    "name": "Shona",
    "code": "na",
    "dir": "ltr"
  },
  {
    "name": "Sindhi",
    "code": "d",
    "dir": "rtl"
  },
  {
    "name": "Sinhala (Sinhalese)",
    "code": "in",
    "dir": "in"
  },
  {
    "name": "Slovak",
    "code": "k",
    "dir": "ltr"
  },
  {
    "name": "Slovenian",
    "code": "l",
    "dir": "ltr"
  },
  {
    "name": "Somali",
    "code": "o",
    "dir": "ltr"
  },
  {
    "name": "Spanish",
    "code": "pa",
    "dir": "ltr"
  },
  {
    "name": "Sundanese",
    "code": "u",
    "dir": "ltr"
  },
  {
    "name": "Swahili",
    "code": "wa",
    "dir": "ltr"
  },
  {
    "name": "Swedish",
    "code": "we",
    "dir": "ltr"
  },
  {
    "name": "Tajik",
    "code": "tg",
    "dir": "ltr"
  },
  {
    "name": "Tamil",
    "code": "ta",
    "dir": "ltr"
  },
  {
    "name": "Tatar",
    "code": "tt",
    "dir": "ltr"
  },
  {
    "name": "Telugu",
    "code": "te",
    "dir": "ltr"
  },
  {
    "name": "Thai",
    "code": "th",
    "dir": "ltr"
  },
  {
    "name": "Turkish",
    "code": "tur",
    "dir": "ltr"
  },
  {
    "name": "Ukrainian",
    "code": "ukr",
    "dir": "ltr"
  },
  {
    "name": "Urdu",
    "code": "urd",
    "dir": "rtl"
  },
  {
    "name": "Uzbek",
    "code": "uzb",
    "dir": "ltr"
  },
  {
    "name": "Vietnamese",
    "code": "vie",
    "dir": "ltr"
  },
  {
    "name": "Welsh",
    "code": "cym",
    "dir": "ltr"
  },
  {
    "name": "Xhosa",
    "code": "xho",
    "dir": "ltr"
  },
  {
    "name": "Yiddish",
    "code": "yi",
    "dir": "rtl"
  },
  {
    "name": "Yoruba",
    "code": "yo",
    "dir": "ltr"
  },
  {
    "name": "Zulu",
    "code": "zu",
    "dir": "ltr"
  }
]
```

```
Note that the `dir` property indicates the direction of the language,
where `ltr` means left-to-right and `rtl` means right-to-left.
```
</details>


### API Documentation :rescue_worker_helmet:

#### Input :electric_plug:

|   Field   |   Description   |   Type  | Default |
|   ---     |       ---       |   ---   | ---     |
| [configs] | config          | Configs | {}      |

#### Ouput :electric_plug:

| Field     | Description   | Type                    | Default |
| ---       | ---           | ---                     | ---     |
| (event)   | result data   | BehaviorSubject<Page>   | {}      |

#### Component exports :electric_plug:

| Field   | Description       | Type                    | Default               |
| ---     | ---               | ---                     | ---                   |
| data$   | result data       | BehaviorSubject<Page>   | {}                    | 
| logger$ | status            | BehaviorSubject         | {}                    | 
| image$  | actual photo size | BehaviorSubject         | {width: 0, height: 0} | 


#### Support versions

<table>
  <tr>
    <th colspan="2">Support versions</th>
  </tr>
  <tr>
    <td>Angular 16</td>
    <td>1.1.0</td>
  </tr>
  <tr>
    <td>Angular 14</td>
    <td>1.0.9</td>
  </tr>
</table>

#### Author Information
  
<table>
  <tr>
    <th colspan="2">Author Information</th>
  </tr>
  <tr>
    <td>Author</td>
    <td>DaiDH</td>
  </tr>
  <tr>
    <td>Phone</td>
    <td>+84845882882</td>
  </tr>
  <tr>
    <td>Country</td>
    <td>Vietnam</td>
  </tr>
</table>

#### If you want donate for me! :moneybag:

<table>
  <tr>
    <th>Bitcoin</th>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/id1945/id1945/master/donate-bitcoin.png" width="182px"></td>
  </tr>
</table>

![Vietnam](https://raw.githubusercontent.com/id1945/id1945/master/vietnam.gif)

[MIT License](https://github.com/id1945/ngx-scanner-text/blob/master/LICENSE) Copyright (c) 2022 DaiDH
