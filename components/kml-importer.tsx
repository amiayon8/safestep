"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  useLoadScript,
  GoogleMap,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { useTheme } from "next-themes";
import { createClient } from "@/utils/supabase/client";
import { LoadingMaps } from "./loading-maps";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import {
  Play,
  Pause,
  RotateCcw,
  Upload,
  ExternalLink,
  CheckCircle2,
  Navigation,
  MapPin,
  Route,
  Info,
  Clock,
  Radio,
  FileCode,
  Compass,
  Trash2,
  Pencil,
  Plus,
  Check,
  X,
  MousePointerClick,
} from "lucide-react";

interface KmlStep {
  stepIndex: number;
  lat: number;
  lng: number;
  altitude: number;
  distanceFromPrevious: number;
  cumulativeDistance: number;
  bearing: number;
  googleMapsUrl: string;
  googleMapsStreetViewUrl: string;
  googleMapsDirectionsUrl: string;
}

interface RawCoordinatePoint {
  lat: number;
  lng: number;
  altitude: number;
}

const sampleKmlPreset = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Directions from VCC2+3P Dhaka to World University of Bangladesh, Dhaka</name>
    <Style id="icon-1899-DB4436-nodesc-normal">
      <IconStyle>
        <color>ff3644db</color>
        <scale>1</scale>
        <Icon>
          <href>https://www.gstatic.com/mapspro/images/stock/503-wht-blank_maps.png</href>
        </Icon>
        <hotSpot x="32" xunits="pixels" y="64" yunits="insetPixels"/>
      </IconStyle>
      <LabelStyle>
        <scale>0</scale>
      </LabelStyle>
      <BalloonStyle>
        <text><![CDATA[<h3>$[name]</h3>]]></text>
      </BalloonStyle>
    </Style>
    <Style id="icon-1899-DB4436-nodesc-highlight">
      <IconStyle>
        <color>ff3644db</color>
        <scale>1</scale>
        <Icon>
          <href>https://www.gstatic.com/mapspro/images/stock/503-wht-blank_maps.png</href>
        </Icon>
        <hotSpot x="32" xunits="pixels" y="64" yunits="insetPixels"/>
      </IconStyle>
      <LabelStyle>
        <scale>1</scale>
      </LabelStyle>
      <BalloonStyle>
        <text><![CDATA[<h3>$[name]</h3>]]></text>
      </BalloonStyle>
    </Style>
    <StyleMap id="icon-1899-DB4436-nodesc">
      <Pair>
        <key>normal</key>
        <styleUrl>#icon-1899-DB4436-nodesc-normal</styleUrl>
      </Pair>
      <Pair>
        <key>highlight</key>
        <styleUrl>#icon-1899-DB4436-nodesc-highlight</styleUrl>
      </Pair>
    </StyleMap>
    <Style id="line-1267FF-5000-nodesc-normal">
      <LineStyle>
        <color>ffff6712</color>
        <width>5</width>
      </LineStyle>
      <BalloonStyle>
        <text><![CDATA[<h3>$[name]</h3>]]></text>
      </BalloonStyle>
    </Style>
    <Style id="line-1267FF-5000-nodesc-highlight">
      <LineStyle>
        <color>ffff6712</color>
        <width>7.5</width>
      </LineStyle>
      <BalloonStyle>
        <text><![CDATA[<h3>$[name]</h3>]]></text>
      </BalloonStyle>
    </Style>
    <StyleMap id="line-1267FF-5000-nodesc">
      <Pair>
        <key>normal</key>
        <styleUrl>#line-1267FF-5000-nodesc-normal</styleUrl>
      </Pair>
      <Pair>
        <key>highlight</key>
        <styleUrl>#line-1267FF-5000-nodesc-highlight</styleUrl>
      </Pair>
    </StyleMap>
    <Placemark>
      <name>Directions from VCC2+3P Dhaka to World University of Bangladesh, Dhaka</name>
      <styleUrl>#line-1267FF-5000-nodesc</styleUrl>
      <LineString>
        <tessellate>1</tessellate>
        <coordinates>
          90.40137,23.87019,0
          90.40137,23.87049,0
          90.40135,23.8709,0
          90.40135,23.87099,0
          90.40171,23.87101,0
          90.40188,23.87101,0
          90.40224,23.87102,0
          90.40308,23.87105,0
          90.40309,23.87105,0
          90.4034,23.87107,0
          90.40341,23.87143,0
          90.40341,23.87162,0
          90.40341,23.87213,0
          90.40342,23.87262,0
          90.40399,23.87264,0
          90.40397,23.87312,0
          90.40396,23.87329,0
          90.40395,23.87362,0
          90.40356,23.8736,0
          90.40335,23.87359,0
          90.40333,23.87407,0
          90.40332,23.87463,0
          90.40311,23.87463,0
          90.40273,23.87461,0
          90.40176,23.87457,0
          90.40079,23.87453,0
          90.40074,23.87453,0
          90.40063,23.87453,0
          90.4004,23.87452,0
          90.40027,23.87452,0
          90.39987,23.87452,0
          90.39928,23.87453,0
          90.39882,23.8745,0
          90.39825,23.87447,0
          90.39789,23.87446,0
          90.39742,23.87445,0
          90.39661,23.87439,0
          90.39603,23.87437,0
          90.39521,23.87434,0
          90.39504,23.87433,0
          90.39434,23.87431,0
          90.39389,23.8743,0
          90.39348,23.8743,0
          90.39289,23.87429,0
          90.39222,23.87428,0
          90.39202,23.87428,0
          90.39183,23.87428,0
          90.39144,23.87428,0
          90.39106,23.87428,0
          90.39087,23.87428,0
          90.39075,23.87427,0
          90.38973,23.87426,0
          90.38916,23.87423,0
          90.38844,23.87423,0
          90.38773,23.87421,0
          90.38733,23.8742,0
          90.38694,23.8742,0
          90.38655,23.87419,0
          90.38635,23.87419,0
          90.38624,23.87418,0
          90.38537,23.87417,0
          90.38491,23.87416,0
          90.38458,23.87416,0
          90.38403,23.87415,0
          90.38397,23.87414,0
          90.38386,23.87414,0
          90.38367,23.87414,0
          90.38344,23.87413,0
          90.38327,23.87414,0
          90.38315,23.87414,0
          90.38295,23.87413,0
          90.38287,23.87413,0
          90.38276,23.87413,0
          90.38256,23.87413,0
          90.38217,23.87413,0
          90.38118,23.87412,0
          90.3804,23.8741,0
          90.37987,23.87409,0
          90.37981,23.87409,0
          90.37976,23.87409,0
          90.3797,23.87408,0
          90.37967,23.87406,0
          90.37964,23.87404,0
          90.37959,23.87402,0
          90.3795,23.87398,0
          90.37946,23.87395,0
          90.37942,23.87394,0
          90.37936,23.87393,0
          90.3793,23.87392,0
          90.37923,23.87393,0
          90.37845,23.87399,0
          90.37833,23.87399,0
          90.37787,23.87404,0
          90.37773,23.87405,0
          90.37734,23.87409,0
          90.37703,23.87412,0
          90.37622,23.87422,0
          90.37601,23.87425,0
          90.37567,23.87429,0
          90.37547,23.87432,0
          90.37531,23.87435,0
          90.37515,23.87438,0
          90.3744,23.87451,0
          90.37415,23.87455,0
          90.37349,23.87464,0
          90.37341,23.87465,0
          90.37308,23.87469,0
          90.3729,23.87471,0
          90.3723,23.87479,0
          90.37179,23.87485,0
          90.37118,23.87492,0
          90.37088,23.87496,0
          90.37071,23.87498,0
          90.36999,23.87506,0
          90.36984,23.87508,0
          90.36981,23.87508,0
          90.36964,23.8751,0
          90.36942,23.87512,0
          90.36936,23.87512,0
          90.36921,23.87513,0
          90.36912,23.87514,0
          90.36904,23.87513,0
          90.36902,23.87509,0
          90.369,23.87506,0
          90.36898,23.87502,0
          90.36894,23.87499,0
          90.36891,23.87496,0
          90.36887,23.87494,0
          90.36883,23.87492,0
          90.36879,23.87491,0
          90.36874,23.8749,0
          90.36869,23.87489,0
          90.36867,23.8749,0
          90.36856,23.87475,0
          90.36853,23.87469,0
          90.36851,23.87459,0
          90.3684,23.87396,0
          90.36838,23.87383,0
          90.36834,23.8736,0
          90.36833,23.87354,0
          90.36827,23.87328,0
          90.36821,23.87301,0
          90.3682,23.87296,0
          90.36813,23.87267,0
          90.36802,23.87201,0
          90.36799,23.87188,0
          90.36791,23.87138,0
          90.36791,23.87135,0
          90.36777,23.87057,0
          90.36773,23.87028,0
          90.36763,23.86965,0
          90.36754,23.86912,0
          90.36752,23.86904,0
          90.36751,23.86898,0
          90.36746,23.86844,0
          90.36746,23.86835,0
          90.36745,23.8682,0
          90.36741,23.86797,0
          90.36739,23.86786,0
          90.36733,23.86763,0
          90.36727,23.8674,0
          90.36704,23.86699,0
          90.36685,23.86677,0
          90.36667,23.86655,0
          90.36654,23.8664,0
          90.36642,23.86627,0
          90.36636,23.86621,0
          90.36632,23.86616,0
          90.36629,23.86612,0
          90.36626,23.86607,0
          90.36621,23.86595,0
          90.36608,23.86525,0
          90.36606,23.86515,0
          90.366,23.86473,0
          90.36594,23.86443,0
          90.36592,23.86427,0
          90.36589,23.86398,0
          90.36588,23.8639,0
          90.36583,23.86369,0
          90.36579,23.86351,0
          90.36573,23.86334,0
          90.36572,23.86325,0
          90.36567,23.86276,0
          90.36553,23.86191,0
          90.36544,23.86124,0
          90.36539,23.86098,0
          90.3654,23.86098,0
          90.36541,23.86097,0
          90.36542,23.86097,0
          90.36542,23.86096,0
          90.36543,23.86096,0
          90.36543,23.86095,0
          90.36544,23.86094,0
          90.36544,23.86093,0
          90.36545,23.86092,0
          90.36545,23.86091,0
          90.36545,23.8609,0
          90.36545,23.86089,0
          90.36545,23.86088,0
          90.36545,23.86087,0
          90.36545,23.86086,0
          90.36544,23.86085,0
          90.36544,23.86084,0
          90.36543,23.86083,0
          90.36542,23.86082,0
          90.36541,23.86081,0
          90.3654,23.86081,0
          90.3654,23.8608,0
          90.36539,23.8608,0
          90.36538,23.8608,0
          90.36535,23.86066,0
          90.36505,23.85869,0
          90.36501,23.85843,0
          90.365,23.85842,0
          90.36492,23.85794,0
          90.3648,23.85721,0
          90.3648,23.85716,0
          90.36472,23.85664,0
          90.36469,23.85647,0
          90.36469,23.85645,0
          90.36468,23.85639,0
          90.36462,23.85597,0
          90.36455,23.85556,0
          90.36453,23.8554,0
          90.36452,23.85538,0
          90.36449,23.8552,0
          90.36446,23.85501,0
          90.36432,23.85415,0
          90.36429,23.85383,0
          90.36427,23.85373,0
          90.36422,23.8534,0
          90.36409,23.85251,0
          90.36407,23.85237,0
          90.36396,23.85163,0
          90.36394,23.85151,0
          90.36381,23.85066,0
          90.36377,23.85039,0
          90.36374,23.85019,0
          90.36353,23.84876,0
          90.36351,23.84862,0
          90.36351,23.84861,0
          90.36351,23.84859,0
          90.36339,23.84787,0
          90.36326,23.8471,0
          90.36326,23.84709,0
          90.36327,23.84709,0
          90.36327,23.84708,0
          90.36328,23.84707,0
          90.36333,23.84706,0
          90.36349,23.84703,0
          90.36404,23.84693,0
          90.36435,23.84689,0
          90.36512,23.84679,0
          90.36542,23.84675,0
          90.36627,23.84664,0
          90.36636,23.84663,0
          90.36744,23.84648,0
          90.36861,23.84633,0
          90.36939,23.84623,0
          90.36978,23.84618,0
          90.37017,23.84613,0
          90.37072,23.84606,0
          90.37073,23.84613,0
          90.37087,23.84711,0
          90.37089,23.84721,0
          90.37091,23.8473,0
          90.37105,23.84815,0
          90.37111,23.8486,0
          90.37119,23.849,0
          90.37126,23.84945,0
          90.37133,23.84991,0
          90.37134,23.84996,0
          90.37138,23.85022,0
          90.37145,23.85075,0
          90.37149,23.85102,0
        </coordinates>
      </LineString>
    </Placemark>
    <Placemark>
      <name>World University of Bangladesh, Dhaka</name>
      <styleUrl>#icon-1899-DB4436-nodesc</styleUrl>
      <Point>
        <coordinates>
          90.3714949,23.8510222,0
        </coordinates>
      </Point>
    </Placemark>
  </Document>
