import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CommentService } from '@app/news/shared/comment.service';
import { Comment } from '@models/v2/comment.model';
import { User } from '@models/v2/user.model';
import { AuthService } from '@services/v2/auth.service';
import { NotificationsService } from 'angular2-notifications';
import { trim } from 'lodash';

@Component({
   selector: 'app-comment-form',
   templateUrl: './comment-form.component.html'
})
export class CommentFormComponent implements OnInit {
   @Input() public newsId: number;
   @Output() public commentCreated = new EventEmitter<Comment>();

   public commentForm: FormGroup;
   public spinnerButton = false;
   public user: User;

   constructor(
      private authService: AuthService,
      private commentService: CommentService,
      private notificationsService: NotificationsService
   ) {}

   public ngOnInit(): void {
      this.user = this.authService.getUser();

      this.commentForm = new FormGroup({
         body: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(1000)])
      });
   }

   public submit(): void {
      if (this.commentForm.invalid) {
         return;
      }

      this.spinnerButton = true;
      const message = { body: trim(this.commentForm.get('body').value), news_id: this.newsId };
      this.commentService.createComment(message).subscribe(
         response => {
            this.spinnerButton = false;
            this.commentForm.reset();
            this.notificationsService.success('Успішно', 'Коментар додано');
            this.commentCreated.emit(response);
         },
         () => (this.spinnerButton = false)
      );
   }
}
