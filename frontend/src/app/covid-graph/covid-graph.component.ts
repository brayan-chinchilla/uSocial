import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-covid-graph',
  templateUrl: './covid-graph.component.html',
  styleUrls: ['./covid-graph.component.css']
})
export class CovidGraphComponent implements OnInit {

  public dynHeight = 600;

  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Covid19' },
  ];

  public lineChartLabels: Label[] = [];

  public lineChartOptions: (ChartOptions) = {
    responsive: true,
    maintainAspectRatio: false,
  };

  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];

  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  constructor() { }

  ngOnInit(): void {
    const codivData: {
      fromDate: string;
      toDate: string;
      result: {
        "date": string,
        "confirmed": number,
        "deaths": number,
        "recovered": number
      }[];
    } = JSON.parse(localStorage.getItem('covidgraph'));

    if (codivData) {
      this.lineChartData = [
        { data: codivData.result.map(info => info.confirmed), label: 'Confirmados' },
        { data: codivData.result.map(info => info.recovered), label: 'Recuperados' },
        { data: codivData.result.map(info => info.deaths), label: 'Muertes' },
      ];

      this.lineChartLabels = codivData.result.map(info => info.date);
    }
  }

}
