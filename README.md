# ngx-scanner-text

This library is built with the purpose of automatically getting text in images.
This is the [codesandbox](https://codesandbox.io/s/angular-ngx-scanner-text-16856z).

![Logo](https://raw.githubusercontent.com/id1945/ngx-scanner-text/master/ngx-scanner-text-mark.png)

### Installation
npm i ngx-scanner-text --save

### Usage
```typescript 
import { NgxScannerTextModule } from "ngx-scanner-text";

@NgModule({
    imports: [NgxScannerTextModule],
    ...
})
export class AppModule {}
```

```html
<ngx-scanner-text
  #scanner
  [languages]="['eng']"
  [src]="'https://tesseract.projectnaptha.com/img/eng_bw.png'"
  (data)="onData($event)"
></ngx-scanner-text>

<pre>
  <textarea cols="80" rows="6">{{ scanner?._logger | json }}</textarea>
</pre>
```

```typescript
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  onData(e) {
    console.log(e.text);
  }
}
```

### Support versions
| ng version |  version   |
|     ---    |    ---     |
| Angular 14 |   1.0.0    |


Author: `DaiDH`, Tel: `0845882882`

### License

[MIT License](https://github.com/id1945/ngx-scanner-text/blob/master/LICENSE). Copyright (c) 2022 DaiDH