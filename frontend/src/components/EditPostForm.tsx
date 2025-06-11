import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFetchPostQuery, useEditPostMutation } from "../slices/postApiSlice";
import { useFetchCountriesQuery } from "../slices/countryApiSlice";

interface Country {
  name: string;
  capital: string;
  currencies: string;
  languages: string;
  flag: string;
}

const EditPostForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: any) => state.auth);
  const userId = userInfo?.user.userId;
  const token = userInfo?.token;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [country, setCountry] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [countryDetails, setCountryDetails] = useState<Country | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const { data: postData, isLoading: isPostLoading, error: postError } = useFetchPostQuery({ id: id! });
  const { data: countriesData, isLoading: isCountriesLoading, error: countriesError } = useFetchCountriesQuery({});
  const countries = countriesData?.countries || [];

  const [editPost, { isLoading: isSubmitting }] = useEditPostMutation();

  useEffect(() => {
    if (postData) {
      setTitle(postData.title);
      setContent(postData.content);
      setCountry(postData.country);
      setVisitDate(postData.visitDate?.slice(0, 10));
    }
  }, [postData]);

  useEffect(() => {
    const selected = countries.find((c: Country) => c.name === country);
    setCountryDetails(selected || null);
  }, [country, countries]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!token || !id) {
      setMessage("You must be logged in to edit this post.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("country", country);
      formData.append("visitDate", visitDate);
      formData.append("userId", userId);

      if (imageFile) {
        formData.append("imgUrl", imageFile);
      }

      await editPost({ id, formData, token }).unwrap();
      setMessage("Post updated successfully!");
      navigate("/");
      window.location.reload(); 
    } catch (err) {
      setMessage("Failed to update post.");
    }
  };

  if (isPostLoading || isCountriesLoading) {
    return (
      <Container maxWidth="sm">
        <Box my={5} textAlign="center">
          <CircularProgress />
          <Typography mt={2}>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  if (postError || countriesError) {
    return (
      <Container maxWidth="sm">
        <Box my={5}>
          <Alert severity="error">Failed to load data.</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box my={5}>
        <Typography variant="h4" color="primary" textAlign="center" gutterBottom>
          Edit Blog Post
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Content"
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            margin="normal"
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="country-label">Country</InputLabel>
            <Select
              labelId="country-label"
              value={country}
              label="Country"
              onChange={(e) => setCountry(e.target.value)}
            >
              {countries.map((c: Country) => (
                <MenuItem key={c.name} value={c.name}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {countryDetails && (
            <Box
              mt={2}
              p={2}
              border={1}
              borderRadius={2}
              borderColor="grey.300"
              bgcolor="white"
            >
              <Box display="flex" alignItems="center" mb={1}>
                <img
                  src={countryDetails.flag}
                  alt="flag"
                  style={{ width: 60, marginRight: 12 }}
                />
                <Typography variant="h6">{countryDetails.name}</Typography>
              </Box>
              <Typography variant="body2">
                <strong>Capital:</strong> {countryDetails.capital}
              </Typography>
              <Typography variant="body2">
                <strong>Currency:</strong> {countryDetails.currencies}
              </Typography>
            </Box>
          )}

          <TextField
            fullWidth
            label="Visit Date"
            type="date"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            margin="normal"
            required
          />

          <Button variant="outlined" component="label" sx={{ mt: 2 }}>
            Upload New Image
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </Button>

          {imageFile && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected: {imageFile.name}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            fullWidth
            sx={{ mt: 2 }}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Update Post"}
          </Button>

          {message && (
            <Alert severity={message.includes("success") ? "success" : "error"} sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}
        </form>
      </Box>
    </Container>
  );
};

export default EditPostForm;
