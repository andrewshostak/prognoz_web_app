import { Component, Input, OnInit } from '@angular/core';

import { CommentService } from '@app/news/shared/comment.service';
import { Sequence } from '@enums/sequence.enum';
import { Comment } from '@models/v2/comment.model';
import { CommentSearch } from '@models/search/comment-search.model';

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
      const search: CommentSearch = {
         sequence: Sequence.Descending,
         orderBy: 'created_at',
         limit: 3,
         page: 1,
         relations: ['user']
      };
      this.commentService.getComments(search).subscribe(response => (this.comments = response.data));
   }
}
