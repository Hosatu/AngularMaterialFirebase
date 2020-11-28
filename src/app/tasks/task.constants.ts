import { MultichoiceComponent } from './multichoice/multichoice.component';
import { SinglechoiceComponent } from './singlechoice/singlechoice.component';
import { MultifillComponent } from './multifill/multifill.component';
import { MatchingComponent } from './matching/matching.component';
import { CorpusComponent } from './corpus/corpus.component';
import { TreesComponent } from './trees/trees.component';
import { MajkaComponent } from './majka/majka.component';

export const Tasks = {
    'multichoice': MultichoiceComponent,
    'singlechoice': SinglechoiceComponent,
    'multifill': MultifillComponent,
    'matching': MatchingComponent,
    'corpus': CorpusComponent,
    'trees': TreesComponent,
    'majka': MajkaComponent
};
