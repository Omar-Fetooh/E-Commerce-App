import axios from "axios";
import { Address } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../Utils/index.js";

export const addAddress = async (req, res, next) => {
  const {
    country,
    city,
    postalCode,
    buildingNumber,
    floorNumber,
    addressLabel,
    setAsDefault,
  } = req.body;

  const userId = req.authUser;

  const cities = await axios.get(
    "https://api.api-ninjas.com/v1/city?country=EG&limit=30",
    {
      headers: {
        "X-Api-Key": process.env.CITY_API_KEY,
      },
    }
  );

  const isCityExists = cities.data.find((c) => c.name === city);
  if (!isCityExists) return next(new ErrorClass("city not found", 404));

  const newAddress = new Address({
    userId,
    country,
    city,
    postalCode,
    buildingNumber,
    floorNumber,
    addressLabel,
    isDefault: [true, false].includes(setAsDefault) ? setAsDefault : false,
  });

  if (newAddress.isDefault) {
    await Address.findOneAndUpdate(
      { userId, isDefault: true },
      { isDefault: false }
    );
  }

  const address = await newAddress.save();
  res.status(201).json({
    status: "success",
    message: "Address added successfully",
    address,
  });
};

export const updateAddress = async (req, res, next) => {
  const { addressId } = req.params;
  const userId = req.authUser;
  const {
    country,
    city,
    postalCode,
    buildingNumber,
    floorNumber,
    addressLabel,
    setAsDefault,
  } = req.body;

  const address = await Address.findOne({
    _id: addressId,
    userId,
  });

  if (!address) {
    return next(new ErrorClass("address not found", 404));
  }

  if (country) address.country = country;
  if (city) address.city = city;
  if (postalCode) address.postalCode = postalCode;
  if (buildingNumber) address.buildingNumber = buildingNumber;
  if (floorNumber) address.floorNumber = floorNumber;
  if (addressLabel) address.addressLabel = addressLabel;
  if ([true, false].includes(setAsDefault)) {
    (address.isDefault = [true, false].includes(setAsDefault)
      ? setAsDefault
      : false),
      await Address.updateOne(
        { userId, isDefault: true },
        { isDefault: false }
      );
  }

  await address.save();
  res
    .status(200)
    .json({ status: 200, message: "Address updated succesfully", address });
};

export const deleteAddress = async (req, res, next) => {
  const { addressId } = req.params;
  const userId = req.authUser;

  const address = await Address.findOneAndUpdate(
    {
      _id: addressId,
      userId,
    },
    {
      isMarkedAsDeleted: true,
      isDefault: false,
    },
    { new: true }
  );

  if (!address) {
    return next(new ErrorClass("address not found", 404));
  }

  res
    .status(200)
    .json({ status: 200, message: "Address Deleted succesfully", address });
};

export const getAllAddress = async (req, res, next) => {
  const userId = req.authUser._id;

  console.log(userId);

  const allAddresses = await Address.find({ userId, isMarkedAsDeleted: false });

  res.status(200).json({
    status: "true",
    message: "All addresses feteched successfully",
    allAddresses,
  });
};
