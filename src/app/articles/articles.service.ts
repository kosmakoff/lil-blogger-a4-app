import { Injectable } from '@angular/core';
import { FirebaseService } from '../shared/services/firebase.service';

@Injectable()
export class ArticlesService {
    constructor(private firebaseService: FirebaseService) {
    }
}
