import { useState, useEffect, useRef } from "react";
import { RESULT_ENDPOINT, Header } from "./Common";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./reset.css";
import "./main.css";

function ShowComponent() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map>();
  const [name, setName] = useState<string>();

  const download = () => {
    const query = new URLSearchParams(location.search);
    const uuid = query.get("uuid");
    window.location.href = `${RESULT_ENDPOINT}/${uuid}.osm.pbf`;
  };

  useEffect(() => {
    const map = new maplibregl.Map({
      style: "https://americanamap.org/style.json",
      container: mapContainerRef.current!
    });
    mapRef.current = map;
  });

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const uuid = query.get("uuid");
    fetch(`${RESULT_ENDPOINT}/${uuid}_task.json`)
      .then((x) => x.json())
      .then((j) => {
        setName(j.Name);
        if (j.SanitizedRegionType === "geojson") {
          const geojson = j.SanitizedRegionData;
          const poly_coords = geojson.coordinates[0]
            .slice(0, -1)
            .map((x:[number, number]) => [x[1], x[0]]);
          console.log(geojson);
          console.log(poly_coords);
        } else if (j.SanitizedRegionType === "bbox") {
          const split = j.SanitizedRegionData;
          console.log(split);
        }
      });

    return () => {
    };
  }, []);

  return (
    <div className="main">
      <Header/>
      <div className="content">
        <div className="sidebar">
          { name }
          <button onClick={download}>Download</button>
        </div>
        <div className="mapContainer">
          <div
            ref={mapContainerRef}
            className="map"
          ></div>
        </div>
      </div>
    </div>
  );
}

export default ShowComponent;
