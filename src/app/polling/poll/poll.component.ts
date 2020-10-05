import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-poll',
    templateUrl: './poll.component.html',
    styleUrls: ['./poll.component.scss'],
})
export class PollComponent implements OnInit {
    forma: FormGroup;
    pollValue: number;
    isDisabled: boolean = false;
    private _currentQuestion: number;

    @Input() pollResults$: Observable<any>;
    @Input() totalQuestions: number;
    @Input() init: boolean;
    @Input() set currentQuestion(value: number) {
        this._currentQuestion = value;
        this.clearForm();
    }

    @Output('sendAnswer') sendFormAnswer: EventEmitter<any> = new EventEmitter<any>();

    get currentQuestion(): number {
        return this._currentQuestion;
    }

    get pollOption() {
        return this.forma.get('pollOption');
    }

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.crearFormulario();
    }

    crearFormulario() {
        this.forma = this.fb.group({
            pollOption: ['', [Validators.required]],
        });
    }

    sendAnswer(currentQ: number) {
        this.pollValue = this.pollOption.value;
        this.isDisabled = true;
        this.setAnswerStatus();
        this.sendFormAnswer.emit({ pollValue: this.pollValue, currentQuestion: currentQ });
    }

    clearForm() {
        const answered = this.getAnswerStatus();
        if (!answered) {
            this.forma.patchValue({ pollOption: '' });
            this.isDisabled = false;
        } else {
            this.userWarning();
        }
    }

    fillForm(option) {
        this.forma.patchValue({ pollOption: option });
        this.isDisabled = true;
    }

    setAnswerStatus() {
        let answers = {};
        answers = JSON.parse(sessionStorage.getItem('answeredQuestions')) || {};
        answers[this.currentQuestion] = this.pollValue;
        sessionStorage.setItem('answeredQuestions', JSON.stringify(answers));
    }

    getAnswerStatus(): boolean {
        let answers = {};
        if (typeof sessionStorage.answeredQuestions !== 'undefined') {
            answers = JSON.parse(sessionStorage.getItem('answeredQuestions'));
        }

        let longitud = Object.keys(answers).length;

        let indice = Object.keys(answers)
            .map((value) => parseInt(value))
            .indexOf(this.currentQuestion);

        if (longitud > 0 && indice != -1) {
            this.fillForm(answers[this.currentQuestion]);
            return true;
        } else {
            return false;
        }
    }

    userWarning() {
        alert('You already sent your answer for this question');
    }
}
