import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";

const DisplayHospitalsOnMaps = () => {
  const [hospitals, setHospitals] = useState([]);
  //   const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng:  78.9629 }); // india
  const [currentLocationFetched, setCurrentLocationFetched] = useState(false);
  const [mapCenter, setMapCenter] = useState(null); // india
  const [zoom, setZoom] = useState(5);
  const [locations, setLocations] = useState({ lat: 0, lng: 0, title: "" });
  const mapRef = useRef(null);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BACKEND}/admin/GetHospitals`,
          {
            withCredentials: true,
          }
        );
        setHospitals(response.data);
        // console.log(response.data);
      } catch (error) {
        console.log(error);
        // toast.error("Error fetching doctors");
      }
    };
    fetchHospitals();
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setZoom(8);
          setCurrentLocationFetched(true);
          //   console.log("Current Location:",position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  const REACT_APP_GOOGLE_MAPS_API = import.meta.env.VITE_API_GOOGLE_MAPS;
  const libraries = ["places"];

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_API,
    libraries: libraries,
  });

  // Example locations (you can replace with your actual data)
  useEffect(() => {
    const initialLocations = [
      { lat: hospitals.lat, lng: hospitals.lng, title: hospitals.name },
    ];
    setLocations(initialLocations);
  }, [hospitals]);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  if (loadError) {
    return <div>Error loading Google Maps: {loadError.message}</div>;
  }
  return isLoaded && currentLocationFetched ? (
    <div className="w-full">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "500px" }}
        center={mapCenter}
        zoom={zoom}
        onLoad={onLoad}
      >
        {hospitals.map((hospital, index) => (
          <Marker
            key={hospital._id}
            position={{ lat: hospital.lat, lng: hospital.lng }}
            title={hospital.name}
          />
        ))}
      </GoogleMap>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default DisplayHospitalsOnMaps;
