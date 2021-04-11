import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { Photo } from '../models/photo.interface';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  public photos:Photo[]=[];

  constructor(private phothoService:PhotoService) {
  }
  ngOnInit():void{

    this.phothoService.loadSaved().then(()=>{
    this.photos=this.phothoService.getPhotos();
    })
  }

   public newPhoto():void{
    this.phothoService.addNewToGallery()
  }

}
