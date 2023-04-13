import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.component.html',
  styleUrls: ['./add-player.component.scss']
})
export class AddPlayerComponent implements OnInit {
  name: string = '';

  constructor(public dialogRef: MatDialogRef<AddPlayerComponent>) { }

  ngOnInit(): void {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
