import { async, getTestBed, ComponentFixture, TestBed } from '@angular/core/testing';
import { TagList } from './tagList.component';
import { expect } from 'chai';
import { By } from '@angular/platform-browser';
import { DropdownAdd } from '../generic/dropdown/dropdownAdd/dropdownAdd.component';
import { MdIconModule, MdMenuModule } from '@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoteProp } from '../note/noteModels/noteProp.model';

describe('TagList', () => {
    let component: TagList;
    let fixture: ComponentFixture<TagList>;
    const allTags: NoteProp[] = [
        new NoteProp(0, 'tag0'),
        new NoteProp(1, 'tag1'),
        new NoteProp(2, 'tag2'),
        new NoteProp(3, 'tag3')
    ];
    const tagsAssigned: NoteProp[] = [
        allTags[0],
        allTags[3]
    ];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TagList, DropdownAdd],
            imports: [MdIconModule, MdMenuModule],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(TagList);
        component = fixture.componentInstance;
        component.assignedTags = tagsAssigned;
        component.allTags = allTags;
        fixture.detectChanges();
    }));

    afterEach(() => {
        getTestBed().resetTestingModule();
    });

    it('Should create', () => {
        expect(component).to.be.ok;
    });

    it('Should make a tag button for each tag that is active on the note', () => {
        const tagElems = fixture.debugElement.queryAll(By.css('.tag-wrap'));
        for (let i = 0; i < tagsAssigned.length; i++)  {
            const tagTitle = tagElems[i].query(By.css('.tag-text')).nativeElement.innerHTML;
            expect(tagTitle).to.equal(tagsAssigned[i].toUIString());
        }
    });

    it('Should store a list of available tags i.e. valid but inactive tags', () => {
        const expectedAvailable = allTags.filter((tag: NoteProp) => tagsAssigned.indexOf(tag) < 0);
        expect(component.availableTags).to.eql(expectedAvailable);
    });

    it(`Should remove tags from the list of assigned tags when the list of all-tags changes`, () => {
        // Remove index 0 and 1 tags
        const newAllTags = allTags.slice(2);
        component.allTags = newAllTags;
        fixture.detectChanges();

        // Assigned tags should exist in all-tags
        const expectedAssigned = tagsAssigned.filter((tag: NoteProp) => newAllTags.indexOf(tag) > -1);
        expect(component.assignedTags).to.eql(expectedAssigned);
    });

    it(`Should remove tags from the list of available when the list of all-tags changes`, () => {
        // Remove index 0 and 1 tags
        const newAllTags = allTags.slice(2);
        component.allTags = newAllTags;
        fixture.detectChanges();

        // Available tags are only those that are not assigned and exist in all-tags
        const expectedAvailable = newAllTags.filter((tag: NoteProp) => tagsAssigned.indexOf(tag) < 0);
        expect(component.availableTags).to.eql(expectedAvailable);
    });

    it('Should emit tag added event', () => {
        const newTag = allTags.find(tag => tagsAssigned.indexOf(tag) < 0);
        let tagEmitted: string;
        component.tagAdded.subscribe((tag: string) => tagEmitted = tag);
        component.addTag(newTag);
        expect(tagEmitted).to.equal(newTag);
    });

    it('Should emit a removed tag id', () => {
        const tagToRemoveIdx = 0;
        const tagToRemove = tagsAssigned[tagToRemoveIdx].id;
        let tagIdEmitted: number;
        const tagElem = fixture.debugElement.queryAll(By.css('.tag-wrap'))[tagToRemoveIdx];

        component.tagRemovedById.subscribe((tagId: number) => tagIdEmitted = tagId);
        tagElem.query(By.css('.remove-button')).triggerEventHandler('click', null);
        expect(tagIdEmitted).to.equal(tagToRemove);
    });
});
