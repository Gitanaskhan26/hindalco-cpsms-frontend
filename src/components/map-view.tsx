'use client';

import 'leaflet/dist/leaflet.css';
import * as React from 'react';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Permit, RiskLevel, Visitor } from '@/lib/types';
import { Badge } from './ui/badge';
import { CardHeader, CardContent, CardTitle, CardDescription } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';


// --- Helper Functions and Constants ---

const riskColorMap: Record<RiskLevel, string> = {
  high: '#EF4444', // red-500
  medium: '#F97316', // orange-500
  low: '#22C55E', // green-500
};

// Use an SVG-based map pin icon for permits.
const createPermitIcon = (riskLevel: RiskLevel, isSelected: boolean) => {
  const color = riskColorMap[riskLevel];
  const scale = isSelected ? 1.5 : 1;

  const svgIcon = `
    <div class="transition-transform duration-100 ease-out" style="transform: scale(${scale}); transform-origin: bottom;">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="28" 
        height="28" 
        viewBox="0 0 24 24" 
        fill="${color}" 
        stroke="white" 
        stroke-width="1.5" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        style="filter: drop-shadow(0 2px 3px rgba(0,0,0,0.4));"
      >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3" fill="white"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'leaflet-custom-div-icon',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
};

const createPermitPopupContent = (permit: Permit) => {
  return renderToStaticMarkup(
    <div className="w-64 p-0 m-0 font-sans">
      <CardHeader className="p-2">
        <Badge
          variant="outline"
          className={`w-fit capitalize border-2 ${
            permit.riskLevel === 'high'
              ? 'border-red-500 text-red-500'
              : permit.riskLevel === 'medium'
              ? 'border-orange-500 text-orange-500'
              : 'border-green-500 text-green-500'
          }`}
        >
          {permit.riskLevel} Risk
        </Badge>
        <CardTitle className="text-base pt-1">
          Permit #{permit.id.slice(0, 4)}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {permit.description}
        </p>
      </CardContent>
    </div>
  );
};

// Use a glowing dot for visitors.
const createVisitorIcon = (isSelected: boolean) => {
    const scale = isSelected ? 1.5 : 1;
    const dotHtml = `
      <div class="transition-transform duration-100 ease-out" style="transform: scale(${scale});">
        <div class="visitor-marker-dot"></div>
      </div>
    `;
    return L.divIcon({
        html: dotHtml,
        className: 'leaflet-custom-div-icon',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -8],
    });
};

const createVisitorPopupContent = (visitor: Visitor) => {
    const userInitials = visitor.name.split(' ').map(n => n[0]).join('');
    return renderToStaticMarkup(
      <div className="w-64 p-2 m-0 font-sans flex items-center gap-3">
        <Avatar className="h-12 w-12">
            <AvatarImage src={visitor.avatarUrl} alt={visitor.name} />
            <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
        <div>
            <p className="font-bold text-base">{visitor.name}</p>
            <p className="text-sm text-muted-foreground">Visitor ID: {visitor.id}</p>
        </div>
      </div>
    );
};


// --- Map View Component ---

interface MapViewProps {
  permits: Permit[];
  selectedPermit: Permit | null;
  onMarkerClick: (permit: Permit | null) => void;
  visitors?: Visitor[];
  selectedVisitor?: Visitor | null;
  onVisitorMarkerClick?: (visitor: Visitor | null) => void;
}

const defaultPosition: L.LatLngTuple = [24.2045, 83.0396];

export default function MapView({ 
    permits, selectedPermit, onMarkerClick,
    visitors = [], selectedVisitor, onVisitorMarkerClick 
}: MapViewProps) {
    const mapContainerRef = React.useRef<HTMLDivElement>(null);
    const mapInstanceRef = React.useRef<L.Map | null>(null);
    const markersRef = React.useRef<Record<string, L.Marker>>({});
    const prevSelectedIdRef = React.useRef<string | null>(null);

    // Initialize map
    React.useEffect(() => {
        if (mapContainerRef.current && !mapInstanceRef.current) {
            const map = L.map(mapContainerRef.current, { zoomControl: false }).setView(defaultPosition, 14);
            L.control.zoom({ position: 'bottomright' }).addTo(map);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            mapInstanceRef.current = map;
        }
        return () => {
            mapInstanceRef.current?.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    // Sync all markers (permits and visitors) with props
    React.useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        const currentMarkerIds = new Set<string>();

        // Process permits
        permits.forEach(permit => {
            const markerId = `permit-${permit.id}`;
            currentMarkerIds.add(markerId);
            const isSelected = selectedPermit?.id === permit.id;
            const icon = createPermitIcon(permit.riskLevel, isSelected);
            const position: L.LatLngTuple = [permit.lat, permit.lng];

            if (markersRef.current[markerId]) {
                markersRef.current[markerId].setLatLng(position).setIcon(icon).setZIndexOffset(isSelected ? 1000 : 0);
            } else {
                const marker = L.marker(position, { icon })
                    .addTo(map)
                    .on('click', () => onMarkerClick(permit));
                marker.bindPopup(createPermitPopupContent(permit));
                markersRef.current[markerId] = marker;
            }
        });

        // Process visitors
        visitors.forEach(visitor => {
            if (!visitor.lat || !visitor.lng) return;
            const markerId = `visitor-${visitor.id}`;
            currentMarkerIds.add(markerId);
            const isSelected = selectedVisitor?.id === visitor.id;
            const icon = createVisitorIcon(isSelected);
            const position: L.LatLngTuple = [visitor.lat, visitor.lng];

            if (markersRef.current[markerId]) {
                markersRef.current[markerId].setLatLng(position).setIcon(icon).setZIndexOffset(isSelected ? 2000 : 500); // Visitors on top
            } else {
                const marker = L.marker(position, { icon })
                    .addTo(map)
                    .on('click', () => onVisitorMarkerClick?.(visitor));
                marker.bindPopup(createVisitorPopupContent(visitor));
                markersRef.current[markerId] = marker;
            }
        });

        // Remove markers that are no longer in props
        Object.keys(markersRef.current).forEach(markerId => {
            if (!currentMarkerIds.has(markerId)) {
                markersRef.current[markerId].removeFrom(map);
                delete markersRef.current[markerId];
            }
        });

        // Handle map centering and popup opening
        const newSelectedId = selectedPermit?.id ? `permit-${selectedPermit.id}` : selectedVisitor?.id ? `visitor-${selectedVisitor.id}` : null;
        
        if (newSelectedId && newSelectedId !== prevSelectedIdRef.current) {
            const marker = markersRef.current[newSelectedId];
            if (marker) {
                map.flyTo(marker.getLatLng(), 16, { animate: true, duration: 0.5 });
                const timer = setTimeout(() => marker.openPopup(), 500);
                 // No cleanup function here as it could clear timers for rapid selections.
            }
        }
        prevSelectedIdRef.current = newSelectedId ?? null;

    }, [permits, selectedPermit, onMarkerClick, visitors, selectedVisitor, onVisitorMarkerClick]);


    return (
        <div 
            ref={mapContainerRef} 
            style={{ height: '100%', width: '100%' }} 
            className="z-0"
        />
    );
}
