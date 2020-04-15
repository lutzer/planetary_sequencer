import { NoteContextMenuHandler } from "./components/notePlanets";
import { NoteTrigger, Note } from "./sound/note";

var globals : {
  onNoteContextMenu: NoteContextMenuHandler,
  lastEditedNote: NoteTrigger
} = {
  onNoteContextMenu : () => {},
  lastEditedNote : new NoteTrigger()
}

export default globals