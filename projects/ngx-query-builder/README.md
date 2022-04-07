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

```ts
import { Component } from '@angular/core';
import { Filter, IDataField } from 'ngx-query-builder';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
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

  public filterReset(): void {
    console.log('FR');
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

## Inputs

| Name              | Type                         | Default                   | Req.     | Description                                        |
| ----------------- | ---------------------------- | ------------------------- | -------- | -------------------------------------------------- |
| filter            | input - Partial\<Filter>     | Filter.NewTopLevelFilter  | False    | This is the initial filter passed to the component, if the default is not preferred |
| dataFieldList     | input - IDataField[]         | **none**                  | **True** | Required input for what data fields the query builder should provide the user as options in the first dropdown selector |
| resetOnUpdate     | input - boolean              | false                     | False    | Determines whether resetting a field also resets the properties after that field (dataField => condition => value & value2) |
| maxFilterDepth    | input - number               | 10                        | False    | Maximum amount of children filters allowed before preventing another layer from being created |
| filterChanged     | output - Filter              | N/A                       | N/A      | EventEmitter that returns the new value of the filter (Filter) every time a change occurs |
| filterReset       | output - void                | N/A                       | N/A      | EventEmitter that returns the                      |
| queryExecuted     | output - IElasticFilterGroup | N/A                       | N/A      | Show close button                                  |

You can pass into the `<ngx-qb>` element an initializing filter, but you must at least pass in a dataFieldList to provide the query builder with dataField options. This is the fully custom list that allows you to specify what fields you will be working with. Without providing your own list, the QueryBuilder component ***will not do anything***. It will still work, it just...well, will have no fields to choose from.

The dataFieldList is the list of all the dataField dropdown options that you want the user to select from in the first dropdown box. The properties of `text` and `fieldName` are freeform string options, they can be anything that you'd like. Keep in mind that `text` is what the user will see, and `fieldName` is ideally the database column name being referenced, it can however be used however you'd like.

The only restricted field is `type`, it must be one of the types listed in the `IDataField` interface: array | string | number | date | boolean | json. Depending on the type, that will determine what fields are displayed for the condition field. Ex: If you use a type of date or number, you can expect such conditions as greater than, less than, between, or not between.

Depending on the condition specified, you can also get up to 2 value boxes. The second box is reserved for conditions requiring 2 values, such as between or not between A and B.

## Custom Models

### Filter

```ts
class Filter {
  public static get NewTopLevelFilter(): Partial<Filter> {
    return new Filter({
      filterLevel: 1,
      id: 1,
      isGroupTF: true,
      clause: 'AND',
      value: null,
      value2: null,
      filters: []
    });
  }

  filterLevel: number; // Ensures the depth doesn't exceed 10 (inception limit exceeded); Top level **MUST** start at 1
  id: number; // Used to sort filters according to creation date => id = Date.now()
  isGroupTF: boolean; // Determines whether the current filter is a rule or rule set (AND/OR)
  clause: 'NA' | 'AND' | 'OR'; // (isGroupTF == true) Controls the AND/OR selector for the UI side ('NA' used for testing, should not be used in actual practice)
  dataField?: IDataField; // (!isGroupTF) This is the current filter's dataField value
  condition?: Condition; // (!isGroupTF) This is the current filter's condition value
  value: any; // (!isGroupTF) This is the current filter's value
  value2: any; // (!isGroupTF) This is the current filter's value2
  subFilters: Partial<Filter>[]; // (isGroupTF == true) The subFilters array contains all 
  boost: number; // Elastic specific property for boosting a specific filter's priority (1-10, defaulted at 5)
  slop: number; // Elastic specific property for allowing looser filtering based on the conditional property (0-10, defaulted at 1)
}
```

### IDataField

```ts
interface IDataField {
  text: string; // The text that the users will see in the data field dropdown
  type: 'array' | 'string' | 'number' | 'date' | 'boolean' | 'json'; // Determines the available conditions for the data field
  fieldName: string; // Column name reference field for the database
}
```

### Condition

```ts
class Condition {
  text: string; // The text that the users will see in the conditional dropdown
  shortCode: string; // Short codes for referencing within the API/DB (rather than use "Less than or equal", we use "lte", etc.)
  usedFor: string[]; // Determines what dataField types that can use this condition (don't need "Less than or equal" for a boolean dataField)
  usesValue2?: boolean; // Tells the UI whether to display the 2nd value box or not, useful for using "Between" or "Not Between" comparators
  staticValue?: any; // If there is a static value that needs to be used, such as for the condition "empty/null" or "not empty/null", you don't actually need a value, but you need the value field to be filled with something (true/false/'')
}
```

### IElasticFilter

```ts
export interface IElasticFilter {
  dataField?: string;
  dataFields?: string[];
  condition?: string;
  value?: string;
  value2?: string;
  boost?: number;
  slop?: number;
  multiField?: string;
}

export interface IElasticFilterGroup extends IElasticFilter {
  filters: IElasticFilter[];
  clause: ElasticFilterClause;
}

export enum ElasticFilterClause {
  NA = 0,
  AND = 1,
  OR = 2
}
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
   - Note: this is specifically for using the built-in MatInput and MatButton elements. Your custom elements may or may not need this additional dependency.

## Upgrades

### Actively Planned Upgrades

- [ ] Create an emitter for the maxFilterDepth exceeded event.
- [ ] Provide more detailed instructions for how to install, import, and use the module.
- [ ] Create a working demo to be hosted online and linked to within the README file. (Stackblitz or otherwise)
- [ ] Allow for customized condition fields, either adding to the existing list or replacing entirely.
- [ ] Allow for adding to the IDataField type options for customized options. (More than just string, number, boolean, etc)
- [ ] In accordance with the IDataField types above, allow for custom HTML to be injected for custom type options.
- [ ] Allow for custom buttons to be passed into the component via [content projection](https://angular.io/guide/content-projection).
- [ ] Allow for other custom elements to be passed in via [content projection](https://angular.io/guide/content-projection).
- [ ] Add to the FAQ if/when it becomes necessary.

### Potential Upgrades

- [ ] \(Optional) Remove bootstrap dependency (would be nice but would require an entire overhaul and/or a LOT of custom CSS)
- [ ] \(Optional) Add unit testing. (This will be the very last thing I do, if I ever even do it, as the NgxQB isn't a very large component and unit testing isn't really necessary at this time.)

### Things I Will NOT Be Adding

| | |
|-|-|
| :no_entry: | More cowbell :cow::bell: |

---

## FAQ

This is a brand new component as of 6 April 2022, no FAQs yet!

---

## License

**MIT License** - All parties who obtain a copy of the software and associated files are granted the right to use, copy, modify, merge, distribute, publish, sublicense, and sell copies of the software.

---

## Acknowledgements

### General Acknowledgements

My thanks go out to the owner(s) of the [jQuery QueryBuilder](https://querybuilder.js.org/) for having their creation listed under an MIT License. Even though I have never actually dove into their code, the look, feel, and functionality of their examples all heavily inspired my own design choices for the NgxQB.

### Individual Thanks

- Definitely thanks to [Zach](https://github.com/zachappel) for inspiring me to build the component in the first place. He built the original consuming API and provided functional testing to ensure the component works as intended.

- Thanks also to [Jay](https://github.com/daBishMan) for inspiring me to actually pull out the component from the project that I had originally built it in and create a standalone importable library from it. As my first published NPM library, I definitely had to step out of my comfort zone to learn and do everything required for this but it was a great process to learn.
