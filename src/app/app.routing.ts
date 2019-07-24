// Modules 3rd party
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 404 page
import { PageNotFoundComponent } from './pages/not-found/not-found.component';

// Pages
import { HomeComponent } from './pages/home/home.component';
import { AboutMeComponent } from './pages/about-me/about-me.component';
import { AuthComponent } from './pages/auth/auth.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileSettingsComponent } from './pages/profile/profile-settings.component';

// Components
import { MiscComponent } from './components/misc/misc.component';

// Protected
import { AuthGuardService } from '@shared';
import { CourseComponent } from './pages/course/course.component';
import { LessonComponent } from './pages/lesson/lesson.component';
import { LearnComponent } from './pages/learn/learn.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { ProgressComponent } from './pages/progress/progress.component';

// Routing
const appRoutes: Routes = [

  // Public pages
  { path: '', redirectTo: '/uvod', pathMatch : 'full' },
  { path: 'uvod', component: HomeComponent },
  { path: 'o-nas', component: AboutMeComponent },
  { path: 'misc', component: MiscComponent },
  { path: 'prihlaseni', component: AuthComponent },

  // Protected pages
  // { path: 'profile/:uid/:name', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'profil', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'nastaveni', component: ProfileSettingsComponent, canActivate: [AuthGuardService] },
  { path: 'postup-kurzem', component: ProgressComponent, canActivate: [AuthGuardService] },
  { path: 'kurz', canActivate: [AuthGuardService], 
    children: [
      { path: '', component: CourseComponent },
      { path: ':lesson',
        children: [
          { path: '', component: LessonComponent },
          { path: ':section', component: LearnComponent },
          { path: ':section/kviz', component: QuizComponent }
        ]
    }
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
