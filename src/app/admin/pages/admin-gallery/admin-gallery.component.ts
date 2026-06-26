import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GalleryService } from '../../../core/services/gallery.service';
import { GalleryItem } from '../../../core/models/gallery-item.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-gallery',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './admin-gallery.component.html',
  styleUrl: './admin-gallery.component.scss',
})
export class AdminGalleryComponent implements OnInit {
  items$!: Observable<GalleryItem[]>;
  constructor(private galleryService: GalleryService) {}

  ngOnInit(): void {
    this.items$ = this.galleryService.getAll();
  }

  deactivate(id: string, title: string): void {
    if (confirm(`Hide "${title}" from the public gallery?`)) {
      this.galleryService.deactivateItem(id).subscribe();
    }
  }

  delete(id: string, title: string): void {
    if (confirm(`Permanently delete "${title}"?`)) {
      this.galleryService.deleteItem(id).subscribe();
    }
  }
}
