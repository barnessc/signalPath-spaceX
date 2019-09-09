import { Component, OnInit, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatTableDataSource, MatPaginator, MatSort,} from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  //set display columns
  displayedColumns = ['flight_number', 'launch_year', 'rocket', 'details'];

  rowData = new MatTableDataSource<Launch>();

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private http: HttpClient, private _alert: MatSnackBar) {}

  //opens pop up alert aka snackbar
  openAlert() {
    this._alert.open('This launch does not have a press kit assigned to it.', 'Dismiss', {
      duration: 3000,
    });
  }

  ngOnInit() {
    this.http.get('https://api.spacexdata.com/v3/launches').subscribe(data => {
      this.rowData.data = data as Launch[];
    });
  }

  ngAfterViewInit(): void {
    this.rowData.sort = this.sort;
    this.rowData.paginator = this.paginator;
 }

  onRowClicked(row: any) {
    if(row && row.links && row.links.presskit){
      window.location = row.links.presskit;
    }
    else{
      //if the presskit doesn't exist then show the alert.
      this.openAlert();
    }
  }

}

export interface Launch {
  flight_number: number;
  launch_year: string;
  rocket: object;
  details: string;
  links: object;
}
