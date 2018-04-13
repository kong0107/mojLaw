import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { flatMap } from 'rxjs/operators';

import { LawInfo, LawContent } from './law';

@Injectable()
export class LawService {
  readonly assetsDir = (location.hostname == "localhost") 
    ? "./assets/mojLawSplitJSON/" 
    : "/mojLawSplitJSON/"
  ;
  
  lawList = [];
  laws: any = {};
    
  constructor(private http: HttpClient) { }
  
  get<T>(file): Observable<T> {
    return this.http.get<T>(this.assetsDir + file);
  }
  
  getAll(): Observable<LawInfo[]> {
    if(this.lawList.length) return of(this.lawList);
    
    const observable = this.get<LawInfo[]>("index.json");
    observable.subscribe(data => {
        data.forEach(law => this.laws[law["PCode"]] = law);
        this.lawList = data.sort((a, b) => (+b.lastUpdate) - (+a.lastUpdate));
    });
    return observable;
  }
  
  getLaw(PCode: string): Observable<LawContent> {
    return this.getAll().pipe(flatMap(lawList => {
      if(this.laws[PCode].content) return of(this.laws[PCode].content);
      const observable = this.get<LawContent>(`FalVMingLing/${PCode}.json`);
      observable.subscribe(data => this.laws[PCode].content = data);
      return observable;
    }));
  }

}
