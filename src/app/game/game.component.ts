import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { AddPlayerComponent } from '../add-player/add-player.component';
import { Firestore, collection, collectionData, doc, docData, onSnapshot, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { addDoc, getDoc } from '@firebase/firestore';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  game: Game;
  currentCard: string = '';
  firestore: Firestore = inject(Firestore);
  item$: Observable<any>;
  id: any;
  currentId: any;

  constructor(public dialog: MatDialog, private route: ActivatedRoute) {
    const game = collection(this.firestore, 'games');
    this.item$ = collectionData(game);    
  }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe(async (params) => {
      let id = params['id']

      const docRef = doc(this.firestore, "games", id);
      this.item$ = new Observable(observer => {
        onSnapshot(docRef, (docSnapshot) => {
          observer.next(docSnapshot.data());
        });
      });
            
      this.item$.subscribe((game: any) => {
        this.game.currentPlayer = game.currentPlayer;
        this.game.playedCards = game.playedCards;
        this.game.players = game.players;
        this.game.stack = game.stack;
        console.log('game', game);
      })
    })
  }

  newGame(): void {
    this.game = new Game();
    // const itemCollection = collection(this.firestore, 'games');
    // setDoc(doc(itemCollection), {game: this.game.toJson()});

  }

  getCard() { // % rest
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1250)
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddPlayerComponent);

    dialogRef.afterClosed().subscribe((name) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }
}
