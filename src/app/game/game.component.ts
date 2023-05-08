import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { AddPlayerComponent } from '../add-player/add-player.component';
import { Firestore, collection, collectionData, doc, docData, onSnapshot, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { addDoc, getDoc } from '@firebase/firestore';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game: Game;
  firestore: Firestore = inject(Firestore);
  item$: Observable<any>;
  id: any;
  currentId: any;

  constructor(public dialog: MatDialog, private route: ActivatedRoute) {
    const game = collection(this.firestore, 'games');
    this.item$ = collectionData(game);
  }

  //checks for new data and update them
  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe(async (params) => {
      this.id = params['id']

      const docRef = doc(this.firestore, "games", this.id);
      this.item$ = new Observable(observer => {
        onSnapshot(docRef, (docSnapshot) => {
          observer.next(docSnapshot.data());
        });
      });

      this.item$.subscribe((game: any) => {
        this.game.currentPlayer = game.game.currentPlayer;
        this.game.playedCards = game.game.playedCards;
        this.game.players = game.game.players;
        this.game.stack = game.game.stack;
        this.game.pickCardAnimation = game.game.pickCardAnimation;
        this.game.currentCard = game.game.currentCard;
      })
    })
  }


  async saveGame() {
    const itemCollection = collection(this.firestore, 'games');
    const docRef = doc(itemCollection, this.id);
    await updateDoc(docRef, { game: this.game.toJson() });
  }

  newGame(): void {
    this.game = new Game();
  }


  getCard() { // % rest
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1250)
    }
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(AddPlayerComponent);

    dialogRef.afterClosed().subscribe((name) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }
}
