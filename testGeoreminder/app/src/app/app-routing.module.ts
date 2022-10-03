import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RemindersComponent } from './pages/reminders/reminders.component';
import { TutorialComponent } from './pages/tutorial/tutorial.component';


const routes: Routes = [
  {
    path:'',
    component: HomeComponent
  },
  {
    path:'reminders',
    component: RemindersComponent
  },
  {
    path:'tutorial',
    component: TutorialComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
