import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ImageComments } from './image-comment.model';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  s3Url: string;

  @OneToMany(() => ImageComments, (imageComment) => imageComment.image, {
    cascade: true,
  })
  comments: ImageComments[];

  @Column({ default: null })
  key: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
