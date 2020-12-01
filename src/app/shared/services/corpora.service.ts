import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HasSubscriptions } from '@shared/utilities';
import * as _ from 'lodash';

export interface CorporaItem {
  position: number;
  tag: string;
  lemma: string;
  word: string;
}
@Injectable()
export class CorporaService extends HasSubscriptions {

  public isLoading: boolean = true;
  private corpora: CorporaItem[] = [];

  constructor(private files: HttpClient) {
    super();
    this.safeSubscribe<CorporaItem[]>(
      this.files.get<CorporaItem[]>('/assets/data/corpora.json'),
      (fileContent) => {
        this.isLoading = false;
        this.corpora = fileContent;
      }
    );
  }

  find(word = /.*/, tag = /.*/, lemma = /.*/) {
    return _.map(
      _.filter(
        this.corpora,
        (item: CorporaItem, index: number) => {
          return item.word.match(word) && item.tag.match(tag) && item.lemma.match(lemma);
        }
      ),
      (item) => item.position
    );
  }

  getSize(): number {
    return this.corpora.length;
  }

  get(index: number): CorporaItem {
    if(index >= 0 && index < this.getSize()) {
      return this.corpora[index];
    }
    return null;
  }


}
