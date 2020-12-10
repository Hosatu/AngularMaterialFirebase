import { Component } from '@angular/core';

@Component({
  selector: 'app-third-block',
  templateUrl: './third-block.component.html',
  styleUrls: ['./third-block.component.scss']
})
export class ThirdBlockComponent  {
  titleThree = 'Počítačová lingvistika';
  contentThree = 'Počítačová lingvistika je (mimo jiné) bakalářský a magisterský studijní program na Filozofické fakultě Masarykovy univerzity, kde je vyučován od roku 2010 (dříve pod názvem Český jazyk se specializací počítačová lingvistika). Jde tedy o poměrně mladý program, který má však nepochybně velký potenciál a rozhodně si zaslouží vaši pozornost.';

  titleFour = 'Ústav českého jazyka';
  contentFour = 'Ústav českého jazyka je pracoviště na Filozofické fakultě Masarykovy univerzity zajišťující výuku v rámci programu Počítačová lingvistika. Nabízí především lingvisticky orientované předměty, ale také řadu praktických předmětů včetně nejrůznějších projektů a exkurzí.';

  titleFive = 'Centrum zpracování přirozeného jazyka';
  contentFive = 'Centrum zpracování přirozeného jazyka je pracoviště na Fakultě informatiky Masarykovy univerzity a podílí se na výuce v rámci programu Počítačová ligvistika. Také zde vzniká mnoho zajímavých nástrojů.';
}
