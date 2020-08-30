import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { PhotoService } from '../services/photo-service.service'
import { WidgetUtilService } from '../services/widget-util.service';

@Component({
  selector: 'app-library',
  templateUrl: 'library.page.html',
  styleUrls: ['library.page.scss']
})
export class Tab1Page {

  showLibrarayLoadSpinner: boolean = false;

  constructor(
    private photoService: PhotoService,
    private navCtrl: NavController,
    private widgetUtilService: WidgetUtilService
  ) { }

  ngOnInit() {
    try {
      this.showLibrarayLoadSpinner = true;
      this.photoService.loadSaved();
      this.showLibrarayLoadSpinner = false;
    } catch (error) {
      this.widgetUtilService.presentToast('Error Loading Images, Try again Later');
      this.showLibrarayLoadSpinner = false;
    }
  }

  async fabController(type) {
    try {
      this.showLibrarayLoadSpinner = true;
      await this.photoService.pickImage(type);
      this.showLibrarayLoadSpinner = false;
    } catch( error ) {
      this.showLibrarayLoadSpinner = false;
      this.widgetUtilService.presentToast('Error: '+error.message);
    }
  }

  imageViewer(data) {
    this.widgetUtilService.presentAlertConfirm(
      'Image Options',
      'What do you want to do with this image?',
      [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: (blah) => {
          }
        },
        {
          text: 'Edit',
          handler: () => {
            let navigationExtras: NavigationExtras = {
              queryParams: {
                imageUrl: data
              }
            }
            this.navCtrl.navigateForward(['imageeditor'], navigationExtras);
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteImage(data);
          }
        }
      ]
    );
  }

  deleteImage(imageUrl) {
    this.photoService.delete(imageUrl);
  }

}
