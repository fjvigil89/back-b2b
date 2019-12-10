interface IListComment {
  userName: string;
  id: number;
  content: string;
  date: string;
  userId: string;
  contentReply: string;
  dateReply: string;
  replyId: number;
  replyUserName: string;
  replyUserId: number;
  likeCommentId: number;
  likeReplyId: number;
  idUserLike: string;
  idUserLikeReply: string;
  image: string;
  imageReply: string;
}

interface IListReplies {
  content: string;
  currentDate: string;
  date: string;
  id: number;
  userId: number;
  userName: string;
  totalLikes: number;
  enableLike: boolean;
  image: string;
}

interface IListCommentDetail {
  content: string;
  currentDate: Date | string;
  date: Date | string;
  id: number;
  totalReplies: number;
  userId: string;
  userName: string;
  totalLikes: number;
  replies: IListReplies[];
  enableLike: boolean;
  image: string;
}
