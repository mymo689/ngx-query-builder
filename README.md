# NgxQueryBuilder

## Overview

The NgxQueryBuilder `(ngx-qb)` is an importable Angular 13 component designed to quickly and easily create a cascading filter for queries or other rule sets. It was modeled after the [jQuery QueryBuilder](https://querybuilder.js.org/) to be a more Angular focused and purpose-built solution.

## Sample Usage

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxQueryBuilderModule } from 'ngx-query-builder';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxQueryBuilderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

You can pass into the `<ngx-qb>` element an initializing filter, but you must at least pass in a dataFieldList to provide the query builder with dataField options. This is the fully custom list that allows you to specify what fields you will be working with. Without providing your own list, the QueryBuilder component ***will not work***.

The dataFieldList is the list of all the dataField dropdown options that you want the user to select from in the first dropdown box. The properties of `text` and `fieldName` are freeform string options, they can be anything that you'd like. Keep in mind that `text` is what the user will see, and `fieldName` is ideally the database column name being referenced, it can however be used however you'd like.

The only restricted field is `type`, it must be one of the types listed in the `IDataField` interface: array | string | number | date | boolean | json. Depending on the type, that will determine what fields are displayed for the condition field. Ex: If you use a type of date or number, you can expect such conditions as greater than, less than, between, or not between.

Depending on the condition specified, you can also get up to 2 value boxes. The second box is reserved for conditions requiring 2 values, such as between or not between A and B.

### Note

The conditions are currently hardcoded but I plan to make

```ts
import { Component } from '@angular/core';
import { Filter, IDataField } from 'ngx-query-builder';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // This is the initial filter passed to the component, recommend saving to and filling from local storage as a default for increased functionality.
  filter: Partial<Filter> = {
    filterLevel: 1,
    id: 1,
    isGroupTF: true,
    clause: 'AND',
    value: null,
    value2: null,
    filters: []
  };
  dataFieldList: IDataField[] = [
    {
      text: 'Author',
      type: 'string',
      fieldName: 'author'
    },
    {
      text: 'Title',
      type: 'string',
      fieldName: 'title'
    },
    {
      text: 'Date Published',
      type: 'date',
      fieldName: 'publishedDT'
    },
    {
      text: 'Copies Sold',
      type: 'number',
      fieldName: 'copiesSold'
    }
  ]

  public filterChanged(event: any): void {
    console.log('FC', event);
  }

  public filterReset(event: any): void {
    console.log('FR', event);
  }

  public queryExecuted(event: any): void {
    console.log('QE', event);
  }
}
```

```html
<ngx-qb
  [filter]="filter"
  [dataFieldList]="dataFieldList"
  (filterChanged)="filterChanged($event)"
  (filterReset)="filterReset($event)"
  (queryExecuted)="queryExecuted($event)">
</ngx-qb>
```

## Angular Conditionals

| ngx-qb  | Angular   |
| ------- | --------- |
| 1.0.0   | >= 13.x   |

## Non-included Dependencies

1. Bootstrap: Bootstrap is heavily relied upon for nearly the entire HTML portion, please ensure that the CSS file `bootstrap.min.css` from at least version 5 of `bootstrap` is included. This was intentionally not included in the package in order to make the package much smaller.
2. BrowserAnimationsModule: Must include at AppModule level.

## Common Issues

1. Not including BrowserAnimationsModule in your module. Make sure that your AppModule, or containing module at least, has the BrowserAnimationsModule imported.

## Planned Upgrades

- [ ] Create a working demo to be hosted online and linked to within the README file.
- [ ] Provide more detailed instructions for how to install, import, and use the module.
- [ ] Allow for customized condition fields, either adding to the existing list or replacing entirely.
- [ ] Allow for adding to the IDataField type options for customized options.
- [ ] In accordance with the IDataField types above, allow for custom HTML to be injected for custom type options.
- [ ] Allow for custom coloring on all buttons.
- [ ] Add unit testing.
- [ ] Add to the FAQ if/when it becomes necessary.

## Potential Upgrades

- [ ] Remove bootstrap dependency (would be nice but would require an entire overhaul and/or a LOT of custom CSS)

## FAQ

This is a brand new component as of 6 April 2022, no FAQs yet!

## License

**MIT License** - All parties who obtain a copy of the software and associated files are granted the right to use, copy, modify, merge, distribute, publish, sublicense, and sell copies of the software.

## Acknowledgements

My thanks go out to the owner(s) of the [jQuery QueryBuilder](https://querybuilder.js.org/) for having their creation listed under an MIT License. Even though I have never actually dove into their code, the look, feel, and functionality of their examples all heavily inspired my own design choices for the NgxQB.