</kml>
`;

function calculateDistanceInMeters(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number,
): number {
  const earthRadiusMeters = 6371000;
  const deltaLatitude = ((latitude2 - latitude1) * Math.PI) / 180;
  const deltaLongitude = ((longitude2 - longitude1) * Math.PI) / 180;
  const halfChordLengthSquared =
    Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
    Math.cos((latitude1 * Math.PI) / 180) *
      Math.cos((latitude2 * Math.PI) / 180) *
      Math.sin(deltaLongitude / 2) *
      Math.sin(deltaLongitude / 2);
  const angularDistanceRadians =
    2 *
    Math.atan2(
      Math.sqrt(halfChordLengthSquared),
      Math.sqrt(1 - halfChordLengthSquared),
    );
  return earthRadiusMeters * angularDistanceRadians;
}

function calculateBearingDegrees(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number,
): number {
  const latitude1Radians = (latitude1 * Math.PI) / 180;
  const latitude2Radians = (latitude2 * Math.PI) / 180;
  const deltaLongitudeRadians = ((longitude2 - longitude1) * Math.PI) / 180;
  const y = Math.sin(deltaLongitudeRadians) * Math.cos(latitude2Radians);
  const x =
    Math.cos(latitude1Radians) * Math.sin(latitude2Radians) -
    Math.sin(latitude1Radians) *
      Math.cos(latitude2Radians) *
      Math.cos(deltaLongitudeRadians);
  const initialBearingRadians = Math.atan2(y, x);
  return ((initialBearingRadians * 180) / Math.PI + 360) % 360;
}

function getCompassDirection(bearingDegrees: number): string {
  const cardinalDirections = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const directionIndex = Math.round(bearingDegrees / 22.5) % 16;
  return cardinalDirections[directionIndex];
}

function buildStepsFromCoordinates(
  coordinatePoints: RawCoordinatePoint[],
): KmlStep[] {
  const steps: KmlStep[] = [];
  let cumulativeDistanceMeters = 0;

  for (let index = 0; index < coordinatePoints.length; index++) {
    const currentPoint = coordinatePoints[index];
    const previousPoint =
      index > 0 ? coordinatePoints[index - 1] : currentPoint;

    const segmentDistanceMeters =
      index > 0
        ? calculateDistanceInMeters(
            previousPoint.lat,
            previousPoint.lng,
            currentPoint.lat,
            currentPoint.lng,
          )
        : 0;

    cumulativeDistanceMeters += segmentDistanceMeters;

    const bearingDegrees =
      index > 0
        ? calculateBearingDegrees(
            previousPoint.lat,
            previousPoint.lng,
            currentPoint.lat,
            currentPoint.lng,
          )
        : 0;

    const googleMapsUrl = `https://www.google.com/maps?q=${currentPoint.lat},${currentPoint.lng}`;
    const googleMapsStreetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${currentPoint.lat},${currentPoint.lng}`;
    const googleMapsDirectionsUrl =
      index > 0
        ? `https://www.google.com/maps/dir/?api=1&origin=${previousPoint.lat},${previousPoint.lng}&destination=${currentPoint.lat},${currentPoint.lng}&travelmode=walking`
        : `https://www.google.com/maps/search/?api=1&query=${currentPoint.lat},${currentPoint.lng}`;

    steps.push({
      stepIndex: index + 1,
      lat: currentPoint.lat,
      lng: currentPoint.lng,
      altitude: currentPoint.altitude,
      distanceFromPrevious: segmentDistanceMeters,
      cumulativeDistance: cumulativeDistanceMeters,
      bearing: bearingDegrees,
      googleMapsUrl,
      googleMapsStreetViewUrl,
      googleMapsDirectionsUrl,
    });
  }

  return steps;
}

