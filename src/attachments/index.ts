import AttachmentsComponent from './Attachments.vue';
import { FileListCard } from './FileList';

const Attachments = Object.assign(AttachmentsComponent, {
  FileCard: FileListCard,
});

export type { Attachment, AttachmentsProps } from './interface';

export default Attachments;

export {
  Attachments,
}
