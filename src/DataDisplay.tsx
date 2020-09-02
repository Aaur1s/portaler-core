import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Zone, Portal } from './types';
import CytoscapeComponent from 'react-cytoscapejs';
import { ElementDefinition, Core } from 'cytoscape';

interface DataDisplayProps {
  zones: Zone[];
  portals: Portal[];
  onNodeClick: (id: string) => void;
}


const portalSizeToColor = {
  2: "green",
  7: "blue",
  20: "orange"
}

const zoneColorToColor = {
  "black": "black",
  "red": "red",
  "yellow": "yellow",
  "blue": "blue",
  "road": "lightblue"
}

const DataDisplay: React.FC<DataDisplayProps> = ({ zones, portals, onNodeClick }) => {
  const [layout, setLayout] = useState("grid");

  const filteredZones = zones.filter(z => {
        return !!portals.find(p => p.source === z.name || p.target === z.name)
      });

  const [activeZone, setActiveZone] = useState<Zone | null>(null);

  const activateZoneForInfo = useCallback(
    (name: string) => {
      const zone = filteredZones.find((z) => z.name == name);
      if (zone) {
        setActiveZone(zone);
      }
    },
    [setActiveZone, filteredZones]
  );

  if (zones.length > 0) {
    const data: ElementDefinition[] = [
      ...filteredZones.map((z) => ({
        data: { id: z.name, label: z.name },
        style: {
          backgroundColor: zoneColorToColor[z.color],
        },
      })),
      ...portals.map((p) => ({
        data: { source: p.source, target: p.target, label: `${Math.floor(p.timeLeft / 60)}h ${Math.round(p.timeLeft % 60)}min` },
        classes: p.timeLeft < 30 ? 'timeLow': '',
        style: {
          lineColor: portalSizeToColor[p.size],
        },
      })),
    ];


    return (
      <>
        <CytoscapeComponent
          elements={data}
          cy={(cy) => {
            cy.on("tap", "node", (e) => {
              onNodeClick(e.target.id());
              activateZoneForInfo(e.target.id())
            });
          }}
          style={{ height: "720px", width: "100%" }}
          stylesheet={[
            {
              selector: "node[label]",
              style: {
                label: "data(label)",
              },
            },
            {
              selector: "edge[label]",
              style: {
                label: "data(label)",
                width: 3,
              },
            },
            {
              selector: ".timeLow",
              style: {
                color: "red",
              },
            },
          ]}
          layout={{ name: layout }}
        />
        <select onChange={(e) => setLayout(e.target.value)} value={layout}>
          <option>random</option>
          <option>grid</option>
          <option>circle</option>
          <option>cose</option>
          <option>concentric</option>
          <option>breadthfirst</option>
        </select>
        {activeZone && (
          <table>
            <tbody>
              <tr><td>Name</td><td>{activeZone.name}</td></tr>
              <tr><td>Type</td><td>{activeZone.type}</td></tr>
              <tr><td>Resources</td><td>{activeZone.resources && activeZone.resources.map(r => `T${r.tier} ${r.name}`).join(", ")}</td></tr>
              <tr><td>Map markers</td><td>{activeZone.markers && activeZone.markers.join(", ")}</td></tr>
            </tbody>
          </table>
        )}
      </>
    );
  }
  return <div>Dataset is currently empty, add some nodes to begin</div>;
};

export default DataDisplay;