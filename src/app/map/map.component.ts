import { Component, OnInit } from '@angular/core';

// import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
// import GeoJSON from 'ol/format/GeoJSON';
// import VectorLayer from 'ol/layer/Vector';
// import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style, Text } from 'ol/style';
import { Feature } from 'ol';
import MousePosition from 'ol/control/MousePosition';
import { createStringXY } from 'ol/coordinate';
import { defaults as defaultControls } from 'ol/control';
import 'ol/ol.css';

const center = [12.509623, 41.913351];
const INITIAL_ZOOM = 11.5
const centerMarcator = fromLonLat(center);

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  map: Map | null

  constructor() {
    this.map = null
  }

  ngOnInit(): void {
    this.createMap("map")
  }

  createMap(target: string) {

    console.log('Called OnInit in MapComponent class!');

    const mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: 'EPSG:4326',
      // comment the following two lines to have the mouse position
      // be placed within the map.
      // className: 'custom-mouse-position',
      // target: document.getElementById('mouse-position'),
    })

    const map = new Map({
      controls: defaultControls().extend([mousePositionControl]),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      // tslint:disable-next-line: object-literal-shorthand
      target: target,
      view: new View({
        projection: 'EPSG:3857',
        center: centerMarcator,
        zoom: INITIAL_ZOOM
      }),
    });


    this.map = map;


    map.on('pointermove', (evt) => {
      // console.log('Called pointermove!');
      if (evt.dragging) {
        return;
      }
      const pixel = map.getEventPixel(evt.originalEvent);
    });

    map.on('click', (evt) => {
      // console.log('Called click!');
      // selectFeatureFromPixel(evt.pixel);
    });

    // tslint:disable-next-line: variable-name
    map.once('postrender', (_event) => {
      console.log('Map loaded');
    });

    let currZoom: number | undefined = undefined;
    map.on('moveend', function (e) {
      var newZoom = map.getView().getZoom();
      if (currZoom != newZoom) {
        console.log('zoom end, new zoom: ' + newZoom);
        currZoom = newZoom;
      }
    });


    return map;
  }

}
