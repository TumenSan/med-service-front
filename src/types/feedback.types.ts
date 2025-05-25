// Типы для разработчика

export interface Feedback {
  id: number;
  rating: number;
  comment: string;
  image: string | null;
  errorRegion?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}