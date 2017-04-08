import { Tab } from './../../models/tab.model';
import { CqrsBus } from './../../services/cqrs/cqrs-bus.service';
import { Observable } from 'rxjs/Rx';
import { TabsService } from './tabs.service';
import { Component, OnChanges, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { GetNotesQuery } from "app/services/cqrs/messages/get-notes.query";
import { EmptyGuid } from './../../common/guid.extension';

@Component({
    selector: 'tabs-list',
    template: `
  
        <ul class="nav nav-tabs little-margin-top">

            <li *ngIf="parentTab != null" 
                [class.active]="selectedTab == null" 
                (click)="SelectContentTab()">
                <a>_</a>
            </li>

            <li *ngIf="isLoading"> 
                <a>Loading...</a>
            </li>

            <li *ngFor="let tab of tabs"           
                class="editable-tab"    
                [class.active]="tab == selectedTab" 
                (click)="Select(tab)"
                (contextmenu)="Delete($event, tab)">   
                <a>  
                    <editable-value [class.active-tab]="tab == selectedTab" 
                                    [value]="tab.title"
                                    [placeholder]="'Title'"
                                    (onChange)="tab.title=$event; UpdateTab(tab)">
                    </editable-value>             
                </a>
            </li>

            <li>   
                <a>             
                    <editable-once [value]="'(+)'"
                                   [placeholder]="'New Tab Title'"
                                   (onComplete)="AddSibiling($event)">
                    </editable-once>             
                </a>
            </li>
 
        </ul>
        
        <tabs-list *ngIf="selectedTab != null" 
                    [parentTab]="selectedTab"
                    (onSelect)="onSelect.emit($event)">
        </tabs-list> 
        
    `,
    styleUrls: ['tabs-list.component.css']
})
export class TabsListComponent implements OnInit, OnChanges
{
    @Input() parentTab: Tab = null;
    @Output() onSelect: EventEmitter<Tab> = new EventEmitter<Tab>();

    private tabs: Tab[] = [];
    private selectedTab: Tab = null;
    private isLoading: boolean = false;

    constructor(private tabsService: TabsService, private _title: Title) { }


    ngOnChanges()
    {
        this.selectedTab = null;

        this.LoadTabs(this.parentTab);
    }

    ngOnInit()
    {
        if (this.parentTab == null) // Because ngOnChanges() comes first..
        {
            this.LoadTabs(this.parentTab);
        }
    }


    private SelectContentTab(): void
    {
        if (this.selectedTab != null)
        {
            this.onSelect.emit(this.parentTab);

            this.selectedTab = null;
        }
    }

    private Select(tab: Tab): void
    {console.log("AAAAAAAAAAAAAAA");
    
        if (this.selectedTab != tab)
        {
            console.log("BBBBBBBBBBBBBBBBBB");
            
            this.selectedTab = tab;

            this.onSelect.emit(this.selectedTab);

            this._title.setTitle(tab.title);
        }
    }

    private LoadTabs(parentTab: Tab): void
    {
        this.isLoading = true;
        this.tabs = [];

        let parentId = parentTab != null ? parentTab.id : EmptyGuid;

        this.tabsService.GetChildren(parentId)
            .finally(() =>
            {
                this.isLoading = false;
            })
            .subscribe((tabs: Tab[]) => 
            {
                this.tabs = tabs;

                // Auto open first tab in first line
                if (this.tabs[0] != null && this.tabs[0].parentId == EmptyGuid)
                    this.Select(this.tabs[0]);
            },
            (err) =>
            {
                alert("Can not get children! Error: " + err);
            });
    }

    private AddSibiling(title: string): void
    {
        if (title != "")
        {
            let parentId = this.parentTab != null ? this.parentTab.id : EmptyGuid;


            this.tabsService.AddSibling(parentId, title).subscribe((newTab) =>
            {
                this.tabs.push(newTab);

                this.Select(newTab);
            },
                (err) =>
                {
                    alert("Can not add new tab! Error: " + err);
                });
        }
    }



    private UpdateTab(tab: Tab): void
    {
        this.tabsService.Update(tab).subscribe(() => 
        {
            // nothing to do        
        },
            (err) =>
            {
                if (err == 401) alert("You have no permision to edit notes!");
                else
                    alert("Can not edit tab title! Error: " + err);
            });
    }

    private Delete($event: Event, tab: Tab)
    {
        $event.preventDefault();

        if (confirm("Delete?"))
        {
            this.tabsService.Delete(tab.id).subscribe(() =>
            {
                this.tabs.splice(this.tabs.indexOf(tab), 1);
              //  this.SelectContentTab();//?????????????????
            },
                (err) =>
                {
                    if (err == 401) alert("You have no permision to delete notes!");
                    else
                        alert("Can not delete tab! Error: " + err);
                });
        }
    }
}