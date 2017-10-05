import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { NoteItemModel } from '../../../noteItem/noteItem.model';
import { ListNoteModel } from '../../noteModels/listNote.model';
import { StringInput } from '../../../generic/stringInput/stringInput.component';
import { DropdownSelect } from '../../../generic/dropdown/dropdownSelect/dropdownSelect.component';
import { TagList } from '../../../tagList/tagList.component';
import { AbstractNoteCompact } from '../abstractNoteCompact.component';

// Component for showing a list model note - under development

// @Component({
//     selector: 'list-note',
//     templateUrl: './listNoteCompact.component.html',
//     styleUrls: ['./listNoteCompact.component.css'],
//     viewProviders: [DragulaService]
// })
// export class ListNoteCompact extends AbstractNoteCompact {

//     @Input()
//         noteModel: ListNoteModel;

//     // Should emit whenever the note is changed
//     @Output()
//         updateNote = new EventEmitter<ListNoteModel>();

//     constructor(private _dragulaService: DragulaService) {
//         super();
//         // Set the dragula service to only respond to drags on "draggable" class html
//         _dragulaService.setOptions('note-item-bag', {
//             revertOnSpill: true,
//             moves: function(el, container, target) {
//                 if (target.classList) {
//                     return target.classList.contains('note-item-draggable');
//                 }
//                 return false;
//             }
//         });
//     }

//     addItem(item: string) {
//         this.noteModel.addToContents(item);
//         this.updateNote.emit(this.noteModel);
//     }

//     updateItem(item: NoteItemModel) {
//         this.noteModel.updateItem(item);
//         this.updateNote.emit(this.noteModel);
//     }

//     removeItem(id: number) {
//         this.noteModel.removeItemById(id);
//         this.updateNote.emit(this.noteModel);
//     }

//     // Used for orderring the items by index for Dragula
//     itemTracker(index: number, item: NoteItemModel) {
//         return item ? item.index : undefined;
//     }
// }
