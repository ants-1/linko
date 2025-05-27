import { NextFunction, Request, Response } from "express";
import countryModel from "../models/countryModel";

// @desc    Get all countries from RestCountries.com
// @route   GET /api/v1/countries
const getAllCountries = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const existingCountries = await countryModel.find();

    if (existingCountries.length > 0) {
      return res.status(200).json({ countries: existingCountries });
    }

    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "No countries found from API." });
    }

    const formattedCountries = data.map(formatCountryData);
    await countryModel.insertMany(formattedCountries);

    return res.status(201).json({ countries: formattedCountries });
  } catch (err) {
    return next(err);
  }
};

// Format the country data
const formatCountryData = (country: any) => {
  return {
    name: country.name && country.name.common ? country.name.common : "N/A",
    capital: country.capital && country.capital[0] ? country.capital[0] : "N/A",
    currencies: country.currencies ? Object.keys(country.currencies)[0] : "N/A",
    languages: country.languages
      ? Object.values(country.languages).join(", ")
      : "N/A",
    flag: country.flags && country.flags.svg ? country.flags.svg : "N/A",
  };
};

export default {
  getAllCountries,
};
