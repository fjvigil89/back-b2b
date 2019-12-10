interface IListPost {
  userName: string;
  likeId: number;
  commentId: number;
  content: string;
  date: string;
  id: number;
  userId: string;
  idUserLike: string;
  imageId: number;
  imagePath: string;
}

interface IImage {
  imageId: number;
  imagePath: string;
}

interface IListPostDetail {
  content: string;
  currentDate: Date | string;
  date: Date | string;
  id: number;
  totalComments: number;
  totalLikes: number;
  userId: string;
  userName: string;
  enableLike: boolean;
  images: IImage[];
}
