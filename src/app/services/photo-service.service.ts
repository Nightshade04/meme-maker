import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';
import { Photo } from '../models/photo';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: Photo[] = [];
  public filePhotos: Photo[] = [];

  constructor(
    private camera: Camera,
    private storage: Storage
  ) { }

  async pickImage(type) {

    /** this is the testing code for grabbing the images from assets foldedr for testing without deployment */

    // this.convertFileToDataUrlViaFileReader('assets/images/Pic1.png').subscribe(
    //   base64 => {
    //     this.filePhotos.push({
    //       data: base64
    //     });
    //   }
    // );

    // this.convertFileToDataUrlViaFileReader('assets/images/Pic2.png').subscribe(
    //   base64 => {
    //     this.filePhotos.push({
    //       data: base64
    //     });
    //   }
    // );

    // this.convertFileToDataUrlViaFileReader('assets/images/Pic3.png').subscribe(
    //   base64 => {
    //     this.filePhotos.push({
    //       data: base64
    //     });
    //   }
    // );

    // this.convertFileToDataUrlViaFileReader('assets/images/Pic4.png').subscribe(
    //   base64 => {
    //     this.filePhotos.push({
    //       data: base64
    //     });
    //   }
    // );

    // FOR NATIVE USE

    let sourceType = undefined;
    if (type === 'Load from Library') {
      sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
    } else if (type === 'Use Camera') {
      sourceType = this.camera.PictureSourceType.CAMERA;
    }

    console.log(sourceType, type);

    const options: CameraOptions = {
      quality: 50,
      targetHeight: 400,
      targetWidth: 400,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    try {
      const imageData = await this.camera.getPicture(options);
      console.log(imageData);
      this.photos.unshift({
        data: 'data:image/jpeg;base64,' + imageData
      });
      this.storage.set('photos', this.photos);
    } catch (error) {
      throw new Error(error);
    }
  }

  /** remove this method when deploying */
  convertFileToDataUrlViaFileReader(url: string) {
    return Observable.create(observer => {
      let xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.onload = function () {
        let reader: FileReader = new FileReader();
        reader.onloadend = function () {
          observer.next(reader.result);
          observer.complete();
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    })
  }

  loadSaved() {

    // this.pickImage('aise hi');
    // this.photos = this.filePhotos || [];

    // For native use
    this.storage.get('photos').then((photos) => {
      this.photos = photos || [];
    })
  }

  save(imageUrl) {
    var index = this.photos.findIndex(val => val.data == imageUrl);
    if (index != -1) {
      this.photos.splice(index, 1);
    }
    this.photos.unshift({
      data: imageUrl
    });
    this.storage.set('photos', this.photos);
  }

  delete(imageUrl) {
    this.photos.splice(this.photos.findIndex((val) => { return val.data == imageUrl }), 1);
    this.storage.set('photos', this.photos);
  }

}
