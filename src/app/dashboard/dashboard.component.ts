import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { IntentService } from '../../services/intent.service';
import { Message } from '../../models/message';
import { Subscription } from 'rxjs/Subscription';
import { Howl } from 'howler';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  text = '';
  messages: Message[];
  subscription: Subscription;
  @ViewChild('content') private myScrollContainer: ElementRef;
  sound: any;
  constructor(private intentService: IntentService) {

    this.sound = new Howl({
      src: ['assets/tone.mp3'],
      html5: true
    });
   }

  ngOnInit() {
    this.messages = [];
    this.subscription = this.intentService.intentsChanged.subscribe((msg: Message) => {
      this.messages.push(msg);
      this.sound.play();
      this.scrollToBottom();
    });
  }

  getQuery() {
    if (this.text.trim() !== '') {
      const msg = new Message(this.text.trim(), null, 'user');
      this.sound.play();
      this.messages.push(msg);
      this.intentService.query(this.text);
      this.text = '';
      this.scrollToBottom();
    }
  }

  btnClick(input: string) {
    this.text = input;
    this.getQuery();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

}
