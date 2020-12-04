import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import { PhotoService } from '../services/photo-service.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import * as watermark from 'watermarkjs';

@Component({
  selector: 'app-imageeditor',
  templateUrl: './imageeditor.page.html',
  styleUrls: ['./imageeditor.page.scss'],
})
export class ImageeditorPage implements OnInit {

  private imageUrl: string = null;
  private croppedImage: string = null;
  private croppedInterImage: string = null;
  private toggleWatermarkCard: boolean = false;
  private blobImage: any = null;
  public watermarkText: string = '';

  @ViewChild(ImageCropperComponent, { static: false }) cropperArea: ImageCropperComponent;
  @ViewChild('previewImage', { static: false }) watermarkedImage: ElementRef;
  constructor(
    private photoService: PhotoService,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.imageUrl = params["imageUrl"];
    });
  }

  saveImage(imageUrl) {
    /** To add function of keeping or discarding original */ 
    /*  INITIAL IDEA :- create one more dialog box and then add one more param in the save() fn call */
    this.photoService.save(imageUrl);
    this.navCtrl.pop();
  }

  discardImage() {
    this.navCtrl.pop();
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedInterImage = event.base64;
  }

  showCroppedImage() {
    this.croppedImage = this.croppedInterImage;

    fetch(this.croppedImage)
      .then(res => res.blob())
      .then(blob => {
        this.blobImage = blob
        console.log(this.blobImage)
      })
      .catch(err => console.log(err));

  }

  /** Might Move to next Page */
  addTextWatermark(options) {
    console.log('HERE', this.watermarkText)
    this.toggleWatermarkCard = this.toggleWatermarkCard ? false : true;
    // let text = options.text;
    // let font = options.font;
    // let color = options.color;
    // let tranparency = options.tranparency;
    // watermark([this.blobImage])
    // .image(watermark.text.center(text, font, color, tranparency))
    // .then(img => {
    //   this.watermarkedImage.nativeElement.src = img.src;
    // })

    watermark([this.blobImage])
      .image(watermark.text.center("YOUR Text HERE", '256px Ariel', '#0a9', 0.6))
      .then(img => {
        this.watermarkedImage.nativeElement.src = img.src;
      })

  }

}
