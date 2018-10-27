import { Component, Input, OnInit } from '@angular/core';

import { Comment } from '@models/comment.model';
import { CommentService } from '../../../news/shared/comment.service';
import { RequestParams } from '@models/request-params.model';

@Component({
    selector: 'app-last-comments',
    templateUrl: './last-comments.component.html',
    styleUrls: ['./last-comments.component.scss']
})
export class LastCommentsComponent implements OnInit {
    constructor(private commentService: CommentService) {}

    @Input() limitTo = 100;

    comments: Comment[];

    shortenText(text: string): string {
        if (this.limitTo === 0) {
            return text;
        }

        const shortenText = text.slice(0, this.limitTo);
        return shortenText + (text.length > this.limitTo ? '...' : '');
    }

    ngOnInit() {
        this.getCommentsData();
    }

    private getCommentsData(): void {
        const requestParams: RequestParams[] = [
            { parameter: 'limit', value: '3' },
            { parameter: 'order_by', value: 'created_at' },
            { parameter: 'sequence', value: 'desc' }
        ];
        this.commentService.getComments(requestParams).subscribe(response => (this.comments = response));
    }
}
