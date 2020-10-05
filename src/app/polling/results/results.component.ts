import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ResultsComponent implements OnInit {
    public doughnutChartType = 'doughnut';
    public doughnutChartColors = [
        {
            backgroundColor: [
                '#5107F2', //
                '#22D8B7',
                '#D6F204',
            ],
        },
    ];

    @Input() pollResults$: Observable<any>;
    @Input() totalQuestions: number;
    @Input() currentQuestion: number;
    @Input() init: boolean;

    @Output('resetPoll') resetPollForm: EventEmitter<any> = new EventEmitter<any>();
    @Output('initPoll') initPollForm: EventEmitter<any> = new EventEmitter<any>();
    @Output('updateQuestion') updateCurrentQuestion: EventEmitter<any> = new EventEmitter<any>();

    constructor() {}

    ngOnInit(): void {}

    nextQuestion() {
        if (this.currentQuestion == this.totalQuestions && this.init == false) {
            this.initPoll();
        } else if (this.currentQuestion == this.totalQuestions && this.init == true) {
            this.resetPoll();
        } else {
            this.updateQuestion();
        }
    }

    initPoll() {
        this.initPollForm.emit();
    }

    resetPoll() {
        this.resetPollForm.emit();
    }

    updateQuestion() {
        this.updateCurrentQuestion.emit();
    }
}
