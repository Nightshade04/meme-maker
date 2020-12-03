import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'library',
        loadChildren: () => import('../library/library.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'community',
        loadChildren: () => import('../community/community.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'user',
        loadChildren: () => import('../user/user.module').then(m => m.Tab3PageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/community',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/community',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
