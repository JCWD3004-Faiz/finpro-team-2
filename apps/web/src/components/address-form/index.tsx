import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { fetchCities } from '@/redux/slices/globalSlice';
import { setLocationSuggestions, setSuggestionsPosition } from '@/redux/slices/userProfileSlice';

interface NewAddressFormProps {
  onAdd: (address: string, city_name: string, city_id:number) => void;
}

export function NewAddressForm({ onAdd }: NewAddressFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState("");
  const [city_name, setCity_name] = useState("");
  const [city_id, setCity_id] = useState<number | null>(null);
  const { cities } = useSelector((state: RootState) => state.global);
  const { locationSuggestions, suggestionsPosition } = useSelector((state: RootState) => state.userProfile);
  
  const handleSubmit = () => {
    if (!isValidLocation(city_name)) {
        alert('Please select a valid location.');
        return;
    } else if (address && city_name && city_id) {
      onAdd(address, city_name, Number(city_id));
      setAddress("");
      setCity_name("");
      setCity_id(null);
      setIsEditing(false);
    }
  };

    React.useEffect(() => {
      if (cities.length === 0) {
        dispatch(fetchCities());
      }
    }, [dispatch, cities.length]);

    const isValidLocation = (location: string) => {
      return cities.some((city) => city.city_name.toLowerCase() === location.toLowerCase());
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCity_name(value);
        const filteredSuggestions = getLocationSuggestions(value);
        dispatch(setLocationSuggestions(filteredSuggestions));
        const rect = e.target.getBoundingClientRect();
        dispatch(setSuggestionsPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        }));
    };

    const getLocationSuggestions = (input: string) => {
        return cities.filter((city) =>
          city.city_name.toLowerCase().includes(input.toLowerCase())
        );
    };

    const handleSuggestionClick = (suggestion: { city_name: string, city_id: number }) => {
      setCity_name(suggestion.city_name);
      setCity_id(suggestion.city_id);
      dispatch(setLocationSuggestions([]));
    };

  if (!isEditing) {
    return (
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 h-24 border-2 border-dashed hover:border-primary hover:text-primary transition-colors"
        onClick={() => setIsEditing(true)}
      >
        <PlusCircle className="h-5 w-5" />
        <span>Add New Address</span>
      </Button>
    );
  }

  return (
    <Card className="border-2 border-primary animate-in fade-in slide-in-from-bottom-4">
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
          <Input
            placeholder="City"
            value={city_name}
            onChange={handleLocationChange}
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button 
            variant="ghost" 
            onClick={() => setIsEditing(false)}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Address</Button>
        </div>
        {locationSuggestions.length > 0 && (
            <div
              className="absolute z-50 bg-white border border-gray-300 shadow-md rounded-lg max-h-40 overflow-auto"
              style={{
                top: `${suggestionsPosition.top}px`,
                left: `${suggestionsPosition.left}px`,
                width: `${suggestionsPosition.width}px`,
              }}
            >
              {locationSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                >
                  {suggestion.city_name}
                </div>
              ))}
            </div>
          )}
      </CardContent>
    </Card>
  );
}