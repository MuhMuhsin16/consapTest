import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./views/home/home.component";
import { NoPageFoundComponent } from "./views/no-page-found/no-page-found.component";
import { PokemonListComponent } from "./views/pokemon-list/pokemon-list.component";

const routes: Routes = [
    {path: '', redirectTo:'/home', pathMatch:'full'},
    {path: 'home', component: HomeComponent},
    {path: 'pokemon', component: PokemonListComponent},

    {path: '**', component: NoPageFoundComponent},
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
