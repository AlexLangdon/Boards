import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DropdownAdd } from '../generic/dropdown/dropdownAdd/dropdownAdd.component';
import { NoteProp } from '../note/noteModels/noteProp.model';

// Manages a list of tags assigned to a note

@Component({
    selector: 'tag-list',
    templateUrl: './tagList.component.html',
    styleUrls: ['./tagList.component.css']
})
export class TagList {
    private _availableTags: NoteProp[] = [];
    private _assignedTags: NoteProp[] = [];
    private _allTags: NoteProp[] = [];

    @Input()
        // Only tags that are unassigned to the current note are available
        set assignedTags(tagsAssigned: NoteProp[]) {
            this._assignedTags = tagsAssigned;
            this._availableTags = this._allTags.filter(tag =>
                !this._assignedTags.some(t => t.id === tag.id));
        }

        get assignedTags() {
            return this._assignedTags;
        }

    @Input()
        // Only tags that are unassigned to the current note are available
        set allTags(allTags: NoteProp[]) {
            this._allTags = allTags;
            // Remove assigned tags that are no longer in allTags
            this._assignedTags = this._assignedTags.filter(tag => allTags.some(t => t.id === tag.id));
            // Take the remainder of the tags as available
            this._availableTags = allTags.filter(tag =>
                !this._assignedTags.some(t => t.id === tag.id));
        }

    @Output()
        tagAdded: EventEmitter<NoteProp> = new EventEmitter<NoteProp>();

    @Output()
        tagRemovedById: EventEmitter<number> = new EventEmitter<number>();

    addTag(tag: NoteProp) {
        this.tagAdded.emit(tag);
    }

    removeTagById(tagId: number) {
        this.tagRemovedById.emit(tagId);
    }

    get availableTags() {
        return this._availableTags;
    }
}
