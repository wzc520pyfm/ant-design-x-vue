import type { App } from 'vue';
import FileCardComponent from './FileCard.vue';
import ListComponent from './List.vue';

export type { FileCardProps, FileCardListProps, SemanticType, PresetIcons } from './interface';

type FileCardType = typeof FileCardComponent & {
  List: typeof ListComponent;
};

const FileCard = FileCardComponent as FileCardType;
FileCard.List = ListComponent;

FileCard.install = function (app: App) {
  app.component(FileCard.name!, FileCard);
  app.component(ListComponent.name!, ListComponent);
  return app;
};

export default FileCard;
export { FileCard };