function parseKmlCoordinates(kmlRawText: string): KmlStep[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(kmlRawText, "application/xml");
  const parseErrors = xmlDoc.getElementsByTagName("parsererror");
  if (parseErrors.length > 0) {
    throw new Error("Invalid XML or KML format.");
  }

  const rawCoordinateStrings: string[] = [];
  const lineStringNodes = xmlDoc.getElementsByTagName("LineString");

  if (lineStringNodes.length > 0) {
    for (let i = 0; i < lineStringNodes.length; i++) {
      const coordNodes = lineStringNodes[i].getElementsByTagName("coordinates");
      for (let j = 0; j < coordNodes.length; j++) {
        const text = coordNodes[j].textContent;
        if (text) {
          rawCoordinateStrings.push(text);
        }
      }
    }
  } else {
    const gxCoordNodes = xmlDoc.getElementsByTagName("gx:coord");
    if (gxCoordNodes.length > 0) {
      for (let i = 0; i < gxCoordNodes.length; i++) {
        const text = gxCoordNodes[i].textContent;
        if (text) {
          rawCoordinateStrings.push(text.trim().replace(/\s+/g, ","));
        }
      }
    } else {
      const coordinateNodes = xmlDoc.getElementsByTagName("coordinates");
      for (let i = 0; i < coordinateNodes.length; i++) {
        const text = coordinateNodes[i].textContent;
        if (text) {
          rawCoordinateStrings.push(text);
        }
      }
    }
  }

  const extractedPoints: RawCoordinatePoint[] = [];

  rawCoordinateStrings.forEach((block) => {
    const lines = block.trim().split(/\s+/);
    lines.forEach((line) => {
      const parts = line.split(",").map((value) => parseFloat(value.trim()));
      if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        const longitude = parts[0];
        const latitude = parts[1];
        const altitude = parts.length > 2 && !isNaN(parts[2]) ? parts[2] : 0;
        if (
          latitude >= -90 &&
          latitude <= 90 &&
          longitude >= -180 &&
          longitude <= 180
        ) {
          const previousPoint = extractedPoints[extractedPoints.length - 1];
          if (
            !previousPoint ||
            previousPoint.lat !== latitude ||
            previousPoint.lng !== longitude
          ) {
            extractedPoints.push({ lat: latitude, lng: longitude, altitude });
          }
        }
      }
    });
  });

  if (extractedPoints.length === 0) {
    throw new Error("No route path coordinates found in KML.");
  }

  return buildStepsFromCoordinates(extractedPoints);
}

