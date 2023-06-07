import { Component, Input, OnInit } from '@angular/core';

import { CommentNewService } from '@app/news/shared/comment-new.service';
import { Sequence } from '@enums/sequence.enum';
import { CommentNew } from '@models/v2/comment-new.model';
import { CommentSearch } from '@models/search/comment-search.model';

@Component({
   selector: 'app-last-comments',
   templateUrl: './last-comments.component.html',
   styleUrls: ['./last-comments.component.scss']
})
export class LastCommentsComponent implements OnInit {
   constructor(private commentService: CommentNewService) {}

   @Input() limitTo = 100;

   comments: CommentNew[];

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
