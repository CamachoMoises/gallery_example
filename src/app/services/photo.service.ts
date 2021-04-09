import { Injectable } from '@angular/core';
import { Plugins, CameraResultType, Capacitor, FilesystemDirectory, CameraPhoto, CameraSource } from "@capacitor/core";
import { Photo } from '../models/photo.interface';


const { Camera, Filesystem, Storage } = Plugins;
@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private photos: Photo[] = [];

  constructor() { }

  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri, // file-based data; provides best performance
      source: CameraSource.Camera, // automatically take a new photo with the camera
      quality: 100 // highest quality (0 to 100)
    });

    // Save the picture and add it to photo collection
    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);
  }
  public getPhotos(): Photo[] {
    return this.photos
  }
  private async savePicture(cameraPhoto: CameraPhoto):Promise<Photo> {
    const base64Data = await this.readAsBase64(cameraPhoto);

    const fileName = new Date().getTime() + ',jpeg';

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data
    });
    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return await this.getPhotoFile(cameraPhoto, fileName);
  }
  private async getPhotoFile(cameraPhoto:CameraPhoto,fileName:string ):Promise<Photo>{
    return {
      filepath: fileName,
      webviewPath:cameraPhoto.webPath
    }
  }
  private async readAsBase64(cameraPhoto: CameraPhoto) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const respose = await fetch(cameraPhoto.webPath);
    const blob = await respose.blob();
    return await this.convertBlobtoBase64(blob) as string;
  }
  convertBlobtoBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload= ()=>{
      resolve(reader.result)
    };
    reader.readAsDataURL(blob);
  })
}
