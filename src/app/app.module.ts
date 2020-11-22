// Modules 3rd party
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatMenuModule, MatInputModule, MatSnackBarModule,
         MatToolbarModule, MatDialogModule, MatSidenavModule, MatNativeDateModule,
         MatCardModule, MatTabsModule, MatIconModule, MatProgressSpinnerModule, MatGridListModule, MatRadioModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';
import { MatCarouselModule } from '@ngmodule/material-carousel'; 

// Modules
import { BlocksModule } from './components/blocks/blocks.module';
import { AuthModule } from './pages/auth/auth.module';
import { ProfileModule } from './pages/profile/profile.module';
import { MiscModule } from './components/misc/misc.module';

// Shared
import {
  FooterComponent,
  HeaderComponent,
  UserService,
  AlertService,
  AuthGuardService,
  AuthService,
  WindowService,
  CorporaService,
  ProgressService
} from '@shared';

// Main
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { firebaseKeys } from './firebase.config';

// Pages
import { HomeComponent } from './pages/home/home.component';
import { AboutMeComponent } from './pages/about-me/about-me.component';
import { PageNotFoundComponent } from './pages/not-found/not-found.component';

// Components
import { CourseComponent } from './pages/course/course.component';
import { LessonComponent } from './pages/lesson/lesson.component';
import { LearnComponent } from './pages/learn/learn.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { ProgressComponent } from './pages/progress/progress.component';
import { TasksModule } from './tasks/tasks.module';
import { SanitizePipe } from './shared/pipes/sanitize-pipe.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutMeComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    CourseComponent,
    LessonComponent,
    LearnComponent,
    QuizComponent,
    ProgressComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule, MatCheckboxModule, MatMenuModule, MatInputModule, MatSnackBarModule,
    MatToolbarModule, MatDialogModule, MatSidenavModule, MatNativeDateModule,
    MatCardModule, MatTabsModule, MatIconModule, MatProgressSpinnerModule, MatGridListModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BlocksModule,
    AuthModule,
    TasksModule,
    ProfileModule,
    MiscModule,
    MatCarouselModule,
    NgxAuthFirebaseUIModule.forRoot(firebaseKeys)
  ],
  providers: [
    UserService,
    AlertService,
    AuthGuardService,
    AuthService,
    WindowService,
    CorporaService,
    ProgressService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
