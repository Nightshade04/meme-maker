import { Injectable } from '@angular/core';
import { ToastController, Platform, LoadingController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class WidgetUtilService {

  loading: any = {}

  constructor(
    private toastController: ToastController,
    private platform: Platform,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: this.platform.is('desktop') ? 'top' : 'bottom'
    });
    toast.present();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      spinner: "circular",
      message: 'Please Wait...',
      translucent: true
    });
    await this.loading.present();
  }

  async dismissLoader() {
    await this.loading.dismiss();
  }

  async presentAlertConfirm(header, message, buttons) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: buttons
    });

    await alert.present();
  }

}
