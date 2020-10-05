import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FirestoreService } from './core/firestore.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'polly';
    pollResults$: Observable<any>;
    totalQuestions$: Observable<any>;
    init$: Observable<any>;
    totalQuestions: number;
    currentQuestion: number;
    init: boolean;
    showPoll: boolean = true;
    adminUser: boolean = false;

    //Set credentials for basic authentication
    user: string = 'abcd';
    password: string = 'abcd1234';

    constructor(private firestoreService: FirestoreService) {}

    ngOnInit(): void {
        this.getUser();

        this.pollResults$ = this.firestoreService.pollResults$.pipe(
            tap((pollResults) => {
                this.currentQuestion = pollResults.pollData.currentQuestion;
                this.totalQuestions = pollResults.pollData.totalQuestions;
            })
        );
        this.init$ = this.firestoreService.init$.pipe(
            tap((value) => {
                this.init = value;
            })
        );
    }

    updateQuestion() {
        this.firestoreService.updateQuestion(this.currentQuestion);
    }

    resetPoll() {
        this.firestoreService.resetPoll();
    }

    initPoll() {
        this.firestoreService.initPoll();
    }

    sendAnswer(value: any) {
        this.firestoreService.sendAnswer(value.pollValue, value.currentQuestion);
    }

    hostLogin() {
        let a = prompt('Enter your user ID');
        let b = prompt('Enter your password');

        if (a == this.user && b == this.password) {
            alert('Thank you for visiting');
            this.showPoll = true;
            this.adminUser = true;
            this.setUser(this.adminUser);
        } else {
            alert('Wrong ID or password!!');
        }
    }

    setUser(admin) {
        if (admin) {
            sessionStorage.setItem('user', 'host');
        } else {
            sessionStorage.setItem('user', 'guest');
        }
    }

    getUser() {
        const userType = sessionStorage.getItem('user');
        if (userType == 'host') {
            this.showPoll = true;
            this.adminUser = true;
        } else {
            this.setUser(this.adminUser);
        }
    }
}
