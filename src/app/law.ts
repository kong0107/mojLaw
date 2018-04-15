export interface Article {
    編章節?: string;
    條號?: string;
    條文內容?: string;
    structure?: any;
}

export interface LawContent {
    法規性質: string;
	法規名稱?: string;
    中文法規名稱?: string; //< for english
	法規網址: string;
	法規類別: string;
    異動日期?: string; //< for history
	最新異動日期?: string;
	是否英譯註記: string;
	英文法規名稱?: string;
    附件?: string[];
	沿革內容: string;
	前言?: string;
	法規內容: Article[];

    PCode?: string;
    updates?: string[];
    oldNames?: string[];
    english?: LawContent;
    history?: any;
    chapters?: any[];
}

export interface LawInfo {
    PCode: string;
    english?: string;
    name: string;
    lastUpdate: string;
    updates?: string[];
    oldNames?: string[];
    content?: LawContent;
}
