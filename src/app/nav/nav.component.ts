import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import 'bootstrap';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, AfterViewInit {
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    $('#navbarToggleArea .nav-link').on('click', function () {
      $('#navbarToggleArea').collapse('hide');
    });
  }
}
