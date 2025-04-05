declare module 'google-play-scraper' {
  export interface IAppItem {
    appId: string;
    title: string;
    summary: string;
    developer: string;
    developerId: string;
    icon: string;
    score: number;
    url: string;
    ratings?: number;
    reviews?: number;
    version?: string;
    released?: string;
    updated?: string;
    [key: string]: any;
  }

  export interface IReviewsResult {
    data: IReview[];
    nextPaginationToken?: string;
  }

  export interface IReview {
    id: string;
    userName: string;
    userImage: string;
    date: string;
    score: number;
    text: string;
    version?: string;
    thumbsUp?: number;
    replyDate?: string;
    replyText?: string;
    [key: string]: any;
  }

  export const sort: {
    NEWEST: number;
    RATING: number;
    HELPFULNESS: number;
  };

  export function search(options: {
    term: string;
    num?: number;
    lang?: string;
    country?: string;
    fullDetail?: boolean;
    price?: string;
  }): Promise<IAppItem[]>;

  export function reviews(options: {
    appId: string;
    lang?: string;
    country?: string;
    sort?: number;
    num?: number;
    paginate?: boolean;
    nextPaginationToken?: string;
  }): Promise<IReviewsResult>;
}

declare module 'app-store-scraper' {
  export interface IAppItem {
    id: number | string;
    appId: string;
    title: string;
    description?: string;
    developer?: string;
    developerId?: string;
    icon: string;
    score: number;
    url: string;
    ratings?: number;
    reviews?: number;
    version?: string;
    released?: string;
    updated?: string;
    [key: string]: any;
  }

  export interface IReview {
    id: string;
    userName: string;
    date: string;
    score: number;
    title: string;
    text: string;
    url: string;
    version: string;
    [key: string]: any;
  }

  export const sort: {
    RECENT: number;
    HELPFUL: number;
  };

  export function search(options: {
    term: string;
    num?: number;
    lang?: string;
    country?: string;
    price?: string;
  }): Promise<IAppItem[]>;

  export function reviews(options: {
    id: string | number;
    lang?: string;
    country?: string;
    sort?: number;
    page?: number;
    num?: number;
  }): Promise<IReview[]>;
} 