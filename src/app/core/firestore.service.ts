import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, share, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class FirestoreService {
    pollCollection: AngularFirestoreCollection<any> = this.firestore.collection('habilidades-blandas');
    pollDoc: AngularFirestoreDocument<any> = this.pollCollection.doc('J6lZyiWbHMvjbTIeYmcU');
    currentQuestion: number = 0;
    totalQuestions: number;

    private initSubject = new BehaviorSubject<boolean>(false);
    init$ = this.initSubject.asObservable();

    pollData$ = this.pollCollection.snapshotChanges().pipe(
        map((actions) => {
            return actions.map((a) => {
                const data = a.payload.doc.data();
                data.id = a.payload.doc.id;
                return data;
            });
        }),
        tap((data) => console.log('pollData', data))
    );

    pollDoc$ = this.pollDoc.snapshotChanges().pipe(
        map((actions) => {
            const activeQuestion = actions.payload.data()[`question${actions.payload.data().current + 1}`];
            const totalQ = Object.keys(actions.payload.data()).filter((dato) => dato.includes('question')).length;
            if (!activeQuestion) {
                this.resetPoll();
                throw Error('Parameter is not a number!');
            }
            return {
                currentQuestion: actions.payload.data().current + 1,
                totalQuestions: totalQ,
                question: activeQuestion.text, //
                options: [activeQuestion.option1, activeQuestion.option2, activeQuestion.option3],
            };
        }),
        tap((data) => console.log('pollDoc', data))
    );

    pollResults$ = combineLatest([this.pollData$, this.pollDoc$]).pipe(
        map(([data, pregunta]) => {
            const filtrado = data.filter((resultado) => {
                return resultado.id === `question${pregunta.currentQuestion}`;
            });
            return { pollData: pregunta, results: filtrado[0] };
        }),
        tap((data) => console.log('pollResults', data)),
        share() //this is to make the Observable Hot, so that we can subscribe multiple times to it without replicating it.
    );

    constructor(private firestore: AngularFirestore) {}

    updateQuestion(currentQuestion) {
        this.pollDoc
            .update({ current: currentQuestion })
            .then(() => {
                console.log('done current question: ', currentQuestion);
            })
            .catch(function (error) {
                console.error('Error writing document: ', error);
            });
    }

    resetPoll() {
        this.currentQuestion = 0;
        this.initSubject.next(false);
        this.pollDoc.update({ current: this.currentQuestion });
    }

    initPoll() {
        this.initSubject.next(true);
    }

    sendAnswer(option: number, currentQuestion: number) {
        const question = this.pollCollection.doc(`question${currentQuestion}`);

        question.ref.get().then((choices) => {
            let votes = choices.data()[`votes${option}`];
            question.update({
                [`votes${option}`]: ++votes,
            });
        });
    }
}