export default function KmlImporter() {
  const supabase = createClient();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [rawKmlInput, setRawKmlInput] = useState("");
  const [steps, setSteps] = useState<KmlStep[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [syncToSupabase, setSyncToSupabase] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [clickMapToAdd, setClickMapToAdd] = useState(false);

  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [editLatitude, setEditLatitude] = useState("");
  const [editLongitude, setEditLongitude] = useState("");
  const [editAltitude, setEditAltitude] = useState("");

  const [isAddingNewStep, setIsAddingNewStep] = useState(false);
  const [newStepLatitude, setNewStepLatitude] = useState("");
  const [newStepLongitude, setNewStepLongitude] = useState("");
  const [newStepAltitude, setNewStepAltitude] = useState("0");

  const stepListRef = useRef<HTMLDivElement>(null);
  const activeStepItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const parsedSteps = parseKmlCoordinates(sampleKmlPreset);
      setSteps(parsedSteps);
      setRawKmlInput(sampleKmlPreset);
    } catch {
      setSteps([]);
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const content = loadEvent.target?.result as string;
      if (content) {
        setRawKmlInput(content);
        handleParse(content);
      }
    };
    reader.readAsText(file);
  };

  const handleParse = (kmlTextToParse: string) => {
    try {
      setErrorMessage(null);
      setIsPlaying(false);
      setCurrentStepIndex(-1);
      setEditingStepIndex(null);
      setIsAddingNewStep(false);
      const parsed = parseKmlCoordinates(kmlTextToParse);
      setSteps(parsed);
      if (parsed.length > 0 && mapInstance) {
        mapInstance.panTo({ lat: parsed[0].lat, lng: parsed[0].lng });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to parse KML";
      setErrorMessage(message);
      setSteps([]);
    }
  };

  const executeStep = useCallback(
    async (stepToRun: KmlStep) => {
      if (mapInstance) {
        mapInstance.panTo({ lat: stepToRun.lat, lng: stepToRun.lng });
      }

      if (syncToSupabase) {
        const calculatedSpeedKmph =
          stepToRun.distanceFromPrevious > 0
            ? Math.min(
                15,
                Number((stepToRun.distanceFromPrevious * 3.6).toFixed(1)),
              )
            : 3.5;

        const currentDate = new Date();
        const gpsDateString = currentDate.toISOString().split("T")[0];
        const gpsTimeString = currentDate.toTimeString().split(" ")[0];

        try {
          await supabase.from("gps_data").insert({
            latitude: stepToRun.lat,
            longitude: stepToRun.lng,
            altitude: stepToRun.altitude || 10.5,
            speed: calculatedSpeedKmph,
            course: Math.round(stepToRun.bearing),
            satellites: 9,
            hdop: 0.9,
            gps_date: gpsDateString,
            gps_time: gpsTimeString,
          });
        } catch {}
      }
    },
    [mapInstance, syncToSupabase, supabase],
  );

  useEffect(() => {
    if (!isPlaying) return;

    const intervalTimer = setInterval(() => {
      setCurrentStepIndex((previousIndex) => {
        const nextIndex = previousIndex + 1;
        if (nextIndex >= steps.length) {
          setIsPlaying(false);
          return previousIndex;
        }
        executeStep(steps[nextIndex]);
        return nextIndex;
      });
    }, 1000);

    return () => clearInterval(intervalTimer);
  }, [isPlaying, steps, executeStep]);

  useEffect(() => {
    if (activeStepItemRef.current && stepListRef.current) {
      activeStepItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [currentStepIndex]);

  const handleStart = () => {
    if (steps.length === 0) return;
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      executeStep(steps[0]);
    } else if (currentStepIndex === -1) {
      setCurrentStepIndex(0);
      executeStep(steps[0]);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
    if (steps.length > 0 && mapInstance) {
      mapInstance.panTo({ lat: steps[0].lat, lng: steps[0].lng });
    }
  };

  const handleSelectStep = (index: number) => {
    setCurrentStepIndex(index);
    executeStep(steps[index]);
  };

  const handleDeleteStep = (targetIndex: number) => {
    setIsPlaying(false);
    const updatedRawPoints = steps
      .filter((_, index) => index !== targetIndex)
      .map((step) => ({
        lat: step.lat,
        lng: step.lng,
        altitude: step.altitude,
      }));

    const recalculated = buildStepsFromCoordinates(updatedRawPoints);
    setSteps(recalculated);

    if (currentStepIndex >= recalculated.length) {
      setCurrentStepIndex(recalculated.length - 1);
    }
    if (editingStepIndex === targetIndex) {
      setEditingStepIndex(null);
    }
  };

  const handleStartEdit = (index: number) => {
    const step = steps[index];
    setEditingStepIndex(index);
    setEditLatitude(step.lat.toString());
    setEditLongitude(step.lng.toString());
    setEditAltitude(step.altitude.toString());
  };

  const handleSaveEdit = () => {
    if (editingStepIndex === null) return;

    const parsedLat = parseFloat(editLatitude);
    const parsedLng = parseFloat(editLongitude);
    const parsedAlt = parseFloat(editAltitude) || 0;

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      setErrorMessage("Please provide valid numerical coordinates.");
      return;
    }

    if (
      parsedLat < -90 ||
      parsedLat > 90 ||
      parsedLng < -180 ||
      parsedLng > 180
    ) {
      setErrorMessage(
        "Latitude must be between -90 and 90, Longitude between -180 and 180.",
      );
      return;
    }

    setErrorMessage(null);
    const updatedRawPoints = steps.map((step, index) => {
      if (index === editingStepIndex) {
        return { lat: parsedLat, lng: parsedLng, altitude: parsedAlt };
      }
      return { lat: step.lat, lng: step.lng, altitude: step.altitude };
    });

    const recalculated = buildStepsFromCoordinates(updatedRawPoints);
    setSteps(recalculated);
    setEditingStepIndex(null);

    if (mapInstance) {
      mapInstance.panTo({ lat: parsedLat, lng: parsedLng });
    }
  };

  const handleCancelEdit = () => {
    setEditingStepIndex(null);
  };

  const handleConfirmAddStep = () => {
    const parsedLat = parseFloat(newStepLatitude);
    const parsedLng = parseFloat(newStepLongitude);
    const parsedAlt = parseFloat(newStepAltitude) || 0;

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      setErrorMessage("Please enter valid numerical latitude and longitude.");
      return;
    }

    if (
      parsedLat < -90 ||
      parsedLat > 90 ||
      parsedLng < -180 ||
      parsedLng > 180
    ) {
      setErrorMessage(
        "Latitude must be -90 to 90, Longitude must be -180 to 180.",
      );
      return;
    }

    setErrorMessage(null);
    const existingRawPoints = steps.map((step) => ({
      lat: step.lat,
      lng: step.lng,
      altitude: step.altitude,
    }));

    const updatedRawPoints = [
      ...existingRawPoints,
      { lat: parsedLat, lng: parsedLng, altitude: parsedAlt },
    ];

    const recalculated = buildStepsFromCoordinates(updatedRawPoints);
    setSteps(recalculated);
    setIsAddingNewStep(false);
    setNewStepLatitude("");
    setNewStepLongitude("");
    setNewStepAltitude("0");

    if (mapInstance) {
      mapInstance.panTo({ lat: parsedLat, lng: parsedLng });
    }
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (!clickMapToAdd || !event.latLng) return;

    const clickedLat = event.latLng.lat();
    const clickedLng = event.latLng.lng();

    const existingRawPoints = steps.map((step) => ({
      lat: step.lat,
      lng: step.lng,
      altitude: step.altitude,
    }));

    const updatedRawPoints = [
      ...existingRawPoints,
      { lat: clickedLat, lng: clickedLng, altitude: 0 },
    ];

    const recalculated = buildStepsFromCoordinates(updatedRawPoints);
    setSteps(recalculated);
  };

  const handleClearAllSteps = () => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
    setEditingStepIndex(null);
    setSteps([]);
  };

  const polylineCoordinates = steps.map((step) => ({
    lat: step.lat,
    lng: step.lng,
  }));

  const activeStep =
    currentStepIndex >= 0 && currentStepIndex < steps.length
      ? steps[currentStepIndex]
      : null;

  const mapCenter = activeStep
    ? { lat: activeStep.lat, lng: activeStep.lng }
    : steps.length > 0
      ? { lat: steps[0].lat, lng: steps[0].lng }
      : { lat: 23.8103, lng: 90.4125 };

  const totalRouteDistanceMeters =
    steps.length > 0 ? steps[steps.length - 1].cumulativeDistance : 0;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            KML Route Importer
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Clean path extraction with free Google Maps links and step editing
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-2"
          >
            <Info className="size-4" />
            <span>How to get free KML</span>
          </Button>

          <label className="cursor-pointer">
            <input
              type="file"
              accept=".kml,.xml"
              onChange={handleFileUpload}
              className="hidden"
            />
            <span className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
              <Upload className="size-4" />
              Upload .kml
            </span>
          </label>
        </div>
      </div>

      {showGuide && (
        <Card className="bg-muted/40 border-primary/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="size-4 text-primary" />
              Export Free KML from Google Maps
            </CardTitle>
            <CardDescription>
              Placemarks, styles, and non-path markers are automatically skipped
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-card rounded-lg border space-y-1">
                <span className="font-semibold text-foreground text-xs uppercase tracking-wider">
                  Step 1: Open Google My Maps
                </span>
                <p className="text-xs">
                  Go to{" "}
                  <a
                    href="https://www.google.com/maps/d/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    Google My Maps
                    <ExternalLink className="size-3" />
                  </a>{" "}
                  and click &quot;Create a new map&quot;.
                </p>
              </div>

              <div className="p-3 bg-card rounded-lg border space-y-1">
                <span className="font-semibold text-foreground text-xs uppercase tracking-wider">
                  Step 2: Draw Route or Add Directions
                </span>
                <p className="text-xs">
                  Draw your walking path or create walking directions between
                  points.
                </p>
              </div>

              <div className="p-3 bg-card rounded-lg border space-y-1">
                <span className="font-semibold text-foreground text-xs uppercase tracking-wider">
                  Step 3: Export Clean KML
                </span>
                <p className="text-xs">
                  Export as KML and upload here. All extraneous placemark
                  metadata is skipped automatically.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="overflow-hidden">
            <div className="h-[420px] w-full relative bg-muted">
              {!isLoaded ? (
                <LoadingMaps />
              ) : (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={mapCenter}
                  zoom={17}
                  onLoad={(map) => setMapInstance(map)}
                  onClick={handleMapClick}
                  options={{
                    zoomControl: true,
                    streetViewControl: false,
                    fullscreenControl: true,
                    mapTypeControl: true,
                    rotateControl: false,
                    scaleControl: true,
                    ...(isDark && { colorScheme: "DARK" }),
                  }}
                >
                  {polylineCoordinates.length > 1 && (
                    <Polyline
                      path={polylineCoordinates}
                      options={{
                        strokeColor: "#3b82f6",
                        strokeOpacity: 0.85,
                        strokeWeight: 4,
                      }}
                    />
                  )}

                  {polylineCoordinates.length > 0 && (
                    <Marker
                      position={polylineCoordinates[0]}
                      label="S"
                      title="Start Location"
                    />
                  )}

                  {polylineCoordinates.length > 1 && (
                    <Marker
                      position={
                        polylineCoordinates[polylineCoordinates.length - 1]
                      }
                      label="E"
                      title="Destination"
                    />
                  )}

                  {activeStep && (
                    <Marker
                      position={{ lat: activeStep.lat, lng: activeStep.lng }}
                      icon={{
                        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                        scale: 7,
                        rotation: activeStep.bearing,
                        fillColor: "#ef4444",
                        fillOpacity: 1,
                        strokeColor: "#ffffff",
                        strokeWeight: 2,
                      }}
                      title={`Step ${activeStep.stepIndex}`}
                    />
                  )}
                </GoogleMap>
              )}

              <div className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border text-xs shadow-sm flex items-center gap-2">
                <Radio
                  className={`size-3 ${isPlaying ? "text-green-500 animate-pulse" : "text-muted-foreground"}`}
                />
                <span className="font-medium">
                  {isPlaying ? "Live Step Emulation Active" : "Emulation Idle"}
                </span>
              </div>

              <button
                onClick={() => setClickMapToAdd(!clickMapToAdd)}
                className={`absolute top-3 right-3 px-2.5 py-1.5 rounded-lg border text-xs font-medium shadow-sm transition-all flex items-center gap-1.5 backdrop-blur-sm ${
                  clickMapToAdd
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card/90 text-foreground border-border hover:bg-card"
                }`}
              >
                <MousePointerClick className="size-3.5" />
                <span>
                  {clickMapToAdd
                    ? "Map Click: Adding Steps"
                    : "Click Map to Add"}
                </span>
              </button>
            </div>

            <CardContent className="p-4 border-t flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {!isPlaying ? (
                  <Button
                    onClick={handleStart}
                    disabled={steps.length === 0}
                    className="flex items-center gap-2"
                  >
                    <Play className="size-4" />
                    <span>
                      {currentStepIndex >= 0 ? "Resume" : "Start Import"}
                    </span>
                  </Button>
                ) : (
                  <Button
                    onClick={handlePause}
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    <Pause className="size-4" />
                    <span>Pause</span>
                  </Button>
                )}

                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="icon"
                  title="Reset to beginning"
                  disabled={steps.length === 0}
                >
                  <RotateCcw className="size-4" />
                </Button>

                <div className="flex items-center gap-2 ml-2 pl-4 border-l">
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={syncToSupabase}
                      onChange={(e) => setSyncToSupabase(e.target.checked)}
                      className="rounded border-input text-primary focus:ring-primary size-4"
                    />
                    <span>Stream to Supabase Live Tracking</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Route className="size-3.5" />
                  <span>
                    {steps.length} Steps (
                    {(totalRouteDistanceMeters / 1000).toFixed(2)} km)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  <span>
                    {currentStepIndex >= 0
                      ? `${currentStepIndex + 1}/${steps.length}`
                      : `0/${steps.length}`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileCode className="size-4 text-primary" />
                Raw KML Input
              </CardTitle>
              <CardDescription>
                Paste custom KML text or load sample presets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <textarea
                value={rawKmlInput}
                onChange={(e) => setRawKmlInput(e.target.value)}
                rows={5}
                placeholder="Paste <kml>...</kml> XML string here..."
                className="w-full text-xs font-mono p-3 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />

              {errorMessage && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-lg">
                  {errorMessage}
                </div>
              )}

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setRawKmlInput(sampleKmlPreset);
                    handleParse(sampleKmlPreset);
                  }}
                >
                  Load Sample Route
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleParse(rawKmlInput)}
                  disabled={!rawKmlInput.trim()}
                >
                  Parse & Load Steps
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="flex flex-col h-[760px]">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Navigation className="size-4 text-primary" />
                  Route Steps ({steps.length})
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs flex items-center gap-1"
                    onClick={() => {
                      setIsAddingNewStep(!isAddingNewStep);
                      if (!isAddingNewStep && steps.length > 0) {
                        const lastStep = steps[steps.length - 1];
                        setNewStepLatitude(lastStep.lat.toFixed(5));
                        setNewStepLongitude(lastStep.lng.toFixed(5));
                        setNewStepAltitude(lastStep.altitude.toString());
                      }
                    }}
                  >
                    <Plus className="size-3" />
                    <span>Add Step</span>
                  </Button>

                  {steps.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={handleClearAllSteps}
                      title="Clear all steps"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
              <CardDescription className="text-xs">
                Edit, add, or delete any step. Links are 100% free Google Maps.
              </CardDescription>
            </CardHeader>

            <CardContent
              className="flex-1 overflow-y-auto p-3 space-y-2.5"
              ref={stepListRef}
            >
              {isAddingNewStep && (
                <div className="p-3 rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 space-y-2.5 text-xs">
                  <div className="font-semibold text-foreground flex items-center justify-between">
                    <span>Add New Step {steps.length + 1}</span>
                    <button
                      onClick={() => setIsAddingNewStep(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-muted-foreground block mb-0.5">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        placeholder="23.8103"
                        value={newStepLatitude}
                        onChange={(e) => setNewStepLatitude(e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border bg-background font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground block mb-0.5">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        placeholder="90.4125"
                        value={newStepLongitude}
                        onChange={(e) => setNewStepLongitude(e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border bg-background font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setIsAddingNewStep(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="h-6 px-2 text-xs flex items-center gap-1"
                      onClick={handleConfirmAddStep}
                      disabled={!newStepLatitude || !newStepLongitude}
                    >
                      <Check className="size-3" />
                      Save Step
                    </Button>
                  </div>
                </div>
              )}

              {steps.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-xs text-center p-4">
                  <MapPin className="size-8 stroke-1 mb-2 text-muted-foreground/60" />
                  <span>
                    No steps available. Click &quot;Add Step&quot; or upload a
                    KML file.
                  </span>
                </div>
              ) : (
                steps.map((step, index) => {
                  const isActive = index === currentStepIndex;
                  const isCompleted = index < currentStepIndex;
                  const isEditing = editingStepIndex === index;

                  return (
                    <div
                      key={step.stepIndex}
                      ref={isActive ? activeStepItemRef : null}
                      onClick={() => handleSelectStep(index)}
                      className={`p-3 rounded-lg border text-xs transition-all cursor-pointer ${
                        isActive
                          ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                          : isCompleted
                            ? "border-border/60 bg-muted/30 opacity-80 hover:opacity-100"
                            : "border-border hover:border-primary/40 bg-card"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex items-center justify-center size-5 rounded-full font-bold text-[10px] ${
                              isActive
                                ? "bg-primary text-primary-foreground animate-pulse"
                                : isCompleted
                                  ? "bg-muted text-muted-foreground"
                                  : "bg-muted text-foreground"
                            }`}
                          >
                            {step.stepIndex}
                          </span>
                          <span className="font-semibold text-foreground">
                            Step {step.stepIndex}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          {isCompleted && (
                            <CheckCircle2 className="size-3.5 text-green-500 mr-1" />
                          )}
                          {isActive && (
                            <span className="text-[10px] font-medium text-primary uppercase tracking-wider mr-1">
                              Processing
                            </span>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEdit(index);
                            }}
                            className="p-1 text-muted-foreground hover:text-foreground rounded hover:bg-muted"
                            title="Edit this step"
                          >
                            <Pencil className="size-3.5" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteStep(index);
                            }}
                            className="p-1 text-muted-foreground hover:text-destructive rounded hover:bg-destructive/10"
                            title="Delete this step"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      {isEditing ? (
                        <div
                          className="space-y-2 pt-2 border-t mt-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-muted-foreground block mb-0.5">
                                Latitude
                              </label>
                              <input
                                type="number"
                                step="any"
                                value={editLatitude}
                                onChange={(e) =>
                                  setEditLatitude(e.target.value)
                                }
                                className="w-full px-2 py-1 text-xs rounded border bg-background font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-muted-foreground block mb-0.5">
                                Longitude
                              </label>
                              <input
                                type="number"
                                step="any"
                                value={editLongitude}
                                onChange={(e) =>
                                  setEditLongitude(e.target.value)
                                }
                                className="w-full px-2 py-1 text-xs rounded border bg-background font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-1.5 pt-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              className="h-6 px-2 text-xs flex items-center gap-1"
                              onClick={handleSaveEdit}
                            >
                              <Check className="size-3" />
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-1 text-[11px] text-muted-foreground mb-2">
                            <div>
                              Lat:{" "}
                              <span className="font-mono text-foreground">
                                {step.lat.toFixed(5)}
                              </span>
                            </div>
                            <div>
                              Lng:{" "}
                              <span className="font-mono text-foreground">
                                {step.lng.toFixed(5)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Compass className="size-3 text-muted-foreground" />
                              <span>
                                {Math.round(step.bearing)}° (
                                {getCompassDirection(step.bearing)})
                              </span>
                            </div>
                            <div>
                              Seg:{" "}
                              <span className="font-mono">
                                {step.distanceFromPrevious.toFixed(1)}m
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                            <a
                              href={step.googleMapsUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 text-[10px] font-medium text-primary hover:underline"
                            >
                              <ExternalLink className="size-3" />
                              <span>Google Maps</span>
                            </a>

                            <span className="text-muted-foreground/40">•</span>

                            <a
                              href={step.googleMapsStreetViewUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:underline"
                            >
                              <span>Street View</span>
                            </a>

                            {index > 0 && (
                              <>
                                <span className="text-muted-foreground/40">
                                  •
                                </span>
                                <a
                                  href={step.googleMapsDirectionsUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:underline"
                                >
                                  <span>Directions</span>
                                </a>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
