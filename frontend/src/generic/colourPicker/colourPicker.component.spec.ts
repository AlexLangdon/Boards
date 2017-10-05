import { async, getTestBed, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColourPicker } from './colourPicker.component';
import { expect } from 'chai';
import { By } from '@angular/platform-browser';
import { MdIconModule, MdMenuModule, OverlayContainer } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ColourPicker', () => {
    let component: ColourPicker;
    let fixture: ComponentFixture<ColourPicker>;
    let overlayContainerElement: HTMLElement;
    const colours = ['ffffff', 'c0c0c0', 'abcdef'];
    const currentColour = colours[1];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColourPicker],
            imports: [MdIconModule, MdMenuModule, BrowserAnimationsModule],
            providers: [
                {provide: OverlayContainer, useFactory: () => {
                    overlayContainerElement = document.createElement('div');
                    overlayContainerElement.classList.add('cdk-overlay-container');
                    document.body.appendChild(overlayContainerElement);

                    // remove body padding to keep consistent cross-browser
                    document.body.style.padding = '0';
                    document.body.style.margin = '0';
                    return {getContainerElement: () => overlayContainerElement};
                  }},
            ]
        });

        fixture = TestBed.createComponent(ColourPicker);
        component = fixture.componentInstance;
        component.colours = colours;
        component.currentColour = currentColour;
        fixture.detectChanges();
    }));

    afterEach(() => {
        document.body.removeChild(overlayContainerElement);
        getTestBed().resetTestingModule();
    });

    it('Should create', () => {
        expect(component).to.be.ok;
    });

    it('Should show no dropdown initially', () => {
        expect(overlayContainerElement.firstChild).to.be.not.ok;
    });

    function openMenu() {
        const trigger = fixture.debugElement.query(By.css('.menu-trigger'));
        trigger.triggerEventHandler('click', null);
        fixture.detectChanges();
    }

    it('Should open the colour menu when clicking on the trigger button', () => {
        openMenu();
        expect(overlayContainerElement.firstChild).to.be.ok;
    });

    it('Should contain a button with a colour icon for each colour in the menu', () => {
        openMenu();
        const buttons = overlayContainerElement.querySelectorAll('.colour-button');
        for (let i = 0; i < buttons.length; i++) {
            const iconAttrib = buttons[i].querySelector('.colour-icon').attributes;
            const fillValue = iconAttrib.getNamedItem('fill').value;
            expect(fillValue.toString()).to.equal('#' + colours[i]);
        }
    });

    it('Should show the an icon on the currently chosen colour button', () => {
        openMenu();
        const buttons = overlayContainerElement.querySelectorAll('.colour-button');
        for (let i = 0; i < buttons.length; i++) {
            const selectedIcon = buttons[i].querySelectorAll('.selected-colour');
            expect(selectedIcon.length > 0).to.equal(colours[i] === currentColour);
        }
    });

    it('Should emit a clicked colour', () => {
        openMenu();
        let emittedColour;
        component.colourSelected.subscribe(emitted => emittedColour = emitted);
        const buttons = overlayContainerElement.querySelectorAll('.colour-button');
        const newSelectedIdx = 2;
        const mouseDown = new CustomEvent('mousedown');
        buttons[newSelectedIdx].dispatchEvent(mouseDown);
        expect(emittedColour).to.equal(colours[newSelectedIdx]);
    });
});
