import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { AppRoutingModule } from './appRouting.module';
import { Dashboard } from '../dashboard/dashboard.component';
import { TextNoteCompact } from '../note/noteCompact/textNoteCompact/textNoteCompact.component';
import { NoteMaker } from '../noteMaker/noteMaker.component';
import { NoteService } from '../backend/note/note.service';
import { BoardService } from '../backend/board/board.service';
import { UserService } from '../backend/user/user.service';
import { FilterButton } from '../filterObjects/filterButton/filterButton.component';
import { FilterGroup } from '../filterObjects/filterGroup/filterGroup.component';
import { FilterEditScreen } from '../filterObjects/filterEditScreen/filterEditScreen.component';
import { DropdownSelect } from '../generic/dropdown/dropdownSelect/dropdownSelect.component';
import { DropdownAdd } from '../generic/dropdown/dropdownAdd/dropdownAdd.component';
import { TagList } from '../tagList/tagList.component';
import { FilterExpInput } from '../filterObjects/filterExpInput/filterExpInput.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColourPicker } from '../generic/colourPicker/colourPicker.component';

import { MdCheckboxModule,
        MdButtonModule,
        MdCardModule,
        MdInputModule,
        MdButtonToggleModule,
        MdIconModule,
        MdMenuModule,
        MdTabsModule,
        MdDialogModule,
        MdGridListModule } from '@angular/material';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    Dashboard,
    NoteMaker,
    TextNoteCompact,
    FilterButton,
    FilterGroup,
    FilterEditScreen,
    DropdownSelect,
    DropdownAdd,
    TagList,
    FilterExpInput,
    ColourPicker
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    DragulaModule,
    BrowserAnimationsModule,
    MdCheckboxModule,
    MdButtonModule,
    MdCardModule,
    MdInputModule,
    MdIconModule,
    MdButtonToggleModule,
    MdMenuModule,
    FlexLayoutModule,
    MdTabsModule,
    ReactiveFormsModule,
    MdDialogModule,
    MdGridListModule
  ],
  providers: [BoardService, NoteService, UserService],
  bootstrap: [AppComponent],
  entryComponents: [FilterEditScreen]
})
export class AppModule {}
