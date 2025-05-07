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
const AddHospital = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ shouldUnregister: true });

  const REACT_APP_GOOGLE_MAPS_API = import.meta.env.VITE_API_GOOGLE_MAPS;
  const libraries = ["places"];

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_API,
    libraries: libraries,
  });

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [address, setAddress] = useState("");
  const mapRef = useRef(null);
  const inputRef = useRef(null);

  const [selectedAddresslatitude, setSelectedAddressLatitude] = useState(0);
  const [selectedAddresslongitude, setSelectedAddressLongitude] = useState(0);

  const [mapCenter, setMapCenter] = useState({ lat: latitude, lng: longitude });
  const [markerPosition, setMarkerPosition] = useState(null);

  const autocompleteRef = useRef(null);

  const onMapClick = useCallback(async (event) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setSelectedAddressLatitude(lat);
      setSelectedAddressLongitude(lng);
      setMarkerPosition({ lat, lng });
      setMapCenter({ lat, lng });
    }
  }, []);

  // Function to handle place selection from Autocomplete
  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        setMapCenter(place.geometry.location.toJSON());
        setAddress(place.formatted_address || "");
        if (mapRef.current) {
          mapRef.current.panTo(place.geometry.location);
          mapRef.current.setZoom(15);
        }
      }
    }
  };

  // Autocomplete onLoad
  const onAutocompleteLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  useEffect(() => {
    if (inputRef.current && autocompleteRef.current) {
      autocompleteRef.current.bindTo("bounds", mapRef.current);
      inputRef.current.addEventListener("focus", () => {
        if (mapRef.current) {
          mapRef.current.setZoom(15);
          mapRef.current.setMapCenter(mapCenter);
        }
      });
    }
  }, [mapCenter]);

  const AddHospital = async (data) => {
    // console.log(data);
    const hospitalInfo = {
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      lat: selectedAddresslatitude,
      lng: selectedAddresslongitude,
    };
    // console.log(hospitalInfo);

    try {
      await axios.post(`${import.meta.env.VITE_API_BACKEND}/admin/addHospital`, hospitalInfo);
      toast.success("Hospital added successfully!");
      setMapCenter(0, 0);
      reset();
    } catch (error) {
      reset({
        name: "",
        email: "",
        mobile: "",
      });
      toast.error(error.response.data.message);
      console.log(error.response.data.message);
    }
  };

  const pincodeValue = watch("pincode");
  useEffect(() => {
    if (pincodeValue && pincodeValue.length == 6) {
      console.log("Pincode:", pincodeValue);

      const fetchPincodeLocation = async () => {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&postalcode=${pincodeValue}`
        );

        // console.log("API fetched Data:", response.data[0]);

        const fetchedLat = parseInt(response.data[0].lat);
        const fetchedLon = parseInt(response.data[0].lon);

        setMapCenter({ lat: fetchedLat, lng: fetchedLon });
        setLatitude(response.data[0].lat);
        setLongitude(response.data[0].lon);

        const response2 = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${fetchedLat}&lon=${fetchedLon}`
        );
        // console.log(response2.data.address);
        // console.log(response2.data.address.state);
        // console.log(response2.data.address.state_district);

        setValue("state", response2.data.address.state);
        setValue("city", response2.data.address.state_district);

        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${pincodeValue}&components=country:IN|postal_code:${pincodeValue}&key=${REACT_APP_GOOGLE_MAPS_API}`;

        const response3 = await axios.get(geocodingUrl);
        console.log(response3);
      };
      fetchPincodeLocation();
    }
  }, [pincodeValue]);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Maps...</div>;
  }

  return (
    <div className="p-2">
      {/* Breadcrumbs */}
      <div className="breadcrumbs text-sm">
        <ul className="">
          <li className="">Admin</li>
          <li className="text-emerald-500">Add Hospital</li>
        </ul>
      </div>

      {/* Page */}
      <section className="text-black">
        <div className="flex justify-start items-center">
          <h1 className="text-2xl font-bold py-3">Add Hospitals</h1>
        </div>
        <div className="rounded border-1 border-gray-300 p-3">
          <div className="">
            <h1 className="font-bold text-2xl m-1">Hospital Details</h1>
          </div>
          <form onSubmit={handleSubmit((data) => AddHospital(data))}>
            <div className="rounded border-1 border-gray-300 p-2 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {/* Hospital Nmae */}
                <div>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Hospital Name</legend>
                    <input
                      type="text"
                      className="input validator"
                      placeholder="AIIMS Hospital"
                      minLength={3}
                      maxLength={80}
                      {...register("name", { required: true })}
                    />
                    <p className="fieldset-label">Required</p>
                  </fieldset>
                </div>

                {/* Email */}
                <div>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Email</legend>
                    <input
                      type="email"
                      className="input validator"
                      placeholder="mail@example.com"
                      maxLength={30}
                      {...register("email", { required: true })}
                    />
                    <p className="fieldset-label">Required</p>
                  </fieldset>
                </div>

                {/* Mobile Numebr */}

                <div>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Contact</legend>
                    <input
                      type="tel"
                      className="input validator"
                      placeholder="967xxxx320"
                      pattern="^[0-9]+$"
                      minLength={10}
                      maxLength={10}
                      title="Field must contain only numbers"
                      {...register("mobile", { required: true })}
                    />
                    <p className="fieldset-label">Required</p>
                  </fieldset>
                </div>

                {/* Pin Code */}
                <div>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Pin Code</legend>
                    <input
                      type="tel"
                      required
                      className="input validator"
                      placeholder="Type here"
                      pattern="^[0-9]+$"
                      minLength={6}
                      maxLength={6}
                      {...register("pincode", { required: true })}
                    />
                    <p className="fieldset-label">Required</p>
                  </fieldset>
                </div>

                {/* City */}
                <div>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">City</legend>
                    <input
                      type="tel"
                      // disabled
                      className="input validator"
                      placeholder="Type here"
                      minLength={3}
                      maxLength={30}
                      {...register("city", { required: true })}
                    />
                    <p className="fieldset-label">Required</p>
                  </fieldset>
                </div>

                {/* State */}
                <div>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">State</legend>
                    <input
                      type="tel"
                      disabled
                      className="input validator"
                      placeholder="Type here"
                      pattern="^[a-zA-Z]+$"
                      minLength={3}
                      maxLength={30}
                      {...register("state", { required: true })}
                    />
                    <p className="fieldset-label">Required</p>
                  </fieldset>
                </div>

                {/* Address */}
                <div className="col-span-1  sm:col-span-2 md:col-span-3 lg:col-span-3 ">
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Address</legend>
                    <Autocomplete
                      onLoad={onAutocompleteLoad}
                      onPlaceChanged={handlePlaceSelect}
                    >
                      <input
                        ref={inputRef}
                        type="text"
                        className="input validator w-full"
                        placeholder="Enter location..."
                        minLength={3}
                        id="address"
                        {...register("address", { required: true })}
                      />
                    </Autocomplete>

                    <p className="fieldset-label">Required</p>
                  </fieldset>
                </div>

                {/* Google Maps */}
                {mapCenter.lat != 0 && mapCenter.lng != 0 && (
                  <div className="col-span-1  sm:col-span-2 md:col-span-3 lg:col-span-3 ">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">
                        Select Hospital Location on Map
                      </legend>
                      <div className="border-1 border-gray-300 rounded p-1 bg-amber-100">
                        <GoogleMap
                          mapContainerStyle={{
                            width: "100%",
                            height: "400px",
                          }}
                          center={mapCenter}
                          zoom={15}
                          onClick={onMapClick}
                        >
                          {markerPosition && (
                            <Marker position={markerPosition} />
                          )}
                        </GoogleMap>
                      </div>
                    </fieldset>
                  </div>
                )}
              </div>
            </div>
            {selectedAddresslongitude != 0 && selectedAddresslatitude != 0 ? (
              <div>
                <button className="btn bg-emerald-600 text-white hover:text-emerald-600 hover:bg-transparent hover:border-2 hover:border-emerald-600 my-4">
                  Add Hospital
                </button>
              </div>
            ) : (
              <div>
                Please type correct pincode to select location
                <br />
                <button
                  disabled
                  className="btn bg-emerald-600 text-white hover:text-emerald-600 hover:bg-transparent hover:border-2 hover:border-emerald-600 my-4"
                >
                  Add Hospital
                </button>
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};

export default AddHospital;
