import { Component, OnInit }                    from '@angular/core';
import { Router, ActivatedRoute, Params }       from '@angular/router';
import { FormBuilder, FormGroup, Validators }   from '@angular/forms';
import { NotificationsService }                 from 'angular2-notifications';

import { Club }                                 from '../shared/club.model';
import { ManageClubService }                    from '../shared/manage-club.service';
import { API_IMAGE_CLUBS }                      from '../../../shared/app.settings';

@Component({
  selector: 'app-club-edit',
  templateUrl: './club-edit.component.html',
  styleUrls: ['./club-edit.component.css']
})
export class ClubEditComponent implements OnInit {

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private notificationService: NotificationsService,
        private manageClubService: ManageClubService
    ) { }

    club: Club;
    clubs: Club[];
    error: string | Array<string>;
    clubEditForm: FormGroup;
    clubImagesUrl = API_IMAGE_CLUBS;

    ngOnInit() {
        this.clubEditForm = this.formBuilder.group({
            id: ['', [Validators.required]],
            title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            link: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            image: [''],
            parent_id: ['']
        });
      
        this.activatedRoute.params.forEach((params: Params) => {
            let id = +params['id'];
            this.manageClubService.getClub(id).subscribe(
                response => {
                    this.clubEditForm.patchValue({
                        id: response.id,
                        title: response.title,
                        link: response.link,
                        parent_id: response.parent_id
                    });
                    this.club = response;
                },
                error => this.error = error
            );
        });

        this.manageClubService.getAllNationalTeams().subscribe(
            result => this.clubs = result,
            error => this.error = error
        );
    }

    fileChange(event) {
        let fileList: FileList = event.target.files;
        if(fileList.length > 0) {
            let file: File = fileList[0];
            let myReader: FileReader = new FileReader();
            myReader.onload = (e) => {
                this.clubEditForm.patchValue({
                    image: myReader.result
                });
            };
            myReader.readAsDataURL(file);
        }
    }

    onSubmit() {
        if (this.clubEditForm.value.parent_id === 'country') this.clubEditForm.value.parent_id = null;
        this.manageClubService.update(this.clubEditForm.value).subscribe(
            response => {
                this.router.navigate(['/manage/clubs']);
                this.notificationService.success('Успішно', 'Дані команди змінено!');
            },
            errors => {
                for (let error of errors) {
                    this.notificationService.error('Помилка', error);
                }
            }
        );
    }

}
