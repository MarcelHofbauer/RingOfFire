import { Component, OnInit, inject } from '@angular/core';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { addDoc } from '@firebase/firestore';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  game: Game;


  constructor(private router: Router) {}

  ngOnInit(): void {}

  async newGame() {
    this.game = new Game();
    const itemCollection = collection(this.firestore, 'games');
    const docSnap = await addDoc(itemCollection, {game: this.game.toJson()})
    let id = docSnap.id    
    this.router.navigateByUrl('/game/' + id)
  }
}
