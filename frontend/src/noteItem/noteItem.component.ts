import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { NoteItemModel } from './noteItem.model';

// Stores a single todo item in a list type note

@Component({
    selector: 'note-item',
    templateUrl: 'noteItem.component.html',
    styleUrls: ['noteItem.component.css']
})
export class NoteItem {

    private _index: number;

    @Input()
        item: NoteItemModel;

    @Input()
        set index(i: number) {
            // If statement avoids calling update if the _index has not been set yet by the OnInit yet
            if (this._index == null) { return; }
            this._index = i;
            this.item.index = i;
            this.update.emit(this.item);
        }

        get index(): number{
            return this._index;
        }

    @Output()
       remove = new EventEmitter<number>();

    @Output()
       update = new EventEmitter<NoteItemModel>();

    ngOnInit() {
        this._index = this.item.index;
    }

    removeItem() {
        this.remove.emit(this.item.id);
    }

    toggleChecked() {
        this.item.complete = !this.item.complete;
        this.update.emit(this.item);
    }
}
