import { Component } from '@angular/core';
import { NgxScannerTextComponent, PSM } from 'ngx-scanner-text';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngx-scanner-text-private';

  public text!: string;

  public configs = {
    src: 'https://raw.githubusercontent.com/id1945/ngx-scanner-text/master/ngx-scanner-text-origin.png',
    languages: ['eng'],
    color: 'red',
    isAuto: true,
    isImage: false,
    // isAuto: false,
    // isImage: true,
    // options: {
    //   rectangle: {
    //     left: 70,
    //     top: 500,
    //     width: 100,
    //     height: 500
    //   }
    // }
  }

  onData(e: any) {
    console.log(e.text);
    this.text = e.text;
  }

  onScanOCR(scanner: NgxScannerTextComponent) {
    const setting = async (worker: any) => {
      // await worker.setParameters({
      //   tessedit_ocr_engine_mode: PSM.AUTO,
      //   tessedit_pageseg_mode: PSM.AUTO,
      //   tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ<',
      // });
      // this.configs.options.rectangle.width = scanner.image$.value?.width - 100;
      // this.configs.options.rectangle.height = scanner.image$.value?.height - 500;
      // console.log(worker);
    }
    scanner.scanOCR(this.configs, setting).subscribe();
    // scanner.scanOCR();
  }
}
