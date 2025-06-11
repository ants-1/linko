import React, { useEffect, useState } from "react";
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
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFetchCountriesQuery } from "../slices/countryApiSlice";
import { useFetchChatQuery, useEditChatMutation } from "../slices/chatApiSlice";

export default function EditChatForm() {
  const { id } = useParams<{ id: string }>();
  const chatId = id;
  console.log('chatid', chatId)
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: any) => state.auth);
  const userId = userInfo?.user.userId || userInfo?._id;
  const token = userInfo?.token;

  const [name, setName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const { data: chatData, isLoading: isChatLoading, error: chatError } = useFetchChatQuery(chatId!);
  const { data: countriesData, isLoading: isCountriesLoading, error: countriesError } = useFetchCountriesQuery({});
  const countries = countriesData?.countries || [];

  const [editChat, { isLoading: isSubmitting }] = useEditChatMutation();

useEffect(() => {
  if (chatData) {
    setName(chatData.name);
    if (typeof chatData.countries === "string") {
      setSelectedCountries(chatData.countries.split(","));
    } else if (Array.isArray(chatData.countries)) {
      setSelectedCountries(chatData.countries);
    } else {
      setSelectedCountries([]);
    }
  }
}, [chatData]);


  const handleCountryChange = (event: any) => {
    setSelectedCountry(event.target.value);
  };

  const handleAddCountry = () => {
    if (selectedCountry && !selectedCountries.includes(selectedCountry)) {
      setSelectedCountries((prev) => [...prev, selectedCountry]);
      setSelectedCountry("");
    }
  };

  const handleRemoveCountry = (countryToRemove: string) => {
    setSelectedCountries((prev) => prev.filter((c) => c !== countryToRemove));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !chatId) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("hostId", userId);
    formData.append("countries", selectedCountries.join(","));
    if (imageFile) {
      formData.append("imgUrl", imageFile);
    }

    try {
      await editChat({ chatId, formData, token }).unwrap();
      setMessage("Chat updated successfully!");
      navigate("/chat");
      window.location.reload(); 
    } catch (error) {
      setMessage("Failed to update chat.");
      console.error("Edit chat error:", error);
    }
  };

  if (isChatLoading || isCountriesLoading) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography mt={2}>Loading chat data...</Typography>
      </Box>
    );
  }

  if (chatError || countriesError) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
        <Alert severity="error">Failed to load chat or country data.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, width: "100%", mx: "auto", mt: 4, p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2}} gutterBottom>Edit Chat</Typography>
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

        <Button variant="outlined" component="label" sx={{ mb: 2 }}>
          Upload New Image
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
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Updating..." : "Update Chat"}
        </Button>

        {message && (
          <Alert severity={message.includes("success") ? "success" : "error"} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
      </form>
    </Box>
  );
}
