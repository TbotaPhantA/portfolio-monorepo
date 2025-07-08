import { PostStatusEnum } from '../../enums/postStatus.enum';
import { PostTypeEnum } from '../../enums/postType.enum';
import { LanguageEnum } from '../../enums/language.enum';
import { CreateCommentDto } from './createComment.dto';

export class CreatePostDto {
  status: PostStatusEnum;
  type: PostTypeEnum;
  language: LanguageEnum;
  title: string;
  body: string;
  tags: string[];
  comments: CreateCommentDto[];
}
