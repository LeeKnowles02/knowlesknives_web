import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { GalleryService } from '../../../core/services/gallery.service';
import { GalleryItem } from '../../../core/models/gallery-item.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnInit {
  items$!: Observable<GalleryItem[]>;
  constructor(private galleryService: GalleryService) {}

  ngOnInit(): void {
    this.items$ = this.galleryService.getActive();
  }
}
