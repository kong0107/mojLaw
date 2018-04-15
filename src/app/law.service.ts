import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, ReplaySubject } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { tap, map, flatMap } from 'rxjs/operators';

import { LawInfo, LawContent } from './law';

@Injectable()
export class LawService {
  readonly assetsDir = (location.hostname == "localhost")
    ? "./assets/mojLawSplitJSON/"
    : "/mojLawSplitJSON/"
  ;

  lawList = [];
  laws: any = {};
  subjects: any = {};

  constructor(private http: HttpClient) {
    window["laws"] = this.laws;
  }

  get<T>(file): Observable<T> {
    return this.http.get<T>(this.assetsDir + file);
  }

  getAll(): Observable<LawInfo[]> {
    if(!this.subjects.all) {
      this.subjects.all = new ReplaySubject(1);
      const observable = this.get<LawInfo[]>("index.json").pipe(
        map(lawList => {
          console.log("Loading index.json");
          lawList.forEach(law => {
            this.laws[law["PCode"]] = law;
            if(law.updates) law.updates.reverse();
          });
          return this.lawList = lawList.sort((a, b) => (+b.lastUpdate) - (+a.lastUpdate));
        })
      );
      observable.subscribe(this.subjects.all);
    }
    return this.subjects.all;
  }

  getLaw(PCode: string): Observable<LawContent> {
    if(!this.subjects[PCode]) {
      this.subjects[PCode] = new ReplaySubject(1);
      const observable = this.getAll().pipe(
        flatMap((lawList: LawInfo[]) => {
          return this.get<LawContent>(`FalVMingLing/${PCode}.json`).pipe(
            map(lawContent => {
              console.log(`Loading ${PCode}`);
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
              console.log(`Loading ${PCode}/eng`);
              lawContent.english = engContent;
              return lawContent;
            })
          );
        })
      );
      observable.subscribe(this.subjects[PCode]);
    }
    return this.subjects[PCode];
  }

  loadLawHistory(
    PCode: string,
    date: string
  ): Observable<LawContent> {
    if(!date) return this.getLaw(PCode);
    const sub_id = `${PCode}_${date}`;
    if(!this.subjects[sub_id]) {
      this.subjects[sub_id] = new ReplaySubject(1);
      const observable = this.getLaw(PCode).pipe(
        flatMap((lawContent: LawContent) => {
          if(date == lawContent["最新異動日期"]) return of(lawContent);
          return this.get<LawContent>(`HisMingLing/${PCode}/${date}_001.json`).pipe(
            map(oldVersion => {
              console.log(`Loading ${PCode}/${date}`);
              lawContent.history[date] = oldVersion;
              return lawContent;
            })
          );
        })
      );
      observable.subscribe(this.subjects[sub_id]);
    }
    return this.subjects[sub_id];
  }
}
