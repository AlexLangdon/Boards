// TODO implement when list type note can be generated

    // it('Should have a note item element for each item stored', () => {
    //     const bag = fixture.debugElement.query(By.css('.item-bag'));
    //     const defaultItems = bag.queryAll(By.css('note-item'));
    //     expect(defaultItems.length).to.equal(component.newNote.content.length);
    // });

    // it('Should render another item element when an item is added to the component model', () => {
    //     const bag = fixture.debugElement.query(By.css('.item-bag'));
    //     component.newNote.addToContents(testStr);
    //     fixture.detectChanges();
    //     const newItems = bag.queryAll(By.css('note-item'));
    //     expect(newItems.length).to.equal(component.newNote.content.length);
    // });

    // it('Should add item to contents if it is non-empty and the done button is clicked', () => {
    //     const stringInput = fixture.debugElement.query(By.css('string-input'));
    //     stringInput.triggerEventHandler('entryAdded', testStr);
    //     const indexOfNoteItem = component.newNote.content.findIndex(noteItem =>
    //             noteItem.content === testStr);
    //     expect(indexOfNoteItem).to.be.above(-1);
    // });

    // it('Should clear all contents of the stored note when clicking the delete button', () => {
    //     const deleteButton = fixture.debugElement.query(By.css('.remove-button'));
    //     component.newNote.addToContents(testStr);
    //     expect(component.newNote.content).to.be.not.empty;
    //     deleteButton.triggerEventHandler('click', null);
    //     expect(component.newNote.content).to.be.empty;
    // });

    // it('Should emit the current model when the done button is clicked with an empty item', () => {
    //     const stringInput = fixture.debugElement.query(By.css('string-input'));
    //     let noteEmitted: NoteModel;
    //     component.noteAdded.subscribe((note: NoteModel) => noteEmitted = note);
    //     stringInput.triggerEventHandler('entryAdded', '');
    //     expect(noteEmitted).to.eql(component.newNote);
    // });