import { async, getTestBed, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoteItem } from './noteItem.component';
import { NoteItemModel } from './noteItem.model';
import { By } from '@angular/platform-browser';
import { expect } from 'chai';
import { MdCheckboxModule } from '@angular/material';

describe('NoteItem', () => {
  let component: NoteItem;
  let fixture: ComponentFixture<NoteItem>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoteItem],
      imports: [MdCheckboxModule]
    });

    const testItem = new NoteItemModel({
        id: 0,
        index: 0,
        content: 'TEST',
        complete: false
    });
    const itemIndex = 0;

    fixture = TestBed.createComponent(NoteItem);
    component = fixture.componentInstance;
    component.item = testItem;
    component.index = itemIndex;
    fixture.detectChanges();
  }));

  afterEach(() => {
    getTestBed().resetTestingModule();
  });

  it('Should create', () => {
    expect(component).to.be.ok;
  });

  it('Should show the item contents in a label', () => {
    const label = fixture.debugElement.query(By.css('.item-contents'));
    const shownContents = label.nativeElement.innerHTML;
    expect(shownContents).to.equal(component.item.content);
  });

  it('Should toggle checked', () => {
    component.toggleChecked();
    expect(component.item.complete).to.be.true;
    component.toggleChecked();
    expect(component.item.complete).to.be.false;
  });

  it('Remove note should emit a remove event', () => {
    let idToRemove: number;
    component.remove.subscribe((id: number) => idToRemove = id);
    const removeButton = fixture.debugElement.query(By.css('.remove-button'));
    removeButton.triggerEventHandler('click', null);
    expect(idToRemove).to.equal(0);
  });

  it('Should emit an update event when changing the done checkbox', () => {
    let noteUpdated: NoteItemModel;
    component.update.subscribe((note: NoteItemModel) => noteUpdated = note);
    const checkBox = fixture.debugElement.query(By.css('.done-checkbox'));
    checkBox.triggerEventHandler('change', null);
    expect(noteUpdated).to.equal(component.item);
  });

  it('Should emit an update event when changing index', () => {
    let noteUpdated: NoteItemModel;
    component.update.subscribe((note: NoteItemModel) => noteUpdated = note);
    const currentItem = Object.assign({}, component.item);
    component.index++;
    currentItem.index++;
    expect(noteUpdated).to.deep.equal(currentItem);
  });
});
