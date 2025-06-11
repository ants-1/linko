import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  CircularProgress,
} from "@mui/material";

import { useSelector } from "react-redux";
import { useCreateChatMutation } from "../slices/chatApiSlice";
import { useFetchCountriesQuery } from "../slices/countryApiSlice";
import { useNavigate } from "react-router-dom";

export default function CreateChatForm() {
  const [name, setName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: any) => state.auth);
  const userId = userInfo?.user.userId || userInfo?.user?._id;
  const token = userInfo?.token;

  // Fetch countries data from your API slice
  const { data, error, isLoading } = useFetchCountriesQuery({});
  const countries = data?.countries || [];

  const [createChat, { isLoading: isSubmitting, error: createError }] = useCreateChatMutation();

  // Handle country select change
  const handleCountryChange = (event: any) => {
    setSelectedCountry(event.target.value as string);
  };

  // Add selected country to the list, if not already added
  const handleAddCountry = () => {
    if (
      selectedCountry &&
      !selectedCountries.includes(selectedCountry)
    ) {
      setSelectedCountries((prev) => [...prev, selectedCountry]);
      setSelectedCountry("");
    }
  };

  // Remove country from selected list
  const handleRemoveCountry = (countryToRemove: string) => {
    setSelectedCountries((prev) => prev.filter((c) => c !== countryToRemove));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("hostId", userId);
    if (imageFile) {
      formData.append("imgUrl", imageFile);
    }
    selectedCountries.forEach((country) => {
      formData.append("countries", country);
    });


    try {
      await createChat({ formData, token }).unwrap();
      navigate("/chat");
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography mt={2}>Loading countries...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
        <Typography color="error">Failed to load countries.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, width: '100%', mx: "auto", mt: 4, p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }} gutterBottom>Create a New Chat</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Chat Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="country-select-label">Select Country</InputLabel>
          <Select
            labelId="country-select-label"
            value={selectedCountry}
            label="Select Country"
            onChange={handleCountryChange}
          >
            {countries.map((c: any) => (
              <MenuItem key={c.name} value={c.name}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="outlined"
            onClick={handleAddCountry}
            disabled={!selectedCountry}
            sx={{ mt: 1 }}
          >
            Add Country
          </Button>
        </FormControl>

        {/* Show selected countries as Chips with remove option */}
        {selectedCountries.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
            {selectedCountries.map((country) => (
              <Chip
                key={country}
                label={country}
                onDelete={() => handleRemoveCountry(country)}
                color="primary"
              />
            ))}
          </Stack>
        )}

        <Button variant="outlined" component="label" sx={{ mb: 2 }}>
          Upload Image
          <input type="file" hidden accept="image/*" onChange={handleImageChange} />
        </Button>

        {imageFile && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            Selected: {imageFile.name}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Creating..." : "Create Chat"}
        </Button>

        {createError && (
          <Typography color="error" mt={2}>
            Failed to create chat.
          </Typography>
        )}
      </form>
    </Box>
  );
}
