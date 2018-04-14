import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, flatMap } from 'rxjs/operators';

import { LawInfo, LawContent } from './law';

@Injectable()
export class LawService {
  readonly assetsDir = (location.hostname == "localhost")
    ? "./assets/mojLawSplitJSON/"
    : "/mojLawSplitJSON/"
  ;

  lawList = [];
  laws: any = {};
  observables: any = {};

  constructor(private http: HttpClient) { }

  get<T>(file): Observable<T> {
    return this.http.get<T>(this.assetsDir + file);
  }

  getAll(): Observable<LawInfo[]> {
    if(!this.observables.all) {
      this.observables.all = this.get<LawInfo[]>("index.json").pipe(
        map(lawList => {
          window["laws"] = this.laws;
          console.log("Getting index.json");
          lawList.forEach(law => {
            this.laws[law["PCode"]] = law;
            if(law.updates) law.updates.reverse();
          });
          return this.lawList = lawList.sort((a, b) => (+b.lastUpdate) - (+a.lastUpdate));
        })
      );
    }
    return this.observables.all;
  }

  getLaw(PCode: string): Observable<LawContent> {
    if(!this.observables[PCode]) {
      this.observables[PCode] = this.getAll().pipe(
        flatMap((lawList: LawInfo[]) => {
          return this.get<LawContent>(`FalVMingLing/${PCode}.json`).pipe(
            map(lawContent => {
              console.log(`Getting ${PCode}`);
              lawContent.PCode = PCode;
              this.laws[PCode].content = lawContent;
              if(this.laws[PCode].updates) lawContent.updates = this.laws[PCode].updates;
              if(this.laws[PCode].oldNames) lawContent.oldNames = this.laws[PCode].oldNames;

              lawContent.history = {};
              lawContent.history[lawContent["最新異動日期"]]
              = lawContent.history.newest
              = lawContent;

              return lawContent;
            })
          );
        }),
        flatMap((lawContent: LawContent) => {
          if(lawContent["是否英譯註記"] == "N") return of(lawContent);
          return this.get<LawContent>(`Eng_FalVMingLing/${PCode}.json`).pipe(
            map(engContent => {
              console.log(`Getting english version of ${PCode}`);
              lawContent.english = engContent;
              return lawContent;
            })
          );
        })
      );
    }
    return this.observables[PCode];
  }

  loadLawHistory(
    PCode: string,
    date: string
  ): Observable<LawContent> {
    return this.getLaw(PCode).pipe(
      flatMap((lawContent: LawContent) => {
        return this.get<LawContent>(`HisMingLing/${PCode}/${date}_001.json`).pipe(
          map(oldVersion => {
            console.log(`Getting old version of ${PCode} on date ${date}`);
            lawContent.history[date] = oldVersion;
            return lawContent;
          })
        );
      })
    );
  }
}
